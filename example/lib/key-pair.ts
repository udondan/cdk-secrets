import kms = require('@aws-cdk/aws-kms');
import cdk = require('@aws-cdk/core');

import secret = require('../../lib');

export class KeyPairStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // we want to create a KMS key first, which will be used to encrypt all secrets
    const key = new kms.Key(this, 'EncryptionKey', {
      enableKeyRotation: false,
      description: 'Key to encrypt all secrets with',
      alias: 'alias/test/key',
    });

    // now we create the provider and allow it to use the previously created KMS key
    const secretProvider = new secret.Provider(this, 'SecretProvider', {});
    if (secretProvider.fn.role) {
      key.grantEncryptDecrypt(secretProvider.fn.role);
    }

    // the secretProvider object now provides methods for creating secrets

    // first let's create an RSA key
    const privateKey = secretProvider.rsaKey(this, 'RsaKey', {
      name: 'RsaKey',
      keyAlias: 'alias/test/key', // this is the alias name of the KMS key from above
    });

    // because the KMS key is (currently) referenced by its alias name there
    // ain't to implicit dependency and we need to set an explicit one
    privateKey.node.addDependency(key);

    // using the above RSA key we now can create a key pair
    secretProvider.keyPair(this, 'KeyPair', {
      name: 'KeyPair',
      publicKeyMaterial: privateKey.publicKey,
    });
  }
}
