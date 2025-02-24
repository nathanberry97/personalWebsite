import { Bucket } from "aws-cdk-lib/aws-s3";
import { Certificate } from "aws-cdk-lib/aws-certificatemanager";
import { Construct } from "constructs";
import { Distribution, ViewerProtocolPolicy, CachePolicy, DistributionProps } from "aws-cdk-lib/aws-cloudfront";
import { S3StaticWebsiteOrigin } from "aws-cdk-lib/aws-cloudfront-origins";

interface websiteCloudFrontProps {
    websiteError: string;
    websiteIndex: string;
    certArn: string;
    domainName: string;
    redirectWebsiteBucket: Bucket;
    refererHeaderValue: string;
    websiteBucket: Bucket;
}

export class websiteCloudFront extends Construct {
    private __websiteDistribution: Distribution;
    private __redirectWebsiteDistribution: Distribution;

    constructor(scope: Construct, id: string, props: websiteCloudFrontProps) {
        super(scope, id);

        const cert = Certificate.fromCertificateArn(this, "cert", props.certArn);

        this.__websiteDistribution = this.createDistribution("cloudfrontDistribution", {
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
                origin: new S3StaticWebsiteOrigin(props.websiteBucket, {
                    customHeaders: { Referer: props.refererHeaderValue }
                }),
                cachePolicy: CachePolicy.CACHING_OPTIMIZED,
                viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
            },
        });

        this.__redirectWebsiteDistribution = this.createDistribution("redirectWebsiteDistribution", {
            domainNames: [`www.${props.domainName}`],
            certificate: cert,
            defaultBehavior: {
                origin: new S3StaticWebsiteOrigin(props.redirectWebsiteBucket),
                cachePolicy: CachePolicy.CACHING_OPTIMIZED,
                viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
            },
        });
    }

    private createDistribution(resourceName: string, distributionProps: DistributionProps): Distribution {
        return new Distribution(this, resourceName, distributionProps);
    }

    public get websiteDistribution(): Distribution {
        return this.__websiteDistribution;
    }

    public get redirectWebsiteDistribution(): Distribution {
        return this.__redirectWebsiteDistribution;
    }
}
