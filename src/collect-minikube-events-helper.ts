/**********************************************************************
 * Copyright (c) 2021-2025 Red Hat, Inc.
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 ***********************************************************************/

import * as core from '@actions/core';
import * as path from 'node:path';

import artifact, { UploadArtifactOptions } from '@actions/artifact';

import { writeFile } from 'node:fs/promises';

import { execFile } from './exec';
import { inject, injectable } from 'inversify';

import { Configuration } from './configuration';

@injectable()
export class CollectMinikubeEventsHelper {
  @inject(Configuration)
  private configuration: Configuration;

  async collect(): Promise<void> {
    // get events
    core.info('Capturing kubectl events');
    const { stdout } = await execFile('kubectl', [
      'get',
      'events',
      '--all-namespaces',
      '--sort-by=.metadata.creationTimestamp',
    ]);

    // add log as artifact
    const artifactName = `kubectl events ${this.configuration.jobNameSuffix()}`;

    const kubectlEventLogPath = '/tmp/kubectl-events.log';
    await writeFile(kubectlEventLogPath, stdout, 'utf-8');

    const files = [kubectlEventLogPath];
    const rootDirectory = path.dirname(kubectlEventLogPath);
    const options: UploadArtifactOptions = {
      retentionDays: 1,
      compressionLevel: 6,
    };

    // upload log
    await artifact.uploadArtifact(artifactName, files, rootDirectory, options);
  }
}
