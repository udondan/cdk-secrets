#!/usr/bin/env node
import 'source-map-support/register';

import cdk = require('@aws-cdk/core');

import { KeyPairStack } from '../lib/key-pair';

const app = new cdk.App();
new KeyPairStack(app, 'KeyPairStack');
