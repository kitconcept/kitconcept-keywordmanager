from kitconcept.keywordmanager.interfaces import IKeywordManager
from plone.restapi.deserializer import json_body
from plone.restapi.services import Service
from zope.component import getUtility
from zExceptions import HTTPAccepted as Accepted
from zExceptions import BadRequest


class TagsDelete(Service):
    def reply(self):
        km = getUtility(IKeywordManager)
        data = json_body(self.request)
        if keywords := data.get("items"):
            keywords = keywords.split(",")
        else:
            raise BadRequest("Please provide keywords to delete")
        breakpoint()

        deleted = km.delete(keywords)

        return Accepted(f"Updated {deleted} objects")
