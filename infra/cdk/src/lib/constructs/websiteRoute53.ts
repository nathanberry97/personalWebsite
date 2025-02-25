import { ARecord, HostedZone, RecordTarget } from "aws-cdk-lib/aws-route53";
import { CloudFrontTarget } from "aws-cdk-lib/aws-route53-targets";
import { Construct } from "constructs";
import { Distribution } from "aws-cdk-lib/aws-cloudfront";

export interface websiteRoute53Props {
    domainName: string;
    redirectWebsiteDistribution: Distribution;
    websiteDistribution: Distribution;
}

export class websiteRoute53 extends Construct {
    constructor(scope: Construct, id: string, props: websiteRoute53Props) {
        super(scope, id);

        const hostedZone = HostedZone.fromLookup(this, "HostedZone", {
            domainName: props.domainName,
        });

        new ARecord(this, "WebsiteDns", {
            target: RecordTarget.fromAlias(new CloudFrontTarget(props.websiteDistribution)),
            zone: hostedZone,
        });

        new ARecord(this, "RedirectWebsiteDns", {
            recordName: "www",
            target: RecordTarget.fromAlias(new CloudFrontTarget(props.redirectWebsiteDistribution)),
            zone: hostedZone,
        });
    }
}
