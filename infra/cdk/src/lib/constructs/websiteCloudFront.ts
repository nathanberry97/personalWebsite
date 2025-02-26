import {
    AccessLevel,
    CachePolicy,
    Distribution,
    ViewerProtocolPolicy
} from "aws-cdk-lib/aws-cloudfront";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { Certificate } from "aws-cdk-lib/aws-certificatemanager";
import { Construct } from "constructs";
import { S3BucketOrigin, S3StaticWebsiteOrigin } from "aws-cdk-lib/aws-cloudfront-origins";

interface websiteCloudFrontProps {
    certArn: string;
    domainName: string;
    redirectWebsiteBucket: Bucket;
    websiteBucket: Bucket;
    websiteError: string;
    websiteIndex: string;
}

export class websiteCloudFront extends Construct {
    private __websiteDistribution: Distribution;
    private __redirectWebsiteDistribution: Distribution;

    constructor(scope: Construct, id: string, props: websiteCloudFrontProps) {
        super(scope, id);

        const cert = Certificate.fromCertificateArn(this, "Cert", props.certArn);

        this.__websiteDistribution = new Distribution(this, "CloudfrontDistribution", {
            defaultRootObject: props.websiteIndex,
            errorResponses: [
                {
                    httpStatus: 404,
                    responseHttpStatus: 404,
                    responsePagePath: `/${props.websiteError}`,
                },
                {
                    httpStatus: 403,
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

        this.__redirectWebsiteDistribution = new Distribution(this, "RedirectWebsiteDistribution", {
            domainNames: [`www.${props.domainName}`],
            certificate: cert,
            defaultBehavior: {
                origin: new S3StaticWebsiteOrigin(props.redirectWebsiteBucket),
                viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
            },
        });
    }

    public get websiteDistribution(): Distribution {
        return this.__websiteDistribution;
    }

    public get redirectWebsiteDistribution(): Distribution {
        return this.__redirectWebsiteDistribution;
    }
}
