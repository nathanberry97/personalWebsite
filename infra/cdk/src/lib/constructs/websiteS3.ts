import { Bucket, BlockPublicAccess, ObjectOwnership } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";
import { RemovalPolicy } from "aws-cdk-lib";

export interface websiteS3Props {
    domainName: string;
}

export class websiteS3 extends Construct {
    private __websiteBucket: Bucket;
    private __redirectWebsiteBucket: Bucket;

    constructor(scope: Construct, id: string, props: websiteS3Props) {
        super(scope, id);

        this.__websiteBucket = new Bucket(this, "WebsiteBucket", {
            blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
            bucketName: `assets.${props.domainName}`,
            objectOwnership: ObjectOwnership.BUCKET_OWNER_ENFORCED,
            removalPolicy: RemovalPolicy.DESTROY,
        });

        this.__redirectWebsiteBucket = new Bucket(this, "websiteRedirectBucket", {
            blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
            bucketName: `www.${props.domainName}`,
            objectOwnership: ObjectOwnership.BUCKET_OWNER_ENFORCED,
            removalPolicy: RemovalPolicy.DESTROY,
            websiteRedirect: { hostName: `${props.domainName}` },
        });
    }

    public get websiteBucket(): Bucket {
        return this.__websiteBucket;
    }

    public get redirectWebsiteBucket(): Bucket {
        return this.__redirectWebsiteBucket;
    }
}
