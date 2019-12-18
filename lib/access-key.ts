import cfn = require('@aws-cdk/aws-cloudformation');
import lambda = require('@aws-cdk/aws-lambda');
import cdk = require('@aws-cdk/core');

import common = require('./common');

export declare enum Status {
    ACTIVE = 'Active',
    INACTIVE = 'Inactive',
}

export interface AccessKeyProps extends common.CommonProps {

    /**
    * The user name to create the access key for
    */
    readonly userName: string;

    /**
    * The path for the credentials in the parameter store
    */
    readonly parameterPath: string;

    /**
    * The description of the value in the parameter store
    * @default - ''
    */
    readonly description?: string;

    /**
    * Return access ID and secret
    * @default - false
    */
    readonly returnSecret?: boolean;

    /**
    * Return access id and SMTP password
    *
    * @default - 2048
    */

    readonly returnPassword?: boolean;

    /**
    * Generate a new secret on update
    *
    * @default - false
    */
    readonly refreshOnUpdate?: boolean;

    /**
    * The KMS key to use to encrypt the value with
    * @default - 'alias/aws/ssm'
    */
    readonly keyAlias?: string;

    /**
    * Version to force update
    * @default - 1
    */
    readonly serial?: number;

    /**
    * Status of the key
    * @default - Active
    */
    readonly status?: Status;

    /**
    * The secrets as output parameter
    * @default - true
    */
    readonly noEcho?: boolean;
}

export class AccessKey extends cdk.Construct {
    //public readonly AccessKeyId: string;
    public readonly smtpPassword: string = '';
    public readonly secretAccessKey: string = '';

    constructor(scope: cdk.Construct, id: string, props: AccessKeyProps, provider?: lambda.IFunction) {
        super(scope, id);

        if (!provider) {
            provider = props.provider;
        }
        if (!provider) {
            this.node.addError('provider is required');
            return;
        }

        const key = new cfn.CustomResource(this, 'AccessKey', {
            provider: cfn.CustomResourceProvider.fromLambda(provider),
            resourceType: 'Custom::AccessKey',
            properties: common.makeProperties(props),
        });

        //this.AccessKeyId = key.getAttString('AccessKeyId'); //currently missing in lambda
        this.smtpPassword = key.getAttString('SMTPPassword');
        this.secretAccessKey = key.getAttString('SecretAccessKey');
    }
}
