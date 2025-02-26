#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import * as dotenv from "dotenv";
import { InfraStack } from "../lib/infra-stack";
import { CertStack } from "../lib/cert-stack";

dotenv.config();

const requiredEnvVars = ["ACCOUNT_NUM", "DOMAIN_NAME", "REGION"];
requiredEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) {
        throw new Error(`Missing required environment variable: ${envVar}`);
    }
});

const app = new cdk.App();
const domainName: string = process.env.DOMAIN_NAME!;

const certStack = new CertStack(app, "PersonalWebsiteCertStack", {
    crossRegionReferences: true,
    domainName,
    env: { account: process.env.ACCOUNT_NUM, region: "us-east-1" },
});

new InfraStack(app, "PersonalWebsiteInfraStack", {
    crossRegionReferences: true,
    certArn: certStack.certArn,
    domainName,
    env: { account: process.env.ACCOUNT_NUM, region: process.env.REGION },
});
