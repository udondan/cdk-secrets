import cfn = require('@aws-cdk/aws-cloudformation');
import iam = require('@aws-cdk/aws-iam');
import lambda = require('@aws-cdk/aws-lambda');
import cdk = require('@aws-cdk/core');

import common = require('./common');
import dsaKey = require('./dsa-key');

export declare enum KeyFormat {
    PKCS8 = 'PKCS8',
    TRADITIONAL_OPEN_SSL = 'TraditionalOpenSSL',
}

export interface RSAKeyProps extends dsaKey.DSAKeyProps {

    /**
    * Encoding type of the private key
    *
    * @default - 2048
    */

    readonly keyFormat?: KeyFormat;
}

export class RSAKey extends cdk.Construct {
    public readonly arn: string = '';
    public readonly publicKey: string = '';
    public readonly publicKeyPEM: string = '';
    public readonly hash: string = '';
    public readonly version: string = '';
    public readonly name: string = '';

    constructor(scope: cdk.Construct, id: string, props: RSAKeyProps, provider?: lambda.IFunction) {
        super(scope, id);

        if (!provider) {
            provider = props.provider;
        }
        if (!provider) {
            this.node.addError('provider is required');
            return;
        }

        const key = new cfn.CustomResource(this, 'RSAKey', {
            provider: cfn.CustomResourceProvider.fromLambda(provider),
            resourceType: 'Custom::RSAKeyTest',
            properties: common.makeProperties(props),
        });

        this.arn = key.getAttString('Arn');
        this.publicKey = key.getAttString('PublicKey');
        this.publicKeyPEM = key.getAttString('PublicKeyPEM');
        this.hash = key.getAttString('Hash');
        this.version = key.getAttString('Version');
        this.name = props.name;
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
