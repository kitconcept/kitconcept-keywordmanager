from kitconcept.keywordmanager.interfaces import IKeywordManager
from plone import api
from plone.restapi.batching import HypermediaBatch
from plone.restapi.deserializer import json_body
from plone.restapi.services import Service
from zope.component import getUtility


class TagsGet(Service):
    def reply(self):
        km = getUtility(IKeywordManager)
        data = json_body(self.request)
        query = {}
        if idx := data.get("idx"):
            query = {"indexName": idx}

        keywords = km.getKeywords(**query)

        batch = HypermediaBatch(self.request, keywords)
        # get the total count of each keyword in the batch
        # TODO: can we optimize this?
        items = []
        for kw in batch:
            catalog = api.portal.get_tool("portal_catalog")
            brains = catalog(Subject=kw)
            total = len(brains)
            items.append({"name": kw, "total": total})

        keywords_data = {
            "@id": batch.canonical_url,
            "items": items,
            "items_total": batch.items_total,
        }
        if batch.links:
            keywords_data["batching"] = batch.links
        return keywords_data
