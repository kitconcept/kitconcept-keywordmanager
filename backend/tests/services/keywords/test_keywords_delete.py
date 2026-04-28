from plone import api

import json
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


class TestKeywordsDelete:
    @pytest.fixture(autouse=True)
    def _setup(self, contents, api_manager_request, api_anon_request):
        self.api_session = api_manager_request
        self.anon_api_session = api_anon_request

    def test_response(self):
        resp = self.api_session.delete(
            "/@keywords",
            data=json.dumps({"items": ["doc"]}),
            headers={"Accept": "application/json"},
        )
        assert resp.status_code == 204

    def test_response_non_root(self):
        resp = self.api_session.delete("/doc1/@keywords")
        assert resp.status_code == 404

    def test_response_anonymous(self):
        resp = self.anon_api_session.delete("/doc1/@keywords")
        assert resp.status_code == 404

    def test_response_no_items(self):
        resp = self.api_session.delete(
            "/@keywords", headers={"Accept": "application/json"}
        )
        assert resp.status_code == 400

    def test_response_empty_items(self):
        resp = self.api_session.delete(
            "/@keywords",
            data=json.dumps({"items": []}),
            headers={"Accept": "application/json"},
        )
        assert resp.status_code == 400

    def test_response_wrong_items_type(self):
        resp = self.api_session.delete(
            "/@keywords",
            data=json.dumps({"items": "doc"}),
            headers={"Accept": "application/json"},
        )
        assert resp.status_code == 400

    def test_response_unknown_keyword(self):
        resp = self.api_session.delete(
            "/@keywords",
            data=json.dumps({"items": ["foo"]}),
            headers={"Accept": "application/json"},
        )
        assert resp.status_code == 204
