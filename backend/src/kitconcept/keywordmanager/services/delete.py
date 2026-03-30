from kitconcept.keywordmanager.interfaces import IKeywordManager
from plone.restapi.deserializer import json_body
from plone.restapi.services import Service
from zExceptions import BadRequest
from zope.component import getUtility


class TagsDelete(Service):
    def reply(self):
        data = json_body(self.request)
        km = getUtility(IKeywordManager)
        keywords = data.get("items", [])

        if isinstance(keywords, str):
            keywords = [keywords]

        try:
            km.delete(keywords)
        except Exception as err:
            raise BadRequest(err) from err

        return self.reply_no_content()
