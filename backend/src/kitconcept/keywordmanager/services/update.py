from kitconcept.keywordmanager.interfaces import IKeywordManager
from plone.restapi.deserializer import json_body
from plone.restapi.services import Service
from zExceptions import BadRequest
from zope.component import getUtility


class TagsPatch(Service):
    def reply(self):
        data = json_body(self.request)
        km = getUtility(IKeywordManager)

        new_keyword = data.get("new_keyword", "")
        old_keywords = data.get("old_keywords", [])

        try:
            km.change(new_keyword, old_keywords)
        except Exception as err:
            raise BadRequest(err) from err

        return self.reply_no_content()
