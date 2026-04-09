from plone import api

import pytest
import transaction


@pytest.fixture(scope="class")
def portal(portal_class):
    yield portal_class


@pytest.fixture(scope="class")
def contents(portal):
    with api.env.adopt_roles(["Manager"]):
        doc = api.content.create(portal, type="Document", id="doc1")
        doc.Subject = ["doc"]
        api.content.transition(obj=doc, transition="publish")
        transaction.commit()


class TestKeywordsPatch:
    @pytest.fixture(autouse=True)
    def _setup(self, contents, api_manager_request, api_anon_request):
        self.api_session = api_manager_request
        self.anon_api_session = api_anon_request

    def test_response(self):
        resp = self.api_session.get("/@keywords")
        assert resp.status_code == 200
        assert resp.json()["items"] == [{"name": "doc", "total": 1}]
        assert resp.json()["items_total"] == 1

    def test_response_non_root(self):
        resp = self.api_session.get("/doc1/@keywords")
        assert resp.status_code == 404

    def test_response_anonymous(self):
        resp = self.anon_api_session.get("/doc1/@keywords")
        assert resp.status_code == 404

    def test_response_with_idx(self):
        resp = self.api_session.get("/@keywords?idx=Bla")
        assert resp.status_code == 200
