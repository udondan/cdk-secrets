import cfn = require('@aws-cdk/aws-cloudformation');
import iam = require('@aws-cdk/aws-iam');
import lambda = require('@aws-cdk/aws-lambda');
import cdk = require('@aws-cdk/core');

import common = require('./common');

export interface SecretProps extends common.CommonProps {

  /**
  * The name of the secret in the parameter store
  */
  readonly name: string;

  /**
  * The description of the secret in the parameter store
  * @default - ''
  */
  readonly description?: string;

  /**
  * The alphabet of characters from which to generate a secret
  * @default - Defaults to ASCII letters, digits and punctuation characters
  */
  readonly alphabet?: string;

  /**
  * The length of the secret
  * @default - 30
  */
  readonly length?: number;

  /**
  * The KMS key to use to encrypt the secret with
  * @default - 'alias/aws/ssm'
  */
  readonly keyAlias?: string;

  /**
  * Return the secret as an attribute
  * @default - false
  */
  readonly returnSecret?: boolean;

  /**
  * Generate a new secret on update
  * @default - false
  */
  readonly refreshOnUpdate?: boolean;

  /**
  * Indicates whether output of the return values is replaced by *****
  * @default - true
  */
  readonly noEcho?: boolean;

  /**
  * Base64 encoded KMS encoded secret, to be decrypted before stored
  * @default - ''
  */
  readonly encryptedContent?: string;

  /**
  * Plain text secret to be stored
  * @default - ''
  */
  readonly content?: string;
}

export class Secret extends cdk.Construct {
  public readonly arn: string = '';
  public readonly secret: string = '';
  public readonly hash: string = '';
  public readonly version: string = '';

  constructor(scope: cdk.Construct, id: string, props: SecretProps, provider?: lambda.IFunction) {
    super(scope, id);

    if (!provider) {
      provider = props.provider;
    }
    if (!provider) {
      this.node.addError('provider is required');
      return;
    }

    const key = new cfn.CustomResource(this, 'Secret', {
      provider: cfn.CustomResourceProvider.fromLambda(provider),
      resourceType: 'Custom::Secret',
      properties: common.makeProperties(props),
    });

    this.arn = key.getAttString('Arn');
    this.secret = key.getAttString('Secret');
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
