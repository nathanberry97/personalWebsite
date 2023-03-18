import { Bucket } from 'aws-cdk-lib/aws-s3';
import { PolicyStatement, Effect, AnyPrincipal } from 'aws-cdk-lib/aws-iam';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';

interface bucketValues{
  bucketName: string;
  websiteIndex: string;
}

export class websiteBucket extends Construct {
  constructor(scope: Construct, id: string, props: bucketValues) {
    super(scope, id);

    const websiteBucket = new Bucket(this, 'websiteBucket', {
      bucketName: props.bucketName,
      websiteIndexDocument: props.websiteIndex
    });

    new Bucket(this, 'websiteRedirectBucket', {
      bucketName: `www.${props.bucketName}`,
      websiteRedirect: { 
        hostName: `${websiteBucket.bucketDomainName}/index.html`
      }
    });

    const publicBucket = new PolicyStatement({
       actions: ['s3:GetObject'],
       effect: Effect.ALLOW,
       principals: [new AnyPrincipal()],
       resources: [websiteBucket.arnForObjects('*')]
    });

    websiteBucket.addToResourcePolicy(publicBucket);
    
    new BucketDeployment(this, 'uploadWebsite', {
        destinationBucket: websiteBucket,
        sources: [ Source.asset('../src/') ]
    });
  }
}
