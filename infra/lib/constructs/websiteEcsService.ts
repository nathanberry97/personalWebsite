import {
    Cluster,
    FargateTaskDefinition,
    ContainerImage,
} from "aws-cdk-lib/aws-ecs";
import { Vpc, SubnetType } from "aws-cdk-lib/aws-ec2";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { EcsTask } from "aws-cdk-lib/aws-events-targets";
import { Rule, Schedule } from "aws-cdk-lib/aws-events";
import { Repository } from "aws-cdk-lib/aws-ecr";
import { AwsLogDriver } from "aws-cdk-lib/aws-ecs";
import { LogGroup } from "aws-cdk-lib/aws-logs";
import { RetentionDays } from "aws-cdk-lib/aws-logs";
import { Construct } from "constructs";

export interface ecsServiceProps {
    ecsClusterName: string;
    ecrRepoName: string;
    s3BucketHtmlArn: string;
    s3BucketHtmlArnObjects: string;
    vpcId: string;
}

export class websiteEcsService extends Construct {
    constructor(scope: Construct, id: string, props: ecsServiceProps) {
        super(scope, id);

        const apodHtmlCluster = new Cluster(this, "ecsCluster", {
            clusterName: props.ecsClusterName,
            containerInsights: true,
            vpc: Vpc.fromLookup(this, "defaultVpc", { vpcId: props.vpcId }),
        });

        const taskDefinition = new FargateTaskDefinition(
            this,
            "ecsTaskDefinition",
            {
                cpu: 256,
                memoryLimitMiB: 512,
            },
        );

        const ecsLogGroup = new LogGroup(this, "htmlLogGroup", {
            logGroupName: "apodHtmlEcs",
            retention: RetentionDays.ONE_DAY,
        });

        taskDefinition.addContainer("apodHtml", {
            image: ContainerImage.fromEcrRepository(
                Repository.fromRepositoryName(
                    this,
                    "apodHtmlRepo",
                    props.ecrRepoName,
                ),
                "nasa_apod_html",
            ),
            cpu: 256,
            memoryLimitMiB: 512,
            logging: AwsLogDriver.awsLogs({
                streamPrefix: "apodHtmlEcs",
                logGroup: ecsLogGroup,
            }),
        });

        taskDefinition.addToTaskRolePolicy(
            PolicyStatement.fromJson({
                Effect: "Allow",
                Action: [
                    "s3:PutObject",
                    "s3:PutObjectAcl",
                    "s3:GetObjectAcl",
                    "s3:ListBucket",
                    "s3:GetBucketLocation",
                ],
                Resource: [props.s3BucketHtmlArn, props.s3BucketHtmlArnObjects],
            }),
        );

        const scheduledEcsTask = new EcsTask({
            cluster: apodHtmlCluster,
            taskDefinition: taskDefinition,
            taskCount: 1,
            subnetSelection: { subnetType: SubnetType.PUBLIC },
        });

        new Rule(this, "scheduledTaskHtml", {
            schedule: Schedule.cron({ minute: "0", hour: "7" }),
            targets: [scheduledEcsTask],
        });

        /**
         * Run the ECS task 5 minutes after deployment:
         *   - This is due to BucketDeployment overwriting the apod.html file
         */
        const time = new Date();
        new Rule(this, "runEcsTaskOnDeployment", {
            schedule: Schedule.cron({
                minute: (time.getMinutes() + 5).toString(),
                hour: time.getHours().toString(),
                day: time.getDate().toString(),
                month: time.getMonth().toString(),
                year: time.getFullYear().toString(),
            }),
            targets: [scheduledEcsTask],
        });
    }
}
