from AccessControl import ClassSecurityInfo
from Acquisition import aq_base
from kitconcept.keywordmanager import config
from kitconcept.keywordmanager.interfaces import IKeywordManager
from plone import api
from plone.dexterity.interfaces import IDexterityContent
from Products.CMFCore.indexing import processQueue
from zope.interface import implementer


try:
    from plone.app.discussion.interfaces import IComment
except ImportError:

    class IComment:
        """Dummy class for when p.a.discussion is not installed/available"""


# Python imports
try:
    import Levenshtein

    USE_LEVENSHTEIN = True
except ImportError:
    import difflib

    USE_LEVENSHTEIN = False


@implementer(IKeywordManager)
class KeywordManager:
    """A utility to manage keywords within Plone."""

    security = ClassSecurityInfo()

    manage_options = ({"label": "Overview", "action": "manage_overview"},)

    def _getFullIndexList(self, indexName):
        idxs = {indexName}.union(config.ALWAYS_REINDEX)
        return list(idxs)

    @security.protected(config.MANAGE_KEYWORDS_PERMISSION)
    def change(
        self,
        new_keyword: str,
        old_keywords: list,
        context=None,
        indexName: str = "Subject",
    ) -> int:
        """Updates all objects using the old_keywords.

        Objects using the old_keywords will be using the new_keyword
        afterwards.

        Returns the number of objects that have been updated.
        """

        # #MOD Dynamic field getting
        query = {indexName: old_keywords}
        if context is not None:
            query["path"] = "/".join(context.getPhysicalPath())

        brains = api.content.find(**query)

        for brain in brains:
            obj = brain.getObject()
            # #MOD Dynamic field getting

            value = self.getFieldValue(obj, indexName)
            if isinstance(value, (list, tuple)):
                # MULTIVALUED FIELD
                value = set(value)
                value = value - set(old_keywords)
                value.add(new_keyword)
                value = list(value)
            elif isinstance(value, set):
                value = value - set(old_keywords)
                value.add(new_keyword)
            else:
                # MONOVALUED FIELD
                value = new_keyword

            self.updateObject(obj, indexName, value)

        return len(brains)

    @security.protected(config.MANAGE_KEYWORDS_PERMISSION)
    def delete(self, keywords: list, context=None, indexName: str = "Subject") -> int:
        """Removes the keywords from all objects using it.

        Returns the number of objects that have been updated.
        """
        # query = {indexName: keywords}
        if context is not None:
            query["path"] = "/".join(context.getPhysicalPath())
        brains = api.content.find(**query)

        for brain in brains:
            obj = brain.getObject()
            value = self.getFieldValue(obj, indexName)
            if isinstance(value, (list, tuple)):
                # MULTIVALUED
                value = list(value)
                for element in keywords:
                    while element in value:
                        value.remove(element)
            elif type(value) is set:
                value = value - set(keywords)
            else:
                # MONOVALUED
                value = None

            self.updateObject(obj, indexName, value)

        return len(brains)

    def updateObject(self, obj, indexName: str, value) -> None:
        updateField = self.getSetter(obj, indexName)
        if updateField is not None:
            updateField(value)
            idxs = self._getFullIndexList(indexName)
            obj.reindexObject(idxs=idxs)

    @security.protected(config.MANAGE_KEYWORDS_PERMISSION)
    def getKeywords(
        self, indexName: str = "Subject", withLengths: bool = False
    ) -> list[str] | list[tuple[str, int]]:
        """Return all unique keyword values from the specified catalog index.

        Args:
            indexName: The name of the keyword index to query. Defaults to "Subject".
            withLengths: If True, returns tuples of (keyword, count) instead of
            just keywords. Defaults to False.

        Returns:
            A list of keyword strings, or a list of (keyword, count) tuples if
            withLengths is True.

        Raises:
            ValueError: If indexName is not a valid keyword index.
        """
        processQueue()
        if indexName not in self.getKeywordIndexes():
            raise ValueError(f"'{indexName}' is not a valid index")

        catalog = api.portal.get_tool("portal_catalog")
        keywords = list(
            catalog.Indexes[indexName].uniqueValues(withLengths=withLengths)
        )

        # can we turn this into a yield?
        return keywords

    def getKeywordLength(self, key, indexName: str = "Subject") -> int:
        processQueue()
        if indexName not in self.getKeywordIndexes():
            raise ValueError(f"{indexName} is not a valid field")

        catalog = api.portal.get_tool("portal_catalog")
        idx = catalog._catalog.getIndex(indexName)

        try:
            val = idx._index[key]
        except KeyError:
            count = 0
        else:
            count = len(val)

        return count

    @security.protected(config.MANAGE_KEYWORDS_PERMISSION)
    def getScoredMatches(self, word, possibilities, num, score, context=None):
        """Take a word, compare it to a list of possibilities,
        return max. num matches > score).
        """
        if not USE_LEVENSHTEIN:
            # No levenshtein module around. Fall back to difflib
            return difflib.get_close_matches(word, possibilities, num, score)

        # Levenshtein is around, so let's use it.
        res = []

        for item in possibilities:
            if word.lower() in item.lower():
                # if the word is a substring always include it
                lscore = 1
            else:
                lscore = Levenshtein.ratio(word, item)

            if lscore > score:
                res.append((lscore, item))

        # Sort by score and alphabet (high scores on top of list)
        res.sort(reverse=True)

        # Return first n terms without scores
        return [item[1] for item in res[:num]]

    def getKeywordIndexes(self) -> list[str]:
        """Gets a list of indexes from the catalog. Uses config.py to choose the
        meta type and filters out a subset of known indexes that should not be
        managed.
        """
        catalog = api.portal.get_tool("portal_catalog")
        idxs = catalog.index_objects()
        idxs = [
            i.id
            for i in idxs
            if i.meta_type == config.META_TYPE and i.id not in config.IGNORE_INDEXES
        ]
        idxs.sort()
        return idxs

    @security.private
    def fieldNameForIndex(self, indexName: str) -> str:
        """The name of the index may not be the same as the field on the object,
        and we need the actual field name in order to find its mutator.
        """
        catalog = api.portal.get_tool("portal_catalog")
        indexObjs = [idx for idx in catalog.index_objects() if idx.getId() == indexName]
        try:
            fieldName = indexObjs[0].indexed_attrs[0]
        except IndexError as err:
            raise ValueError(f"Found no index named {indexName}") from err

        return fieldName

    @security.private
    def getSetter(self, obj, indexName: str):
        """Gets the setter function for the field based on the index name.

        Returns None if it can't get the function
        """

        # DefaultDublinCoreImpl:
        setterName = "set" + indexName
        if getattr(aq_base(obj), setterName, None) is not None:
            return getattr(obj, setterName)

        # other
        fieldName = self.fieldNameForIndex(indexName)
        field = None

        # Dexterity
        if IDexterityContent.providedBy(obj):
            if fieldName.startswith("get"):
                fieldName = fieldName.lstrip("get_")
            # heuristics
            fieldName = fieldName[0].lower() + fieldName[1:]
            return lambda value: setattr(aq_base(obj), fieldName, value)

        # Always reindex discussion objects, since their values will have been acquired
        if IComment.providedBy(obj):
            return lambda value: None

        # Anything left is maybe AT content
        field = getattr(aq_base(obj), "getField", None)
        # Archetypes:
        if field:
            fieldObj = field(fieldName) or field(fieldName.lower())
            if not fieldObj and fieldName.startswith("get"):
                fieldName = fieldName.lstrip("get_")
                fieldName = fieldName[0].lower() + fieldName[1:]
                fieldObj = obj.getField(fieldName)
            if fieldObj is not None:
                return fieldObj.getMutator(obj)
            return None

        return None

    def getFieldValue(self, obj, indexName):
        fieldName = self.fieldNameForIndex(indexName)
        fieldVal = getattr(obj, fieldName, ())
        if not fieldVal and fieldName.startswith("get"):
            fieldName = fieldName.lstrip("get_")
            fieldName = fieldName[0].lower() + fieldName[1:]
            fieldVal = getattr(obj, fieldName, ())

        if callable(fieldVal):
            return fieldVal()
        else:
            return fieldVal
