import '@aws-cdk/assert/jest';

import { SynthUtils } from '@aws-cdk/assert';
import { Stack } from '@aws-cdk/core';

import secret = require('../lib');

test('Create Secret provider', () => {
    const stack = new Stack();

    new secret.Provider(stack, 'SecretProvider', {});

    expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();

    expect(stack).toHaveResource('AWS::KMS::Key');
    expect(stack).toHaveResource('AWS::KMS::Alias', {
        'AliasName': 'alias/cmk/cfn-secrets'
    });
    expect(stack).toHaveResource('AWS::Lambda::Function', {
        'Code': {
            'S3Bucket': 'binxio-public',
            'S3Key': 'lambdas/cfn-secret-provider-1.0.0.zip',
        }
    });

});
