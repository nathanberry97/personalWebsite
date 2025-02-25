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
<<<<<<< HEAD
            refererHeaderValue: "test",
            websiteError: "error.html",
            websiteIndex: "index.html",
=======
>>>>>>> ad96267 (add current progress)
        });

        const template = Template.fromStack(stack);

<<<<<<< HEAD
        template.resourceCountIs("AWS::S3::Bucket", 2);
        template.resourceCountIs("AWS::S3::BucketPolicy", 1);
=======
        template.resourceCountIs("AWS::S3::Bucket", 1);
>>>>>>> ad96267 (add current progress)
    });

    test("Test CloudFront creation", () => {
        const stack = new cdk.Stack();

        new websiteCloudFront(stack, "cloudFrontStack", {
            certArn: "arn:aws:acm:us-east-1:1234:certificatete:test",
            domainName: "test",
<<<<<<< HEAD
            redirectWebsiteBucket: new Bucket(stack, "testTwo"),
            refererHeaderValue: "test",
=======
>>>>>>> ad96267 (add current progress)
            websiteBucket: new Bucket(stack, "test"),
            websiteError: "error.html",
            websiteIndex: "index.html",
        });

        const template = Template.fromStack(stack);

<<<<<<< HEAD
        template.resourceCountIs("AWS::CloudFront::Distribution", 2);
=======
        template.resourceCountIs("AWS::CloudFront::Distribution", 1);
>>>>>>> ad96267 (add current progress)
    });
});
