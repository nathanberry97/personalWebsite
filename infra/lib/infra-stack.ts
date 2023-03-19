import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { staticWebsite } from './constructs/staticWebsite';

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const domain: string = 'nathanberry.co.uk';
    const index: string = 'index.html';
    const cert: string = `arn:aws:acm:us-east-1:${process.env.ACCOUNT_NUM}:certificate/8a47403a-cab2-4ff3-b8fa-f1527735ad1f`;

    /*
     * Create and deploy static website
     */
    new staticWebsite(this, 'bucket',{
      domainName: domain,
      websiteIndex: index,
      certArn: cert
    });
  }
}
