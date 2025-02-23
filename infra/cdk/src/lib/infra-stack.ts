import * as cdk from "aws-cdk-lib";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import { Construct } from "constructs";
import { websiteS3 } from "./constructs/websiteS3";
import { websiteCloudFront } from "./constructs/websiteCloudFront";
import { websiteRoute53 } from "./constructs/websiteRoute53";

export interface infraProps extends cdk.StackProps {
    certArn: string,
    domainName: string,
}

export class InfraStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: infraProps) {
        super(scope, id, props);
        const websiteError: string = "error.html";
        const websiteIndex: string = "index.html";

        /**
         * Create and configure S3 buckets
         */
        const buckets = new websiteS3(this, "bucket", {
            domainName: props.domainName,
            websiteError,
            websiteIndex,
        });

        /**
         * Create and configure CloudFront
         */
        const cloudFront = new websiteCloudFront(this, "cloudFront", {
            websiteError,
            websiteIndex,
            domainName: props.domainName,
            certArn: props.certArn,
            websiteBucket: buckets.websiteBucket,
            redirectWebsiteBucket: buckets.redirectWebsiteBucket,
        });

        /**
         * Create and configure Route53
         */
        new websiteRoute53(this, "route53", {
            domainName: props.domainName,
            websiteDistribution: cloudFront.websiteDistribution,
            redirectWebsiteDistribution: cloudFront.redirectWebsiteDistribution,
        });

        /**
         * Upload website assets and clear CloudFront cache
         */
        new BucketDeployment(this, "uploadWebsite", {
            destinationBucket: buckets.websiteBucket,
            distribution: cloudFront.websiteDistribution,
            distributionPaths: ["/*"],
            sources: [Source.asset("../../build")],
        });
    }
}
