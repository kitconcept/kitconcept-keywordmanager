from kitconcept.keywordmanager.interfaces import IKeywordManager
from plone.restapi.batching import HypermediaBatch
from plone.restapi.services import Service
from zExceptions import BadRequest
from zope.component import getUtility


class KeywordsGet(Service):
    """/@keywords Endpoint."""

    def reply(self):
        km = getUtility(IKeywordManager)
        query = {"withLengths": True}
        if idx := self.request.form.get("idx"):
            query["indexName"] = idx

        keywords = km.getKeywords(**query)

        if sort_order := self.request.form.get("sort_order"):
            if sort_order not in ("ascending", "descending"):
                raise BadRequest(
                    f"Invalid sort_order '{sort_order}'. Must be 'ascending' or 'descending'."
                )
            reverse = sort_order == "descending"

        sort_keys = {
            "keyword": lambda x: x[0].lower(),
            "occurrence": lambda x: x[1],
        }

        if sort_on := self.request.form.get("sort_on"):
            if sort_on not in sort_keys:
                raise BadRequest(
                    f"Invalid sort_on '{sort_on}'. Must be 'alphabetical' or 'frequency'."
                )
            keywords.sort(key=sort_keys.get(sort_on), reverse=reverse)

        result = {
            "@id": self.context.absolute_url(),
            "items": [{"name": name, "total": count} for name, count in keywords],
            "items_total": len(keywords),
        }
        return result


class KeywordIndexesGet(Service):
    def reply(self):
        km = getUtility(IKeywordManager)
        return km.getKeywordIndexes()
