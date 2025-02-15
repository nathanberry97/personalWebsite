# Personal website

![linting](https://github.com/nathanberry97/personalWebsite/actions/workflows/lintingPipeline.yml/badge.svg)
![deployment](https://github.com/nathanberry97/personalWebsite/actions/workflows/deploymentPipeline.yml/badge.svg)

> A blog website hosted through CloudFront and S3 in AWS and deployed through
> GitHub Actions using IaC (AWS CDK)

This website is currently live which you can view here:

-   [Personal Website](https://nathanberry.co.uk/)

## Commands when running locally

List of commands while using `make`:

```
personalWebsite

Usage:
  setup                 Install pre-commit hooks and npm packages
  compile               Compile blog posts into html
  local                 Run a local webserver to host website locally
  build                 Build infra for AWS
  test                  Test infra for AWS
  clean                 Clean up build artifacts
  cleanContainer        Clean up container build artifacts
  checkov               Run checkov to check for security issues
```

> When using `make local` you will need to have `podman` installed

## GitHub actions

The repo has been configured to automatically deploy any changes to the source
code or infrastructure on any changes to the main branch. Also the repo has
a linting pipeline which will run on any pull requests to the main branch.

> The pipelines can be found in the `.github/workflows` directory.

## Website

The website is a simple blog page with a few posts and a contact page. The
blog posts are written in markdown and are converted to HTML using a using
[pandoc](https://pandoc.org/) during the build process.

The webpage is created with the following:

-   HTML
-   CSS
-   JS

> Some of the HTML is complied during the build using `golang` and `templates`
> to help automate the process of creating new blog content.
> If you are interested in how this is done along side the blog posts conversion
> you can find the code in `/scripts`.

## AWS CDK

The infrastructure is created using the `AWS CDK`. The following resources are
created:

-   `S3` bucket for the website
-   `CloudFront` distribution
-   `Route53` hosted zone

The deployment of the infrastructure is done through GitHub Actions. But you
can install the dependencies and build the infrastructure using the following
commands:

```bash
make setup
make build
```

> **Note** you need to set the following environment variables:
>
> -   `export ACCOUNT_NUM=xxxxxxxxxxxx`
> -   `export REGION=eu-west-2`
