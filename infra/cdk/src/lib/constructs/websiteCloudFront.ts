import {
    AccessLevel,
    CachePolicy,
    Distribution,
    DistributionProps,
    FunctionEventType,
    ViewerProtocolPolicy
} from "aws-cdk-lib/aws-cloudfront";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { Certificate } from "aws-cdk-lib/aws-certificatemanager";
import { Construct } from "constructs";
import { Function, FunctionCode } from "aws-cdk-lib/aws-cloudfront";
import { S3BucketOrigin } from "aws-cdk-lib/aws-cloudfront-origins";

interface websiteCloudFrontProps {
    websiteError: string;
    websiteIndex: string;
    certArn: string;
    domainName: string;
    websiteBucket: Bucket;
}

export class websiteCloudFront extends Construct {
    private __websiteDistribution: Distribution;
    private __redirectWebsiteDistribution: Distribution;

    constructor(scope: Construct, id: string, props: websiteCloudFrontProps) {
        super(scope, id);

        const cert = Certificate.fromCertificateArn(this, "Cert", props.certArn);

        this.__websiteDistribution = this.__createDistribution("CloudfrontDistribution", {
            defaultRootObject: props.websiteIndex,
            errorResponses: [
                {
                    httpStatus: 404,
                    responseHttpStatus: 404,
                    responsePagePath: `/${props.websiteError}`,
                },
            ],
            domainNames: [props.domainName],
            certificate: cert,
            defaultBehavior: {
                origin: S3BucketOrigin.withOriginAccessControl(props.websiteBucket, {
                    originAccessLevels: [AccessLevel.READ],
                }),
                cachePolicy: CachePolicy.CACHING_OPTIMIZED,
                viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
            },
        });

        this.__redirectWebsiteDistribution = this.__createDistribution("RedirectWebsiteDistribution", {
            domainNames: [`www.${props.domainName}`],
            certificate: cert,
            defaultBehavior: {
                origin: S3BucketOrigin.withOriginAccessControl(props.websiteBucket, {
                    originAccessLevels: [AccessLevel.READ],
                }),
                viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                functionAssociations: [{
                    eventType: FunctionEventType.VIEWER_REQUEST,
                    function: this.__redirectFn(props.domainName),
                }]
            },
        });
    }

    private __createDistribution(resourceName: string, distributionProps: DistributionProps): Distribution {
        return new Distribution(this, resourceName, distributionProps);
    }

    private __redirectFn(domainName: string): Function {
        return new Function(this, "RedirectFn", {
            code: FunctionCode.fromInline(`
                function handler(event) {
                    var response = {
                        statusCode: 301,
                        statusDescription: "Redirecting to non-www",
                        headers: { "location": { "value": "https://${domainName}" } }
                    };
                    return response;
                }
            `),
        })
    }

    public get websiteDistribution(): Distribution {
        return this.__websiteDistribution;
    }

    public get redirectWebsiteDistribution(): Distribution {
        return this.__redirectWebsiteDistribution;
    }
}
