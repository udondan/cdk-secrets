import cfn = require('@aws-cdk/aws-cloudformation');
import iam = require('@aws-cdk/aws-iam');
import lambda = require('@aws-cdk/aws-lambda');
import cdk = require('@aws-cdk/core');

import common = require('./common');

export interface DSAKeyProps extends common.CommonProps {

    /**
    * The name of the private key in the parameter store
    */
    readonly name: string;

    /**
    * The description of the key in the parameter store
    * @default - ''
    */
    readonly description?: string;

    /**
    * The KMS key to use to encrypt the key with
    * @default - 'alias/aws/ssm'
    */
    readonly keyAlias?: string;

    /**
    * Number of bits in the key
    *
    * @default - 2048
    */

    readonly keySize?: number;

    /**
    * Generate a new secret on update
    *
    * @default - false
    */
    readonly refreshOnUpdate?: boolean;
}

export class DSAKey extends cdk.Construct {
    public readonly arn: string = '';
    public readonly publicKey: string = '';
    public readonly publicKeyPEM: string = '';
    public readonly hash: string = '';
    public readonly version: string = '';

    constructor(scope: cdk.Construct, id: string, props: DSAKeyProps, provider?: lambda.IFunction) {
        super(scope, id);

        if (!provider) {
            provider = props.provider;
        }

        if (!provider) {
            this.node.addError('provider is required');
            return;
        }

        const key = new cfn.CustomResource(this, 'DSAKey', {
            provider: cfn.CustomResourceProvider.fromLambda(provider),
            resourceType: 'Custom::DSAKey',
            properties: common.makeProperties(props),
        });

        this.arn = key.getAttString('Arn');
        this.publicKey = key.getAttString('PublicKey');
        this.publicKeyPEM = key.getAttString('PublicKeyPEM');
        this.hash = key.getAttString('Hash');
        this.version = key.getAttString('Version');
    }

    grantRead(grantee: iam.IGrantable) {
        const result = iam.Grant.addToPrincipal({
            grantee,
            actions: ['ssm:GetParameter'],
            resourceArns: [this.arn],
            scope: this
        });
        return result;
    }
}
