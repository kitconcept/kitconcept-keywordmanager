from kitconcept.keywordmanager.interfaces import IKeywordManager
from plone.restapi.batching import HypermediaBatch
from plone.restapi.deserializer import json_body
from plone.restapi.services import Service
from zope.component import getUtility


class TagsGet(Service):
    def reply(self):
        data = json_body(self.request)
        km = getUtility(IKeywordManager)
        query = {"withLengths": True}
        if idx := data.get("idx"):
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
