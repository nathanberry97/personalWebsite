import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { websiteS3 } from './constructs/websiteS3';
import { websiteCloudFront } from './constructs/websiteCloudFront';
import { websiteRoute53 } from './constructs/websiteRoute53';
import { websiteEcsService } from './constructs/websiteEcsService';

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /*
     * Define variables
     */
    const domain: string = 'nathanberry.co.uk';
    const index: string = 'index.html';
    const cert: string = `arn:aws:acm:us-east-1:${process.env.ACCOUNT_NUM}:certificate/8a47403a-cab2-4ff3-b8fa-f1527735ad1f`;

    /*
     * Create and configure S3 buckets
     */
    const buckets = new websiteS3(this, 'bucket', {
      domainName: domain,
      websiteIndex: index,
    });

    /*
     * Create and configure CloudFront
     */
    const cloudFront = new websiteCloudFront(this, 'cloudFront', {
      domainName: domain,
      certArn: cert,
      websiteBucket: buckets.websiteBucket,
      redirectWebsiteBucket: buckets.redirectWebsiteBucket
    });

    /*
     * Create and configure Route53
     */
    new websiteRoute53(this, 'route53', {
      domainName: domain,
      websiteDistribution: cloudFront.websiteDistribution,
      redirectWebsiteDistribution: cloudFront.redirectWebsiteDistribution
    });

    /*
     * Create and confiure ECS task
     */
    new websiteEcsService(this, 'ecsService', {
        ecsClusterName: 'nasa_apod_html',
        ecrRepoName: 'nasa_apod_html',
        s3BucketHtmlArn: buckets.websiteBucket.bucketArn,
        s3BucketHtmlArnObjects: buckets.websiteBucket.arnForObjects('*'),
        vpcId: process.env.VPC_ID!
    });
  }
}
