import * as cdk from "aws-cdk-lib";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { Template } from "aws-cdk-lib/assertions";
import { websiteS3 } from "../lib/constructs/websiteS3";
import { websiteCloudFront } from "../lib/constructs/websiteCloudFront";
import { websiteEcsService } from "../lib/constructs/websiteEcsService";

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
        template.resourceCountIs(
            "AWS::CloudFront::CloudFrontOriginAccessIdentity",
            2,
        );
    });

    test("Test ECS creation", () => {
        const stack = new cdk.Stack(undefined, "test", {
            env: {
                account: "1234",
                region: "us-east-1",
            },
        });

        new websiteEcsService(stack, "ecsStack", {
            ecsClusterName: "test",
            ecrRepoName: "test",
            s3BucketHtmlArn: "arn:aws:s3:::test",
            s3BucketHtmlArnObjects: "arn:aws:s3:::test/*",
            vpcId: "test",
        });

        const template = Template.fromStack(stack);

        template.resourceCountIs("AWS::ECS::Cluster", 1);
        template.resourceCountIs("AWS::ECS::TaskDefinition", 1);
        template.resourceCountIs("AWS::Events::Rule", 2);
        template.resourceCountIs("AWS::IAM::Role", 3);
    });
});
