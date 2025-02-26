import * as cdk from "aws-cdk-lib";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import { Construct } from "constructs";
import { websiteS3 } from "./constructs/websiteS3";
import { websiteCloudFront } from "./constructs/websiteCloudFront";
import { websiteRoute53 } from "./constructs/websiteRoute53";

export interface infraProps extends cdk.StackProps {
    certArn: string;
    domainName: string;
}

export class InfraStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: infraProps) {
        super(scope, id, props);
        const websiteError: string = "error.html";
        const websiteIndex: string = "index.html";

        /**
         * Create and configure S3 buckets
         */
        const buckets = new websiteS3(this, "Bucket", {
            domainName: props.domainName,
        });

        /**
         * Create and configure CloudFront
         */
        const cloudFront = new websiteCloudFront(this, "CloudFront", {
            websiteError,
            websiteIndex,
            domainName: props.domainName,
            certArn: props.certArn,
            redirectWebsiteBucket: buckets.redirectWebsiteBucket,
            websiteBucket: buckets.websiteBucket,
        });

        /**
         * Create and configure Route53
         */
        new websiteRoute53(this, "Route53", {
            domainName: props.domainName,
            redirectWebsiteDistribution: cloudFront.redirectWebsiteDistribution,
            websiteDistribution: cloudFront.websiteDistribution,
        });

        /**
         * Upload website assets and clear CloudFront cache
         */
        new BucketDeployment(this, "UploadWebsite", {
            destinationBucket: buckets.websiteBucket,
            distribution: cloudFront.websiteDistribution,
            distributionPaths: ["/*"],
            sources: [Source.asset("../../build")],
        });
    }
}
