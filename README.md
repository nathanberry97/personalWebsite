# Personal website

![linting](https://github.com/nathanberry97/personalWebsite/actions/workflows/lintingPipeline.yml/badge.svg)
![deployment](https://github.com/nathanberry97/personalWebsite/actions/workflows/deploymentPipeline.yml/badge.svg)

> A blog website hosted through CloudFront and S3 in AWS and deployed through
> GitHub Actions using IaC (AWS CDK)

This website is currently live which you can view here:

-   [Personal Website](https://nathanberry.co.uk/)

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

## AWS CDK

The infrastructure is created using the AWS CDK. The following resources are
created:

-   S3 bucket for the website
-   CloudFront distribution
-   Route53 hosted zone

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
