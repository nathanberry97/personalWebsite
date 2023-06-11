import { Bucket, BucketAccessControl, BlockPublicAccess } from 'aws-cdk-lib/aws-s3';
import { PolicyStatement, Effect, AnyPrincipal } from 'aws-cdk-lib/aws-iam'
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { RemovalPolicy } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export interface websiteValues{
  domainName: string;
  websiteIndex: string;
}

export class websiteS3 extends Construct {
  private __websiteBucket: Bucket;
  private __redirectWebsiteBucket: Bucket;

  constructor(scope: Construct, id: string, props: websiteValues) {
    super(scope, id);

    const websiteBucket = new Bucket(this, 'websiteBucket', {
      bucketName: props.domainName,
      accessControl: BucketAccessControl.PRIVATE,
      blockPublicAccess: {
        blockPublicAcls: false,
        blockPublicPolicy: false,
        ignorePublicAcls: false,
        restrictPublicBuckets: false
      },
      websiteIndexDocument: props.websiteIndex,
      removalPolicy: RemovalPolicy.DESTROY
    });
    this.__websiteBucket = websiteBucket;

    const redirectWebsiteBucket = new Bucket(this, 'websiteRedirectBucket', {
      bucketName: `www.${props.domainName}`,
      accessControl: BucketAccessControl.PRIVATE,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      websiteRedirect: { hostName: `${props.domainName}` },
      removalPolicy: RemovalPolicy.DESTROY
    });
    this.__redirectWebsiteBucket = redirectWebsiteBucket;

    websiteBucket.addToResourcePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        principals: [ new AnyPrincipal() ],
        actions: [ 's3:GetObject' ],
        resources: [
          websiteBucket.arnForObjects('*'),
          websiteBucket.bucketArn
        ],
      })
    );

    new BucketDeployment(this, 'uploadWebsite', {
      destinationBucket: websiteBucket,
      sources: [Source.asset('../src/')]
    });
  }

  public get websiteBucket(): Bucket {
    return this.__websiteBucket;
  }

  public get redirectWebsiteBucket(): Bucket {
    return this.__redirectWebsiteBucket;
  }
}
