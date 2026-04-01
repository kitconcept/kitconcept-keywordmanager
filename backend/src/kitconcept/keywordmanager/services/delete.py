from kitconcept.keywordmanager.interfaces import IKeywordManager
from plone.restapi.deserializer import json_body
from plone.restapi.services import Service
from zExceptions import BadRequest
from zope.component import getUtility


class KeywordsDelete(Service):
    def reply(self):
        data = json_body(self.request)
        km = getUtility(IKeywordManager)
        keywords = data.get("items") or []

        if not isinstance(keywords, list):
            raise BadRequest("")
        if not keywords:
            raise BadRequest("")

        km.delete(keywords)

        return self.reply_no_content()
