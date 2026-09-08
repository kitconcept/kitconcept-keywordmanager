from kitconcept.keywordmanager import _
from plone.autoform import directives
from plone.restapi.controlpanels import RegistryConfigletPanel
from zope import schema
from zope.component import adapter
from zope.interface import Interface


class IKeywordManagerSettings(Interface):
    """Keyword Manager settings stored in the backend"""

    manage_keywords_permission = schema.Choice(
        title=_("Permission"),
        description=_("", default=""),
        required=True,
        default="kitconcept.keywordmanager: Manage Keywords",
        vocabulary="kitconcept.keywordmanager.vocabularies.permissions",
    )

    meta_type = schema.TextLine(
        title=_("Type"),
        description=_(
            "",
            default="Meta type of the keyword indexes. If you're one of those "
            "crazy people that use custom indexes, you'll want to update this.",
        ),
        default="KeywordIndex",
        required=True,
    )

    directives.widget(
        "ignore_indexes",
        vocabulary="kitconcept.keywordmanager.vocabularies.indexes",
        frontendOptions={
            "widgetProps": {"isMulti": True},
        },
    )

    ignore_indexes = schema.List(
        title=_("Ignore indexes"),
        description=_(
            "",
            default="indexes of META_TYPE we know we don't want to manage, "
            "because bad things(tm) will happen",
        ),
        required=True,
        default=["block_types", "getEventType"],
        value_type=schema.TextLine(),
    )

    directives.widget(
        "always_reindex",
        vocabulary="kitconcept.keywordmanager.vocabularies.indexes",
        frontendOptions={
            "widgetProps": {"isMulti": True},
        },
    )

    always_reindex = schema.List(
        title=_("Always reindex"),
        description=_(
            "",
            default="A list of indexes that should always be reindexed when merging "
            "or deleting keywords on objects. Most people won't need this.",
        ),
        required=True,
        default=["SearchableText"],
        value_type=schema.TextLine(),
    )


@adapter(Interface, Interface)
class KeywordManagerControlpanel(RegistryConfigletPanel):
    """Keyword Manager Settings Control panel"""

    title = _("Keyword Manager Settings")
    schema = IKeywordManagerSettings
    schema_prefix = "kitconcept.keywordmanager"
    configlet_id = "KeywordManagerSettings"
    configlet_category_id = "Products"
    group = "Products"
