import { Bucket, BlockPublicAccess, ObjectOwnership } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";
import { RemovalPolicy } from "aws-cdk-lib";
import { PolicyStatement, Effect, AnyPrincipal } from "aws-cdk-lib/aws-iam";

export interface websiteS3Props {
    domainName: string;
}

export class websiteS3 extends Construct {
    private __websiteBucket: Bucket;

    constructor(scope: Construct, id: string, props: websiteS3Props) {
        super(scope, id);

        this.__websiteBucket = new Bucket(this, "WebsiteBucket", {
            blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
            bucketName: `assets.${props.domainName}`,
            objectOwnership: ObjectOwnership.BUCKET_OWNER_ENFORCED,
            removalPolicy: RemovalPolicy.DESTROY,
            websiteRedirect: { hostName: `${props.domainName}` },
        });
    }

    public get websiteBucket(): Bucket {
        return this.__websiteBucket;
    }
}
