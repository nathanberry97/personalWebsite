# Personal website

![linting](https://github.com/nathanberry97/personalWebsite/actions/workflows/lintingPipeline.yml/badge.svg)
![deployment](https://github.com/nathanberry97/personalWebsite/actions/workflows/deploymentPipeline.yml/badge.svg)

> A blog website built with Go, hosted on AWS using S3 and CloudFront, and
> deployed via GitHub Actions with IaC (AWS CDK).

This website is currently live which you can view here:

- [Personal Website](https://nathanberry.co.uk/)

## Prerequisites

> Ensure you have the following installed before running the project locally:

- [Go](https://go.dev/)
- [Docker](https://www.docker.com/)
- [Pandoc](https://pandoc.org/)
- [SCSS](https://sass-lang.com/)

## Commands when running locally

List of commands while using `make`:

```
personalWebsite

Usage:
  pre-commit            Install pre-commit hooks
  test                  Unit test go code
  setup                 Setup build dir and copy over assets
  compile               Compile blog posts into HTML
  local                 Run a local web server to host website locally
  clean                 Clean up build artifacts
  installCDK            Install AWS CDK dependencies
  buildCDK              Build AWS infrastructure
  testCDK               Test AWS infrastructure
  diffCDK               Differences of deployed and the local infrastructure
  deployCDK             Deploy AWS infrastructure
  cleanCDK              Clean AWS infrastructure
  checkovCDK            Run Checkov for security analysis of IaC
```

## Website

The website is a simple blog created with `go`. The blog posts are written
in markdown and are converted to HTML using `pandoc` during the build process.

The website is created with the following:

- `go` (`html/template`)
- `SCSS`
- `pandoc`
- `JavaScript`

Here are the commands you can run locally to compile and host the website
through `docker` and so on:

```bash
make test
make setup
make compile
make local
make clean
```

> You can just run `make local` and it will run the required steps before hand
> just insure you have the prerequisites installed

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
make installCDK
make buildCDK
make testCDK
make diffCDK
make deployCDK
make cleanCDK
make checkovCDK
```

> **Note** you need to set the following environment variables:
>
> - `export DOMAIN_NAME=xxxxxxxxxxxx`
> - `export ACCOUNT_NUM=xxxxxxxxxxxx`
> - `export REGION=eu-west-2`

## GitHub actions

The repo has been configured to automatically deploy any changes to the source
code or infrastructure on any changes to the main branch. Also the repo has
a linting pipeline which will run on any pull requests to the main branch.

> The pipelines can be found in the `.github/workflows` directory.
