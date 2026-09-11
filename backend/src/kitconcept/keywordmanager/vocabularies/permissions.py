from AccessControl.Permission import getPermissions
from zope.interface import provider
from zope.schema.interfaces import IVocabularyFactory
from zope.schema.vocabulary import SimpleTerm
from zope.schema.vocabulary import SimpleVocabulary


@provider(IVocabularyFactory)
def permissions_vocabulary(context) -> SimpleVocabulary:
    terms = [
        SimpleTerm(value=p[0], token=p[0].replace(" ", "_"), title=p[0])
        for p in sorted(getPermissions())
    ]
    return SimpleVocabulary(terms)
