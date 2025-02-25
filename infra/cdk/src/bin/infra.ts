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
const refererHeaderValue: string = uuid();

const certStack = new CertStack(app, "CertStack", {
    crossRegionReferences: true,
    domainName,
    env: { account: process.env.ACCOUNT_NUM, region: "us-east-1" },
});

new InfraStack(app, "personalWebsiteInfraStack", {
    crossRegionReferences: true,
    certArn: certStack.certArn,
    domainName,
    refererHeaderValue,
    env: { account: process.env.ACCOUNT_NUM, region: process.env.REGION },
});
