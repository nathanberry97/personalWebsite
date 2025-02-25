import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { Certificate, CertificateValidation } from "aws-cdk-lib/aws-certificatemanager";
import { HostedZone } from "aws-cdk-lib/aws-route53";

export interface CertStackProps extends cdk.StackProps {
    domainName: string;
}

export class CertStack extends cdk.Stack {
    private __certArn: string;

    constructor(scope: Construct, id: string, props: CertStackProps) {
        super(scope, id, props);

        const hostedZone = HostedZone.fromLookup(this, "HostedZone", {
            domainName: props.domainName,
        });

        this.__certArn = new Certificate(this, "WebsiteCert", {
            domainName: props.domainName,
            validation: CertificateValidation.fromDns(hostedZone),
        }).certificateArn;
    }

    public get certArn(): string {
        return this.__certArn;
    }
}
