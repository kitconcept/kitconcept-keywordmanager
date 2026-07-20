# Contributing

Contributions are welcome!

## Quick Start 🏁

### Prerequisites ✅

- An [operating system](https://6.docs.plone.org/install/create-project-cookieplone.html#prerequisites-for-installation) that runs all the requirements mentioned.
- [uv](https://6.docs.plone.org/install/create-project-cookieplone.html#uv)
- [nvm](https://6.docs.plone.org/install/create-project-cookieplone.html#nvm)
- [Node.js and pnpm](https://6.docs.plone.org/install/create-project.html#node-js) 24
- [Make](https://6.docs.plone.org/install/create-project-cookieplone.html#make)
- [Git](https://6.docs.plone.org/install/create-project-cookieplone.html#git)
- [Docker](https://docs.docker.com/get-started/get-docker/) (optional)

### Installation 🔧

1.  Clone this repository, then change your working directory.

    ```shell
    git clone git@github.com:kitconcept/kitconcept-keywordmanager.git
    cd kitconcept-keywordmanager
    ```

2.  Install this code base.

    ```shell
    make install
    ```

### Fire Up the Servers 🔥

1.  Create a new Plone site on your first run.

    ```shell
    make backend-create-site
    ```

2.  Start the backend at http://localhost:8080/.

    ```shell
    make backend-start
    ```

3.  In a new shell session, start the frontend at http://localhost:3000/.

    ```shell
    make frontend-start
    ```

Voila! Your Plone site should be live and kicking! 🎉

### Local Stack Deployment 📦

Deploy a local Docker Compose environment that includes the following.

- Docker images for Backend and Frontend 🖼️
- A stack with a Traefik router and a PostgreSQL database 🗃️
- Accessible at [http://kitconcept-keywordmanager.localhost](http://kitconcept-keywordmanager.localhost) 🌐

Run the following commands in a shell session.

```shell
make stack-create-site
make stack-start
```

And... you're all set! Your Plone site is up and running locally! 🚀

## Project structure 🏗️

This monorepo consists of the following distinct sections:

- **backend**: Houses the API and Plone installation, utilizing pip instead of buildout, and includes a policy package named kitconcept.keywordmanager.
- **frontend**: Contains the React (Volto) package.
- **devops**: Encompasses Docker stack, Ansible playbooks, and cache settings.
- **docs**: Scaffold for writing documentation for your project.

### Why this structure? 🤔

- All necessary codebases to run the site are contained within the repository (excluding existing add-ons for Plone and React).
- Specific GitHub Workflows are triggered based on changes in each codebase (refer to .github/workflows).
- Simplifies the creation of Docker images for each codebase.
- Demonstrates Plone installation/setup without buildout.

## Code quality assurance 🧐

To check your code against quality standards, run the following shell command.

```shell
make check
```

### Format the codebase

To format and rewrite the code base, ensuring it adheres to quality standards, run the following shell command.

```shell
make format
```

| Section  | Tool      | Description                             | Configuration                                        |
| -------- | --------- | --------------------------------------- | ---------------------------------------------------- |
| backend  | Ruff      | Python code formatting, imports sorting | [`backend/pyproject.toml`](./backend/pyproject.toml) |
| backend  | `zpretty` | XML and ZCML formatting                 | --                                                   |
| frontend | ESLint    | Fixes most common frontend issues       | [`frontend/.eslintrc.js`](.frontend/.eslintrc.js)    |
| frontend | prettier  | Format JS and Typescript code           | [`frontend/.prettierrc`](.frontend/.prettierrc)      |
| frontend | Stylelint | Format Styles (css, less, sass)         | [`frontend/.stylelintrc`](.frontend/.stylelintrc)    |

Formatters can also be run within the `backend` or `frontend` folders.

### Linting the codebase

or `lint`:

```shell
make lint
```

| Section  | Tool                  | Description                               | Configuration                                        |
| -------- | --------------------- | ----------------------------------------- | ---------------------------------------------------- |
| backend  | Ruff                  | Checks code formatting, imports sorting   | [`backend/pyproject.toml`](./backend/pyproject.toml) |
| backend  | Pyroma                | Checks Python package metadata            | --                                                   |
| backend  | check-python-versions | Checks Python version information         | --                                                   |
| backend  | `zpretty`             | Checks XML and ZCML formatting            | --                                                   |
| frontend | ESLint                | Checks JS / Typescript lint               | [`frontend/.eslintrc.js`](.frontend/.eslintrc.js)    |
| frontend | prettier              | Check JS / Typescript formatting          | [`frontend/.prettierrc`](.frontend/.prettierrc)      |
| frontend | Stylelint             | Check Styles (css, less, sass) formatting | [`frontend/.stylelintrc`](.frontend/.stylelintrc)    |

Linters can be run individually within the `backend` or `frontend` folders.

## Internationalization 🌐

Generate translation files for Plone and Volto with ease:

```shell
make i18n
```

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
