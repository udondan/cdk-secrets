import iam = require('@aws-cdk/aws-iam');
import kms = require('@aws-cdk/aws-kms');
import lambda = require('@aws-cdk/aws-lambda');
import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/core');

import accessKey = require('./access-key');
import dsaKey = require('./dsa-key');
import keyPair = require('./key-pair');
import rsaKey = require('./rsa-key');
import secret = require('./secret');
import secretManagerSecret = require('./secretmanager-secret');


export * from './access-key';
export * from './dsa-key';
export * from './rsa-key';
export * from './key-pair';
export * from './secret';
export * from './secretmanager-secret';
export * from './common';


export interface ProviderProps {
    /**
    * Code for the Provider lambda function
    *
    * @default - Use code from s3 bucket binxio-public
    */
    readonly code?: lambda.Code;
}

export class Provider extends cdk.Construct {
    public readonly key: kms.Key;
    public readonly fn: lambda.SingletonFunction;
    constructor(scope: cdk.Construct, id: string, props: ProviderProps) {
        super(scope, id);

        this.key = new kms.Key(this, 'Key', {
            enableKeyRotation: true,
            description: 'Used for encryption of secrets in CloudFormation templates',
            alias: 'alias/cmk/cfn-secrets',

        });

        let code = props.code;
        if (!code) {
            const bucket = s3.Bucket.fromBucketName(this, 'binxio-public', 'binxio-public');
            code = new lambda.S3Code(bucket, 'lambdas/cfn-secret-provider-1.0.0.zip');
        }

        this.fn = new lambda.SingletonFunction(this, 'Provider', {
            uuid: '2328c719-05b8-4945-84c1-82c4142f0997',
            description: 'CloudFormation Custom:Secret implementation',
            runtime: lambda.Runtime.PYTHON_3_7,
            handler: 'secrets.handler',
            code: code,
        });

        if (this.fn.role) {
            this.fn.role.attachInlinePolicy(new iam.Policy(this, 'Policy', {
                statements: [
                    new iam.PolicyStatement({
                        actions: [
                            'iam:CreateAccessKey',
                            'iam:DeleteAccessKey',
                            'iam:UpdateAccessKey',
                            'ssm:PutParameter',
                            'ssm:GetParameter',
                            'ssm:DeleteParameter',
                            'ec2:ImportKeyPair',
                            'ec2:DeleteKeyPair',
                            'secretsmanager:DeleteSecret',
                            'secretsmanager:CreateSecret',
                            'secretsmanager:UpdateSecret',
                        ],
                        resources: ['*'],
                    }),
                    new iam.PolicyStatement({
                        actions: ['logs:*',],
                        resources: ['*'],
                    }),
                ]
            }));
            this.key.grantEncrypt(this.fn.role);
        }
    }

    dsaKey(scope: cdk.Construct, id: string, props: dsaKey.DSAKeyProps) {
        return new dsaKey.DSAKey(scope, id, props, this.fn);
    }

    rsaKey(scope: cdk.Construct, id: string, props: rsaKey.RSAKeyProps) {
        return new dsaKey.DSAKey(scope, id, props, this.fn);
    }

    keyPair(scope: cdk.Construct, id: string, props: keyPair.KeyPairProps) {
        return new keyPair.KeyPair(scope, id, props, this.fn);
    }

    accessKey(scope: cdk.Construct, id: string, props: accessKey.AccessKeyProps) {
        return new accessKey.AccessKey(scope, id, props, this.fn);
    }

    secret(scope: cdk.Construct, id: string, props: secret.SecretProps) {
        return new secret.Secret(scope, id, props, this.fn);
    }

    secretManagerSecret(scope: cdk.Construct, id: string, props: secretManagerSecret.SecretManagerSecretProps) {
        return new secretManagerSecret.SecretManagerSecret(scope, id, props, this.fn);
    }
}
