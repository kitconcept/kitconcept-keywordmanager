from kitconcept.keywordmanager.interfaces import IKeywordManager
from plone.restapi.deserializer import json_body
from plone.restapi.services import Service
from zExceptions import BadRequest
from zope.component import getUtility


class KeywordsPatch(Service):
    def reply(self):
        data = json_body(self.request)
        km = getUtility(IKeywordManager)

        new_keyword = data.get("new_keyword") or ""
        old_keywords = data.get("old_keywords") or []

        if not isinstance(new_keyword, str):
            raise BadRequest("")
        if not new_keyword:
            raise BadRequest("")
        if not isinstance(old_keywords, list):
            raise BadRequest("")
        if not old_keywords:
            raise BadRequest("")

        km.change(new_keyword, old_keywords)

        return self.reply_no_content()
