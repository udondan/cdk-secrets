import cfn = require('@aws-cdk/aws-cloudformation');
import lambda = require('@aws-cdk/aws-lambda');
import cdk = require('@aws-cdk/core');

import common = require('./common');

export interface SecretManagerSecretProps extends common.CommonProps {

    /**
    * The name of the secret
    */
    readonly name: string;

    /**
    * The description of the secret in the parameter store
    * @default - ''
    */
    readonly description?: string;

    /**
    * The KMS key to use to encrypt the secret with
    * @default - 'alias/aws/secretsmanager'
    */
    readonly kmsKeyId?: string;

    /**
    * The secret as output parameter
    * @default - true
    */
    readonly noEcho?: boolean;

    /**
    * Base64 encoded secret
    * @default - ''
    */
    readonly secretBinary?: string;

    /**
    * Secret string or json object or array to be converted to string
    * @default - ''
    */
    readonly secretString?: any;

    /**
    * Number of days a deleted secret can be restored
    * @default - 30
    */
    readonly recoveryWindowInDays?: number;

    /**
    * A unique identifier for the new version to ensure idempotency
    * @default - ''
    */
    readonly clientRequestToken?: string;

    /**
    * Array of tags for the secret
    * @default - []
    */

    readonly tags?: common.Tags;
}

export class SecretManagerSecret extends cdk.Construct {
    public readonly versionId: string = '';

    constructor(scope: cdk.Construct, id: string, props: SecretManagerSecretProps, provider?: lambda.IFunction) {
        super(scope, id);

        if (!provider) {
            provider = props.provider;
        }
        if (!provider) {
            this.node.addError('provider is required');
            return;
        }

        const key = new cfn.CustomResource(this, 'SecretsManagerSecret', {
            provider: cfn.CustomResourceProvider.fromLambda(provider),
            resourceType: 'Custom::SecretsManagerSecret',
            properties: common.makeProperties(props),
        });

        this.versionId = key.getAttString('VersionId');
    }
}
