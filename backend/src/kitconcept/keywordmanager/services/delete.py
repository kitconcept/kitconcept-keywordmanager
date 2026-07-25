from kitconcept.keywordmanager.interfaces import IKeywordManager
from plone.base.interfaces import IPloneSiteRoot
from plone.restapi.deserializer import json_body
from plone.restapi.services import Service
from zExceptions import BadRequest
from zope.component import getUtility


class KeywordsDelete(Service):
    def reply(self):
        data = json_body(self.request)
        km = getUtility(IKeywordManager)
        keywords = data.get("items") or []
        query = {}
        if idx := self.request.form.get("idx"):
            query["indexName"] = idx

        if not isinstance(keywords, list):
            raise BadRequest(
                f"Invalid request: 'items' must be of type 'list', "
                f"but received '{type(keywords).__name__}'."
            )
        if not keywords:
            raise BadRequest("Invalid request: missing required parameter 'items'.")

        query["keywords"] = keywords
        if IPloneSiteRoot.providedBy(self.context):
            km.delete(**query)
        else:
            km.delete(context=self.context, **query)

        return self.reply_no_content()
