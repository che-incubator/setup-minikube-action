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
import * as toolCache from '@actions/tool-cache';

import { inject, injectable } from 'inversify';

import { execFile } from './exec';

import { Configuration } from './configuration';

/**
 * There is already minikube installed on the system but
 * we might want to stick to a given minikube version.
 */
@injectable()
export class MinikubeSetupHelper {
  @inject(Configuration)
  private configuration: Configuration;

  public static readonly MINIKUBE_OWN_PATH = '/usr/local/sbin/minikube';

  public static readonly MINIKUBE_VERSION: string = 'minikube';
  public static readonly MINIKUBE_VERSION_DEFAULT: string = 'default';

  public static readonly MINIKUBE_LINK =
    'https://github.com/kubernetes/minikube/releases/download/${VERSION}/minikube-linux-amd64';

  async setup(): Promise<void> {
    const minikubeVersion = this.configuration.minikubeVersion();
    // use existing installed minikube version
    if (!minikubeVersion) {
      core.info('Minikube version not specified. Will use pre-installed minikube version');
      return;
    }

    // download
    core.info(`'Downloading minikube ${minikubeVersion}...`);
    const link = MinikubeSetupHelper.MINIKUBE_LINK.replace('${VERSION}', minikubeVersion);

    // Download it through tool cache utility.
    const minikubeDownloadPath = await toolCache.downloadTool(link);

    // make it executable
    core.info('Make minikube executable');
    await execFile('sudo', ['-E', 'chmod', '755', minikubeDownloadPath]);

    // move minikube to a folder in path
    await execFile('sudo', ['-E', 'mv', minikubeDownloadPath, MinikubeSetupHelper.MINIKUBE_OWN_PATH]);

    core.info('Minikube installed at ' + MinikubeSetupHelper.MINIKUBE_OWN_PATH);
  }
}
