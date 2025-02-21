import * as cdk from "aws-cdk-lib";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { Template } from "aws-cdk-lib/assertions";
import { websiteS3 } from "../lib/constructs/websiteS3";
import { websiteCloudFront } from "../lib/constructs/websiteCloudFront";

describe("Test constructs", () => {
    test("Test S3 bucket Creation", () => {
        const stack = new cdk.Stack();

        new websiteS3(stack, "bucketStack", {
            domainName: "test",
            websiteIndex: "index.html",
        });

        const template = Template.fromStack(stack);

        template.resourceCountIs("AWS::S3::Bucket", 2);
        template.resourceCountIs("AWS::S3::BucketPolicy", 1);
    });

    test("Test CloudFront creation", () => {
        const stack = new cdk.Stack();

        new websiteCloudFront(stack, "cloudFrontStack", {
            domainName: "test",
            certArn: "arn:aws:acm:us-east-1:1234:certificatete:test",
            websiteBucket: new Bucket(stack, "test"),
            redirectWebsiteBucket: new Bucket(stack, "testTwo"),
        });

        const template = Template.fromStack(stack);

        template.resourceCountIs("AWS::CloudFront::Distribution", 2);
        template.resourceCountIs("AWS::CloudFront::CloudFrontOriginAccessIdentity", 2);
    });
});
