# kitconcept-keywordmanager 🚀

[![Built with Cookieplone](https://img.shields.io/badge/built%20with-Cookieplone-0083be.svg?logo=cookiecutter)](https://github.com/plone/cookieplone-templates/)
[![Ruff](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/astral-sh/ruff/main/assets/badge/v2.json)](https://github.com/astral-sh/ruff)
[![CI](https://github.com/kitconcept/kitconcept-keywordmanager/actions/workflows/main.yml/badge.svg)](https://github.com/kitconcept/kitconcept-keywordmanager/actions/workflows/main.yml)

Change, merge and delete keywords (subjects) in Plone 6.

> [!WARNING]
> This add-on is meant to be used in combination with the [volto-light-theme](https://github.com/kitconcept/volto-light-theme). If you plan to use this add-on with plain Volto you will have to write your own styles for it. You can use the existing ones via manual import like this `import "@kitconcept/volto-keywordmanager/theme/_main.scss"` or as reference.

## Features 🔥

<details>
<summary>Control Panel (frontend)</summary>

Coming soon...

</details>

<details>
<summary>Configurable (backend)</summary>

Coming soon...

</details>

<details>
<summary>REST-API Services (backend)</summary>

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

</details>

<details>
<summary>Utility (backend)</summary>

### The Utility

Getting the utility.

```py
from kitconcept.keywordmanager.interfaces import IKeywordManager
from zope.component import getUtility

km = getUtility(IKeywordManager)
```

### API

Coming soon...

</details>

## Installation 🔧

1. Frontend package:

    ```shell
    pnpm add @kitconcept/volto-keywordmanager
    ```

1. Backend package:

    ```shell
    uv add kitconcept.keywordmanager
    ```

    or

    ```shell
    pip install kitconcept.keywordmanager
    ```

## Screenshots 🖼️

Coming soon...

## Contributing 🐛

Contributions are welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md).

## Credits and acknowledgements 🙏

This add-on is based on code from Products.PloneKeywordManager, adapted and extended for Plone 6 & Volto.

### Origins of PloneKeywordManager

PloneKeywordManager was originally written by Maik Jablonski at the Plone Paderborn Sprint in September 2003, an event funded by the Bertelsmann Foundation. Alexander Limi of Plone Solutions contributed the initial user interface updates and setup code, and Joe Geldart of Netalley Networks later brought the templates up to the Plone 2.0 format. Maik Jablonski subsequently donated the code to the Collective, allowing the community to maintain and extend it going forward.

Since then, the package has been maintained and updated through successive Plone releases by numerous contributors within the Plone Collective. The full list of contributors is available on [GitHub](https://github.com/collective/Products.PloneKeywordManager/graphs/contributors/).

### This add-on

Building on that foundation, this package was created by the kitconcept GmbH to bring keyword management Volto.

### Long-term goal: bringing keyword management into Plone core

There is an ongoing effort to bring keyword-management functionality into Plone core itself, tracked as PLIP: Keyword Manager. This add-on is intended as a step toward that goal — a working, up-to-date implementation that can inform (and hopefully eventually be folded into) that core integration. Getting there will require several steps: stabilizing the add-on for Plone 6, gathering community feedback, aligning with the Volto/core UI patterns, and going through the PLIP review process. Contributions and feedback toward that end are welcome.

Thanks to Maik Jablonski and everyone who has contributed to Products.PloneKeywordManager over the years for the original work this builds on.
