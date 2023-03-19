import { Bucket, BucketAccessControl, BlockPublicAccess } from 'aws-cdk-lib/aws-s3';
import { CloudFrontTarget } from 'aws-cdk-lib/aws-route53-targets';
import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { ARecord, HostedZone, RecordTarget } from 'aws-cdk-lib/aws-route53';
import { Distribution, OriginAccessIdentity, ViewerProtocolPolicy } from 'aws-cdk-lib/aws-cloudfront';
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { Construct } from 'constructs';

export interface websiteValues{
  domainName: string;
  websiteIndex: string;
  certArn: string;
}

export class staticWebsite extends Construct {
  constructor(scope: Construct, id: string, props: websiteValues) {
    super(scope, id);

    /*
     * Configure s3
     */
    const websiteBucket = new Bucket(this, 'websiteBucket', {
      bucketName: props.domainName,
      accessControl: BucketAccessControl.PRIVATE,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      websiteIndexDocument: props.websiteIndex,
    });

    const redirectWebsiteBucket = new Bucket(this, 'websiteRedirectBucket', {
      bucketName: `www.${props.domainName}`,
      accessControl: BucketAccessControl.PRIVATE,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      websiteRedirect: { 
        hostName: `${props.domainName}`
      },
    });

    new BucketDeployment(this, 'uploadWebsite', {
      destinationBucket: websiteBucket,
      sources: [Source.asset('../src/')]
    });

    /*
     * Configure cloudfront
     */
    const cloudfrontPolicy = new OriginAccessIdentity(this, 'accessIdentity')
    websiteBucket.grantRead(cloudfrontPolicy)

    const cert = Certificate.fromCertificateArn(this, 'cert', props.certArn);

    const websiteDistribution = new Distribution(this, 'cloudfrontDistribution', {
      defaultRootObject: 'index.html',
      domainNames: [props.domainName],
      certificate: cert,
      defaultBehavior: {
        origin: new S3Origin(websiteBucket, {
          originAccessIdentity: cloudfrontPolicy
        }),
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS
      }
    });

    const redirectWebsiteDistribution = new Distribution(this, 'redirectCloudfrontDistribution', {
      domainNames: [`www.${props.domainName}`],
      certificate: cert,
      defaultBehavior: {
        origin: new S3Origin(redirectWebsiteBucket),
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS
      }
    });

    /*
     * Configure Route53
     */
    const hostedZone = HostedZone.fromLookup(this, 'hostedZone', {
      domainName: props.domainName
    });

    new ARecord(this, 'websiteDns', {
      zone: hostedZone,
      target: RecordTarget.fromAlias(
        new CloudFrontTarget(websiteDistribution)
      )
    });

    new ARecord(this, 'redirectWebsiteDns', {
      zone: hostedZone,
      recordName: 'www',
      target: RecordTarget.fromAlias(
        new CloudFrontTarget(redirectWebsiteDistribution)
      )
    });
  }
}
