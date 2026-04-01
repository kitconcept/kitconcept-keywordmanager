from kitconcept.keywordmanager.interfaces import IKeywordManager
from plone.restapi.batching import HypermediaBatch
from plone.restapi.services import Service
from zope.component import getUtility


class KeywordsGet(Service):
    def reply(self):
        km = getUtility(IKeywordManager)
        query = {"withLengths": True}
        if idx := self.request.form.get("idx"):
            query = {"indexName": idx}

        keywords = km.getKeywords(**query)

        batch = HypermediaBatch(self.request, keywords)
        items = []
        for kw in batch:
            items.append({"name": kw[0], "total": kw[1]})

        keywords_data = {
            "@id": batch.canonical_url,
            "items": items,
            "items_total": batch.items_total,
        }
        if batch.links:
            keywords_data["batching"] = batch.links
        return keywords_data


class KeywordIndexesGet(Service):
    def reply(self):
        km = getUtility(IKeywordManager)
        return km.getKeywordIndexes()
