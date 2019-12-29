import '@aws-cdk/assert/jest';

import { SynthUtils } from '@aws-cdk/assert';
import kms = require('@aws-cdk/aws-kms');
import { Stack } from '@aws-cdk/core';

import secret = require('../lib');

test('Create key pair based on DSA private key', () => {
    const stack = new Stack();

    const key = new kms.Key(stack, 'TestKey', {
        enableKeyRotation: false,
        description: 'Key to encrypt all secrets with',
        alias: 'alias/test/key',
    });

    const secretProvider = new secret.Provider(stack, 'SecretProvider', {});
    if (secretProvider.fn.role) {
        key.grantEncryptDecrypt(secretProvider.fn.role);
    }

    const privateKey = secretProvider.dsaKey(stack, 'PrivateKey', {
        name: 'PrivateKey',
        version: 'v1',
        keyAlias: 'alias/test/key',
    });
    privateKey.node.addDependency(key);

    secretProvider.keyPair(stack, 'KeyPair', {
        name: 'KeyPair',
        publicKeyMaterial: privateKey.publicKey,
    });

    expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();

    expect(stack).toHaveResource('Custom::DSAKey', {
        'KeyAlias': 'alias/test/key',
        'Name': 'PrivateKey',
        'Version': 'v1',
    });

    expect(stack).toHaveResource('Custom::KeyPair', {
        'Name': 'KeyPair',
    });
});
