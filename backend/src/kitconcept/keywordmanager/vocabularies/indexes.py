from Products.CMFCore.utils import getToolByName
from zope.interface import provider
from zope.schema.interfaces import IVocabularyFactory
from zope.schema.vocabulary import SimpleTerm
from zope.schema.vocabulary import SimpleVocabulary


@provider(IVocabularyFactory)
def catalog_indexes_vocabulary(context) -> SimpleVocabulary:
    catalog = getToolByName(context, "portal_catalog")
    names = sorted(catalog.indexes())
    terms = [SimpleTerm(value=n, token=n, title=n) for n in names]
    return SimpleVocabulary(terms)
