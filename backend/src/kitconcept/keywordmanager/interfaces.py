"""Module where all interfaces, events and exceptions live."""

from zope.interface import Interface
from zope.publisher.interfaces.browser import IDefaultBrowserLayer


class IBrowserLayer(IDefaultBrowserLayer):
    """Marker interface that defines a browser layer."""


class IKeywordManager(Interface):
    """A utility that allows to manage keywords"""

    def change(old_keywords, new_keyword):
        """Updates all objects using the old_keywords.

        Objects using the old_keywords will be using the new_keywords
        afterwards.
        """

    def delete(keywords):
        """Removes the keywords from all objects using it."""
