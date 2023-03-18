import { Bucket } from 'aws-cdk-lib/aws-s3';
import { BucketWebsiteTarget } from 'aws-cdk-lib/aws-route53-targets';
import { PolicyStatement, Effect, AnyPrincipal } from 'aws-cdk-lib/aws-iam';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { ARecord, HostedZone, RecordTarget } from 'aws-cdk-lib/aws-route53';
import { Construct } from 'constructs';

interface bucketValues{
  domainName: string;
  websiteIndex: string;
}

export class websiteBucket extends Construct {
  constructor(scope: Construct, id: string, props: bucketValues) {
    super(scope, id);

    const websiteBucket = new Bucket(this, 'websiteBucket', {
      bucketName: props.domainName,
      websiteIndexDocument: props.websiteIndex
    });

    const redirectWebsiteBucket = new Bucket(this, 'websiteRedirectBucket', {
      bucketName: `www.${props.domainName}`,
      websiteRedirect: { 
        hostName: `${props.domainName}`
      }
    });

    const publicBucketPolicy = new PolicyStatement({
      actions: ['s3:GetObject'],
      effect: Effect.ALLOW,
      principals: [new AnyPrincipal()],
      resources: [websiteBucket.arnForObjects('*')]
    });

    websiteBucket.addToResourcePolicy(publicBucketPolicy);

    const hostedZone = HostedZone.fromLookup(this, 'hostedZone', {
      domainName: props.domainName
    });

    new ARecord(this, 'websiteDns', {
      zone: hostedZone,
      target: RecordTarget.fromAlias(
        new BucketWebsiteTarget(websiteBucket)
      )
    });

    new ARecord(this, 'redirectWebsiteDns', {
      zone: hostedZone,
      recordName: 'www',
      target: RecordTarget.fromAlias(
        new BucketWebsiteTarget(redirectWebsiteBucket)
      )
    });
    
    new BucketDeployment(this, 'uploadWebsite', {
      destinationBucket: websiteBucket,
      sources: [Source.asset('../src/')]
    });
  }
}
