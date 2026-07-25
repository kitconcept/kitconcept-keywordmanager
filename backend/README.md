# Keyword Manager for Plone (Backend: kitconcept.keywordmanager)

The backend package for Keyword Manager for Plone — a Plone 6 add-on that lets content editors rename, merge, and delete keywords (subjects/tags) across a site, with all content updated automatically. See also the frontend package [@kitconcept/volto-keywordmanager](https://www.npmjs.com/package/@kitconcept/volto-keywordmanager).

![Keyword Manager](https://raw.githubusercontent.com/kitconcept/kitconcept-keywordmanager/main/assets/Keyword_Manager.png)

## Features 🔥

- **Browse all keywords** currently in use, sorted by name or by number of occurrences.
- **Filter keywords** to quickly find a specific term in a long list.
- **Rename a keyword** — the new name is applied to every content item that uses it automatically.
- **Merge keywords** — combine synonyms, fix typos, or resolve ambiguities by merging multiple keywords into one canonical term; all affected content is updated in one step.
- **Delete keywords** — remove terms that are no longer needed.
- **Manage multiple keyword fields** — works with the standard `Subject` field and any other keyword-type index in the catalog.

## Requirements

- Plone 6.1 or 6.2
- Python 3.11, 3.12, or 3.13

## Installation 🔧

Install kitconcept.keywordmanager with uv.

```shell
uv add kitconcept.keywordmanager
```

Create the Plone site.

```shell
make create-site
```

## Configuration

This package allows for some configuration.

To configure one of the following options, import the config module like so:

```py
from kitconcept.keywordmanager import config
```

### Options

The keywords permission allows you to set a custom permission who should be able to manage keywords.

```py
config.MANAGE_KEYWORDS_PERMISSION = "kitconcept.keywordmanager: Manage Keywords"
```

The meta type of the keyword indexes can be set. This is only useful if you're one of those crazy people that use custom indexes.

```py
config.META_TYPE = "KeywordIndex"
```

There are indexes of `META_TYPE` we know we don't want to manage because bad things will happen. You can exclude those using:

```py
config.IGNORE_INDEXES = [
    "object_provides",
    "allowedRolesAndUsers",
    "getRawRelatedItems",
    "getEventType",
    "block_types",
]
```

You can set a list of indexes that should always be reindex when merging or deleting keywords on objects. Most people won't need this.

```py
config.ALWAYS_REINDEX = (
    "SearchableText",
)
```

## REST API

### GET `/@keywords` (or `/path/to/page/@keywords`)

| Parameter    | Source | Type / Values               | Required | Default   | Description                 |
| ------------ | ------ | --------------------------- | -------- | --------- | --------------------------- |
| `idx`        | form   | string                      | no       | "Subject" | The keyword index to query. |
| `sort_order` | form   | "ascending" or "descending" | no       | —         | The sort order of results.  |
| `sort_on`    | form   | "keyword" or "occurrence"   | no       | —         | The field to sort on.       |

### PATCH `/@keywords` (or `/path/to/page/@keywords`)

| Parameter      | Source | Type / Values | Required | Default   | Description                            |
| -------------- | ------ | ------------- | -------- | --------- | -------------------------------------- |
| `idx`          | form   | string        | no       | "Subject" | The keyword index to query.            |
| `new_keyword`  | body   | string        | yes      | —         | The name of the keyword to be created. |
| `old_keywords` | body   | list[string]  | yes      | —         | The old keywords to be deleted.        |

### DELETE `/@keywords` (or `/path/to/page/@keywords`)

| Parameter | Source | Type / Values | Required | Default   | Description                             |
| --------- | ------ | ------------- | -------- | --------- | --------------------------------------- |
| `idx`     | form   | string        | no       | "Subject" | The keyword index to query.             |
| `items`   | body   | list          | yes      | —         | The name of the keywords to be deleted. |

### GET `/@keywordIndex`

No parameters.

## Utility

Getting the utility.

```py
from kitconcept.keywordmanager.interfaces import IKeywordManager
from zope.component import getUtility

km = getUtility(IKeywordManager)
```

## Contributing 🐛

- [Issue tracker](https://github.com/kitconcept/kitconcept-keywordmanager/issues)
- [Source code](https://github.com/kitconcept/kitconcept-keywordmanager/)

### Prerequisites ✅

-   An [operating system](https://6.docs.plone.org/install/create-project-cookieplone.html#prerequisites-for-installation) that runs all the requirements mentioned.
-   [uv](https://6.docs.plone.org/install/create-project-cookieplone.html#uv)
-   [Make](https://6.docs.plone.org/install/create-project-cookieplone.html#make)
-   [Git](https://6.docs.plone.org/install/create-project-cookieplone.html#git)
-   [Docker](https://docs.docker.com/get-started/get-docker/) (optional)

### Installation 🔧

1.  Clone this repository.

    ```shell
    git clone git@github.com:kitconcept/kitconcept-keywordmanager.git
    cd kitconcept-keywordmanager/backend
    ```

2.  Install this code base.

    ```shell
    make install
    ```


### Add features using `plonecli` or `bobtemplates.plone`

This package provides markers as strings (`<!-- extra stuff goes here -->`) that are compatible with [`plonecli`](https://github.com/plone/plonecli) and [`bobtemplates.plone`](https://github.com/plone/bobtemplates.plone).
These markers act as hooks to add all kinds of features through subtemplates, including behaviors, control panels, upgrade steps, or other subtemplates from `bobtemplates.plone`.
`plonecli` is a command line client for `bobtemplates.plone`, adding autocompletion and other features.

To add a feature as a subtemplate to your package, use the following command pattern.

```shell
make add <template_name>
```

For example, you can add a content type to your package with the following command.

```shell
make add content_type
```

You can add a behavior with the following command.

```shell
make add behavior
```

```{seealso}
You can check the list of available subtemplates in the [`bobtemplates.plone` `README.md` file](https://github.com/plone/bobtemplates.plone/?tab=readme-ov-file#provided-subtemplates).
See also the documentation of [Mockup and Patternslib](https://6.docs.plone.org/classic-ui/mockup.html) for how to build the UI toolkit for Classic UI.
```

## License

The project is licensed under GPLv2.

## Credits and acknowledgements 🙏

Generated using [Cookieplone (2.0.0a3)](https://github.com/plone/cookieplone) and [cookieplone-templates (cda10db)](https://github.com/plone/cookieplone-templates/commit/cda10db886223a9aa9be1b1368484296418bb880) on 2026-05-29 11:44:37.855709. A special thanks to all contributors and supporters!
