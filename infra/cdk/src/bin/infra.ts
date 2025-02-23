#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import * as dotenv from "dotenv";
import { InfraStack } from "../lib/infra-stack";

dotenv.config();

const requiredEnvVars = ['ACCOUNT_NUM', 'CERT_ID', 'DOMAIN_NAME'];
requiredEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) {
        throw new Error(`Missing required environment variable: ${envVar}`);
    }
});

const certArn: string = `arn:aws:acm:us-east-1:${process.env.ACCOUNT_NUM}:certificate/${process.env.CERT_ID}`;
const domainName: string = process.env.DOMAIN_NAME!;

const app = new cdk.App();
new InfraStack(app, "InfraStack", {
    certArn,
    domainName,
    env: { account: process.env.ACCOUNT_NUM, region: process.env.REGION },
});
