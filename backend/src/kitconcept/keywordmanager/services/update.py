from kitconcept.keywordmanager.interfaces import IKeywordManager
from plone.restapi.deserializer import json_body
from plone.restapi.services import Service
from zExceptions import BadRequest
from zope.component import getUtility


class KeywordsPatch(Service):
    def reply(self):
        data = json_body(self.request)
        km = getUtility(IKeywordManager)
        query = {}
        if idx := self.request.form.get("idx"):
            query["indexName"] = idx

        new_keyword = data.get("new_keyword") or ""
        old_keywords = data.get("old_keywords") or []

        if not isinstance(new_keyword, str):
            raise BadRequest(
                f"Invalid request: 'new_keyword' must be of type 'str', but received '{type(new_keyword).__name__}'."
            )
        if not new_keyword:
            raise BadRequest(
                "Invalid request: missing required parameter 'new_keyword'."
            )
        if not isinstance(old_keywords, list):
            raise BadRequest(
                f"Invalid request: 'old_keywords' must be of type 'list', but received '{type(old_keywords).__name__}'."
            )
        if not old_keywords:
            raise BadRequest(
                "Invalid request: missing required parameter 'old_keywords'."
            )

        km.change(new_keyword, old_keywords, **query)

        return self.reply_no_content()
