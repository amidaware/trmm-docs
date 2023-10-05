# Contributing

## Contributing to the Docs

The source of the docs are <https://github.com/amidaware/trmm-docs>

Docs are built with [MKDocs for Material](https://squidfunk.github.io/mkdocs-material/)

Please refer to the docs [README](https://github.com/amidaware/trmm-docs) for instructions on how to build and serve the docs locally.

Open your browser and navigate to `http://yourserverip:8005`

Add/edit markdown files in the `docs/docs` folder and you'll see live changes at the url above.

Edit `docs/mkdocs.yml` to edit structure and add new files.

Full MKDocs documentation [here](https://squidfunk.github.io/mkdocs-material/getting-started/)

Once finished, [create a pull request](https://www.digitalocean.com/community/tutorials/how-to-create-a-pull-request-on-github) to the `main` branch for review.

## Contributing using GitHub Codespaces

[Devcontainers](https://devcontainers.org/) is an open specification for developing with a preconfigured container setup. With devcontainers, you don't need SSH keys, `git clone`, or deal with the usual "local setup" tasks. Everything is configured in the container and you connect to it remotely. GitHub Codespaces is GitHub's version of devcontainers. Authentication is provided via your GitHub account. Before you start a Codespace, there are a few settings you should to be aware of.

### Cost and spending limit

GitHub provides 120 core hours and 15 GB-month storage for free accounts. Please [read GitHub's notes](https://docs.github.com/en/billing/managing-billing-for-github-codespaces/about-billing-for-github-codespaces#monthly-included-storage-and-core-hours-for-personal-accounts) in detail to understand how much that provides. For clarity, here is the explanation of GB-month storage and core hour compute usage.

- The GB-month unit of storage is a time-based measurement, 1 GB-month being 1 GB of storage usage for one whole month. The disk space used by all of your codespaces and prebuilds is assessed once an hour and your current GB-month usage is recalculated. Therefore, while you have codespaces and prebuilds, your GB-month usage will increase throughout the month. For example, if the storage totals 15 GB, and remains unchanged throughout your monthly billing cycle, then you will have used 7.5 GB halfway through the month, and 15 GB at the end of the month. For more information, see "About billing for storage usage" later in this article.
- A "core hour" is a measure used for included compute usage. To calculate core hours, multiply the number of hours for which a codespace has been active by the multiplier in the pricing table later in this article. For the basic machine types, the multiplier is the number of processor cores in the machine that hosts the codespace. For example, if you use a 2-core machine for your codespace and it's active for an hour, you have used 2 core hours. If you use an 8-core machine for an hour, you have used 8 core hours. If you use an 8-core machine for two hours, you have used 16 core hours.

----
By default, the [spending limit](https://docs.github.com/en/billing/managing-billing-for-github-codespaces/managing-the-spending-limit-for-github-codespaces#managing-the-github-codespaces-spending-limit-for-your-personal-account) is $0. This means the devcontainer will stop after the free tier has been exhausted.
![Codespace spending limit](codespace-spending-limit.png)

### Creating the codespace

Codespaces are created by clicking the `code` button and then the Codespaces tab. **Codespaces are specific to a branch!** If needed, create a new branch for your changes. Clicking the `+` will create the Codespace. **Codespaces are paid for by you** using the spencing limit mentioned above. This screenshot is from my account where I already have a codespace on this branch, `scaling pancake`.

![Codespace creation](codespace-creation.png)

### Using the Codespace

It takes about 15 seconds for the Codespace to start in the browser. If you want to use Code on the desktop, click in the lower left corner and selection the option to "open in VS Code desktop".