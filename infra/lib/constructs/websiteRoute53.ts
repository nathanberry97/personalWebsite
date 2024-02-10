import { CloudFrontTarget } from "aws-cdk-lib/aws-route53-targets";
import { ARecord, HostedZone, RecordTarget } from "aws-cdk-lib/aws-route53";
import { Distribution } from "aws-cdk-lib/aws-cloudfront";
import { Construct } from "constructs";

export interface websiteValues {
    domainName: string;
    websiteDistribution: Distribution;
    redirectWebsiteDistribution: Distribution;
}

export class websiteRoute53 extends Construct {
    constructor(scope: Construct, id: string, props: websiteValues) {
        super(scope, id);

        const hostedZone = HostedZone.fromLookup(this, "hostedZone", {
            domainName: props.domainName,
        });

        new ARecord(this, "websiteDns", {
            zone: hostedZone,
            target: RecordTarget.fromAlias(
                new CloudFrontTarget(props.websiteDistribution),
            ),
        });

        new ARecord(this, "redirectWebsiteDns", {
            zone: hostedZone,
            recordName: "www",
            target: RecordTarget.fromAlias(
                new CloudFrontTarget(props.redirectWebsiteDistribution),
            ),
        });
    }
}
