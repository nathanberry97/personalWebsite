#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import * as dotenv from "dotenv";
import { v4 as uuid } from "uuid";
import { InfraStack } from "../lib/infra-stack";

dotenv.config();

const requiredEnvVars = ["ACCOUNT_NUM", "CERT_ID", "DOMAIN_NAME", "REGION"];
requiredEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) {
        throw new Error(`Missing required environment variable: ${envVar}`);
    }
});

const certArn: string = `arn:aws:acm:us-east-1:${process.env.ACCOUNT_NUM}:certificate/${process.env.CERT_ID}`;
const domainName: string = process.env.DOMAIN_NAME!;
const refererHeaderValue: string = uuid();

const app = new cdk.App();
new InfraStack(app, "InfraStack", {
    certArn,
    domainName,
    refererHeaderValue,
    env: { account: process.env.ACCOUNT_NUM, region: process.env.REGION },
});
