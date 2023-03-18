import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { websiteBucket } from './constructs/s3Bucket';

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create s3 bucket to host static website
    new websiteBucket(this, 'bucket',{
      bucketName: 'ENTER_BUCKET_NAME',
      websiteIndex: 'index.html'
    });
  }
}
