# CDK Secrets

[![CDK docs](https://img.shields.io/badge/CDK-docs-orange)][docs]
[![npm version](https://badge.fury.io/js/cdk-secrets.svg)][npm]
[![PyPI version](https://badge.fury.io/py/cdk-secrets.svg)][PyPI]
[![NuGet version](https://badge.fury.io/nu/CDK.Secrets.svg)][NuGet]
[![GitHub](https://img.shields.io/github/license/udondan/cdk-secrets)][license]

> **WORK IN PROGRESS**
>
> While this is generally working, it is not ready for production.

[AWS CDK] construct to manage secrets. It makes use of a custom resource provider from [binxio/cfn-secret-provider].

This package is written in TypeScript and made available via [JSII] to all other supported languages. Package are available on:

- [npm]
- [PyPI]
- [NuGet]

The secret provider can create RSA keys, DSA keys, EC2 key-pairs, IAM user passwords and access keys and generally secrets stored in parameter store or secret store.

All this functionality is provided by the [binxio/cfn-secret-provider] custom resource.

## Examples

There is an example application in [./example](https://github.com/udondan/cdk-secrets/blob/master/example) showing how to create a new EC2 key pair.

When it comes to security, you should not trust anyone. By default the secret provider uses the lambda function stored on `s3://binxio-public-${AWS_REGION}/lambdas/cfn-secret-provider-1.0.0.zip`. You might want to download this file, review its contents and store it in your own bucket or along with your code. You then can create the lambda function from that zip file instead like so:

```ts
const code = lambda.Code.fromAsset(path.join(__dirname, '../cfn-secret-provider-1.0.0.zip'));

const secretProvider = new secret.Provider(this, 'SecretProvider', {
   code: code,
});
```

   [AWS CDK]: https://aws.amazon.com/cdk/
   [JSII]: https://github.com/aws/jsii
   [npm]: https://www.npmjs.com/package/cdk-secrets
   [PyPI]: https://pypi.org/project/cdk-secrets/
   [NuGet]: https://www.nuget.org/packages/CDK.Secrets/
   [docs]: https://awscdk.io/packages/cdk-secrets@0.4.0
   [license]: https://github.com/udondan/cdk-secrets/blob/master/LICENSE
   [binxio/cfn-secret-provider]: https://github.com/binxio/cfn-secret-provider
