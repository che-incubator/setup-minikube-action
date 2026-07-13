/**********************************************************************
 * Copyright (c) 2021 Red Hat, Inc.
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 ***********************************************************************/

import * as core from '@actions/core';

import { spawn } from 'node:child_process';

import { injectable } from 'inversify';

@injectable()
export class MinikubeStartHelper {
  async start(): Promise<void> {
    const env = {
      ...process.env,
      CHANGE_MINIKUBE_NONE_USER: 'true',
      MINIKUBE_WANTUPDATENOTIFICATION: 'false',
    };
    core.info('Starting minikube...');
    await new Promise<void>((resolve, reject) => {
      const child = spawn(
        'minikube',
        ['start', '--vm-driver=docker', '--addons=ingress', '--cpus', '2', '--memory', '6500'],
        { env, stdio: ['ignore', 'pipe', 'pipe'] },
      );
      if (child.stdout) {
        child.stdout.pipe(process.stdout);
      }
      if (child.stderr) {
        child.stderr.pipe(process.stderr);
      }
      child.on('close', code => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`minikube exited with code ${code}`));
        }
      });
      child.on('error', reject);
    });
  }
}
