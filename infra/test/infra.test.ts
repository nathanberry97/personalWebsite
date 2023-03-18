import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as Infra from '../lib/infra-stack';

test('S3 bucket Created', () => {
   const app = new cdk.App();
   const stack = new Infra.InfraStack(app, 'MyTestStack');
   const template = Template.fromStack(stack);

   template.resourceCountIs('AWS::S3::Bucket', 1)
   template.hasResourceProperties('AWS::S3::Bucket', {});
});
