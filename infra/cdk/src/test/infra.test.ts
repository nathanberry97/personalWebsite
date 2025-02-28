import * as cdk from "aws-cdk-lib";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { Match, Template } from "aws-cdk-lib/assertions";
import { websiteS3 } from "../lib/constructs/websiteS3";
import { websiteCloudFront } from "../lib/constructs/websiteCloudFront";

describe("Test constructs", () => {
    test("Test S3 bucket Creation", () => {
        const stack = new cdk.Stack();

        new websiteS3(stack, "bucketStack", {
            domainName: "test",
        });

        const template = Template.fromStack(stack);

        template.resourceCountIs("AWS::S3::Bucket", 2);

        template.hasResourceProperties("AWS::S3::Bucket", Match.objectLike({
            BucketName: "assets.test",
            OwnershipControls: {
                Rules: [{ ObjectOwnership: "BucketOwnerEnforced" }]
            },
            PublicAccessBlockConfiguration: {
                BlockPublicAcls: true,
                BlockPublicPolicy: true,
                IgnorePublicAcls: true,
                RestrictPublicBuckets: true
            },
        }));

        template.hasResourceProperties("AWS::S3::Bucket", Match.objectLike({
            BucketName: "www.test",
            OwnershipControls: {
                Rules: [{ ObjectOwnership: "BucketOwnerEnforced" }]
            },
            PublicAccessBlockConfiguration: {
                BlockPublicAcls: true,
                BlockPublicPolicy: true,
                IgnorePublicAcls: true,
                RestrictPublicBuckets: true
            },
            WebsiteConfiguration: { RedirectAllRequestsTo: { HostName: "test" } },
        }));
    });

    test("Test CloudFront creation", () => {
        const stack = new cdk.Stack();

        new websiteCloudFront(stack, "cloudFrontStack", {
            certArn: "arn:aws:acm:us-east-1:1234:certificatete:test",
            domainName: "test",
            websiteBucket: new Bucket(stack, "test"),
            redirectWebsiteBucket: new Bucket(stack, "redirectTest"),
            websiteError: "error.html",
            websiteIndex: "index.html",
        });

        const template = Template.fromStack(stack);

        template.resourceCountIs("AWS::CloudFront::Distribution", 2);

        template.hasResourceProperties("AWS::CloudFront::Distribution", Match.objectLike({
            DistributionConfig: {
                Aliases: ["test"],
                CustomErrorResponses: [
                    {
                        ErrorCode: 404,
                        ResponseCode: 404,
                        ResponsePagePath: "/error.html"
                    },
                    {
                        ErrorCode: 403,
                        ResponseCode: 404,
                        ResponsePagePath: "/error.html"
                    }
                ],
                DefaultCacheBehavior: {
                    Compress: true,
                    ViewerProtocolPolicy: "redirect-to-https"
                },
                DefaultRootObject: "index.html",
            }
        }));

        template.hasResourceProperties("AWS::CloudFront::Distribution", Match.objectLike({
            DistributionConfig: { Aliases: ["www.test"] }
        }));
    });
});
