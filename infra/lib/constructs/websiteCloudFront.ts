import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import { Distribution, OriginAccessIdentity, ViewerProtocolPolicy, CachePolicy } from 'aws-cdk-lib/aws-cloudfront';
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { Construct } from 'constructs';

export interface websiteValues{
    domainName: string;
    certArn: string;
    websiteBucket: Bucket;
    redirectWebsiteBucket: Bucket;
}

export class websiteCloudFront extends Construct {
    private __websiteDistribution: Distribution;
    private __redirectWebsiteDistribution: Distribution;

    constructor(scope: Construct, id: string, props: websiteValues) {
        super(scope, id);

        const cloudfrontPolicy = new OriginAccessIdentity(this, 'accessIdentity')
        props.websiteBucket.grantRead(cloudfrontPolicy)

        const cert = Certificate.fromCertificateArn(this, 'cert', props.certArn);

        const websiteDistribution = new Distribution(this, 'cloudfrontDistribution', {
            defaultRootObject: 'index.html',
            errorResponses: [{
                httpStatus: 404,
                responseHttpStatus: 200,
                responsePagePath: '/error.html',
            }],
            domainNames: [props.domainName],
            certificate: cert,
            defaultBehavior: {
                origin: new S3Origin(props.websiteBucket, {
                    originAccessIdentity: cloudfrontPolicy
                }),
                cachePolicy: CachePolicy.CACHING_DISABLED,
                viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS
            }
        });
        this.__websiteDistribution = websiteDistribution;

        const redirectWebsiteDistribution = new Distribution(this, 'redirectCloudfrontDistribution', {
            domainNames: [`www.${props.domainName}`],
            certificate: cert,
            defaultBehavior: {
                origin: new S3Origin(props.redirectWebsiteBucket),
                cachePolicy: CachePolicy.CACHING_DISABLED,
                viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS
            }
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
