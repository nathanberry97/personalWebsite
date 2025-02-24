import { Bucket, BucketAccessControl, BlockPublicAccess, ObjectOwnership } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";
import { RemovalPolicy } from "aws-cdk-lib";
import { PolicyStatement, Effect, AnyPrincipal } from "aws-cdk-lib/aws-iam";

export interface websiteS3Props {
    domainName: string;
    websiteError: string;
    websiteIndex: string;
    refererHeaderValue: string;
}

export class websiteS3 extends Construct {
    private __websiteBucket: Bucket;
    private __redirectWebsiteBucket: Bucket;

    constructor(scope: Construct, id: string, props: websiteS3Props) {
        super(scope, id);

        const websiteBucket = new Bucket(this, "websiteBucket", {
            accessControl: BucketAccessControl.PUBLIC_READ,
            blockPublicAccess: {
                blockPublicAcls: false,
                blockPublicPolicy: false,
                ignorePublicAcls: false,
                restrictPublicBuckets: false,
            },
            bucketName: props.domainName,
            objectOwnership: ObjectOwnership.OBJECT_WRITER,
            removalPolicy: RemovalPolicy.DESTROY,
            websiteErrorDocument: props.websiteError,
            websiteIndexDocument: props.websiteIndex,
        });
        this.__websiteBucket = websiteBucket;

        websiteBucket.addToResourcePolicy(
            new PolicyStatement({
                effect: Effect.ALLOW,
                principals: [new AnyPrincipal()],
                actions: ["s3:GetObject"],
                resources: [websiteBucket.arnForObjects("*")],
                conditions: { StringEquals: { "aws:Referer": props.refererHeaderValue } }
            }),
        );

        const redirectWebsiteBucket = new Bucket(this, "websiteRedirectBucket", {
            accessControl: BucketAccessControl.PRIVATE,
            blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
            bucketName: `www.${props.domainName}`,
            objectOwnership: ObjectOwnership.OBJECT_WRITER,
            removalPolicy: RemovalPolicy.DESTROY,
            websiteRedirect: { hostName: `${props.domainName}` },
        });
        this.__redirectWebsiteBucket = redirectWebsiteBucket;
    }

    public get websiteBucket(): Bucket {
        return this.__websiteBucket;
    }

    public get redirectWebsiteBucket(): Bucket {
        return this.__redirectWebsiteBucket;
    }
}
