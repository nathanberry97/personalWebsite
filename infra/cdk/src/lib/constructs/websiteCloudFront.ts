import { Bucket } from "aws-cdk-lib/aws-s3";
import { Certificate } from "aws-cdk-lib/aws-certificatemanager";
import { Construct } from "constructs";
import { Distribution, OriginAccessIdentity, ViewerProtocolPolicy, CachePolicy } from "aws-cdk-lib/aws-cloudfront";
import { PolicyStatement, Effect, AnyPrincipal } from "aws-cdk-lib/aws-iam";
import { S3StaticWebsiteOrigin } from "aws-cdk-lib/aws-cloudfront-origins";

export interface websiteValues {
    websiteError: string;
    websiteIndex: string;
    certArn: string;
    domainName: string;
    redirectWebsiteBucket: Bucket;
    websiteBucket: Bucket;
}

export class websiteCloudFront extends Construct {
    private __websiteDistribution: Distribution;
    private __redirectWebsiteDistribution: Distribution;

    constructor(scope: Construct, id: string, props: websiteValues) {
        super(scope, id);

        const cert = Certificate.fromCertificateArn(this, "cert", props.certArn);
        const cloudfrontPolicy = new OriginAccessIdentity(this, "accessIdentity");

        // Configure bucket to allow access to content
        props.websiteBucket.grantRead(cloudfrontPolicy);
        props.websiteBucket.addToResourcePolicy(
            new PolicyStatement({
                effect: Effect.ALLOW,
                principals: [new AnyPrincipal()],
                actions: ["s3:GetObject"],
                resources: [props.websiteBucket.arnForObjects("*")],
            }),
        );

        const websiteDistribution = new Distribution(this, "cloudfrontDistribution", {
            defaultRootObject: props.websiteIndex,
            errorResponses: [
                {
                    httpStatus: 404,
                    responseHttpStatus: 200,
                    responsePagePath: `/${props.websiteError}`,
                },
            ],
            domainNames: [props.domainName],
            certificate: cert,
            defaultBehavior: {
                origin: new S3StaticWebsiteOrigin(props.websiteBucket),
                cachePolicy: CachePolicy.CACHING_DISABLED,
                viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
            },
        });
        this.__websiteDistribution = websiteDistribution;

        const redirectWebsiteDistribution = new Distribution(this, "redirectCloudfrontDistribution", {
            domainNames: [`www.${props.domainName}`],
            certificate: cert,
            defaultBehavior: {
                origin: new S3StaticWebsiteOrigin(props.redirectWebsiteBucket),
                cachePolicy: CachePolicy.CACHING_DISABLED,
                viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
            },
        });
        this.__redirectWebsiteDistribution = redirectWebsiteDistribution;

    }

    public get websiteDistribution(): Distribution {
        return this.__websiteDistribution;
    }

    public get redirectWebsiteDistribution(): Distribution {
        return this.__redirectWebsiteDistribution;
    }
}
