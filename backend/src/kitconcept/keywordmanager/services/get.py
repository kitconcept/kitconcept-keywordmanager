from kitconcept.keywordmanager.interfaces import IKeywordManager
from plone.restapi.batching import HypermediaBatch
from plone.restapi.services import Service
from zope.component import getUtility
from zope.interface import implementer
from zope.publisher.interfaces import IPublishTraverse


@implementer(IPublishTraverse)
class KeywordsGet(Service):
    """/@keywords Endpoint."""

    def __init__(self, context, request):
        super().__init__(context, request)
        self.context = context
        self.request = request
        self.params = []

    def publishTraverse(self, request, name):
        # Consume any path segments after /@keywords as parameters
        self.params.append(name)
        return self

    def reply(self):
        km = getUtility(IKeywordManager)
        query = {"withLengths": True}
        if idx := self.request.form.get("idx"):
            query["indexName"] = idx

        if len(self.params) == 0:
            keywords = km.getKeywords(**query)
        else:
            keywords = km.getKeyword(self.params[0])

        batch = HypermediaBatch(self.request, keywords)
        if len(self.params) == 0:
            items = [{"name": name, "total": count} for name, count in batch]
        else:
            items = list(batch)

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
