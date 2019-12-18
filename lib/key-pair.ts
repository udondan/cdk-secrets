import cfn = require('@aws-cdk/aws-cloudformation');
import lambda = require('@aws-cdk/aws-lambda');
import cdk = require('@aws-cdk/core');

import common = require('./common');

export interface KeyPairProps extends common.CommonProps {

    /**
    * The name of the value in the parameters store
    */
    readonly name: string;

    /**
    * The public key to import
    */
    readonly publicKeyMaterial: string;
}

export class KeyPair extends cdk.Construct {
    public readonly arn: string = '';
    public readonly name: string = '';

    constructor(scope: cdk.Construct, id: string, props: KeyPairProps, provider?: lambda.IFunction) {
        super(scope, id);

        if (!provider) {
            provider = props.provider;
        }
        if (!provider) {
            this.node.addError('provider is required');
            return;
        }

        const keyPair = new cfn.CustomResource(this, "KeyPair", {
            provider: cfn.CustomResourceProvider.fromLambda(provider),
            resourceType: "Custom::KeyPair",
            properties: common.makeProperties(props)
        });

        this.arn = keyPair.getAttString('Arn');
        this.name = keyPair.getAttString('Name');
    }
}
