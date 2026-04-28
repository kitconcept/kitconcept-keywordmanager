from kitconcept.keywordmanager.interfaces import IKeywordManager
from plone import api
from plone.restapi.deserializer import json_body
from plone.restapi.services import Service
from zExceptions import BadRequest
from zope.component import getUtility


class KeywordsDelete(Service):
    def reply(self):
        data = json_body(self.request)
        km = getUtility(IKeywordManager)
        keywords = data.get("items") or []
        paths = data.get("paths") or []
        query = {}
        if idx := self.request.form.get("idx"):
            query["indexName"] = idx

        if not isinstance(keywords, list):
            raise BadRequest(
                f"Invalid request: 'items' must be of type 'list', but received '{type(keywords).__name__}'."
            )
        if not keywords:
            raise BadRequest("Invalid request: missing required parameter 'items'.")
        if paths and not isinstance(paths, list):
            raise BadRequest(
                f"Invalid request: 'paths' must be of type 'list', but received '{type(paths).__name__}'."
            )

        query["keywords"] = keywords
        if not paths:
            km.delete(**query)
        else:
            [km.delete(context=api.content.get(path=path), **query) for path in paths]

        return self.reply_no_content()
