/**********************************************************************
 * Copyright (c) 2021-2025 Red Hat, Inc.
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 ***********************************************************************/
import 'reflect-metadata';

import * as core from '@actions/core';

import { CollectMinikubeEventsHelper } from '../src/collect-minikube-events-helper';
import { Configuration } from '../src/configuration';
import { Container } from 'inversify';
import artifact from '@actions/artifact';
import { execFile } from '../src/exec';
import { writeFile } from 'node:fs/promises';

/* eslint-disable @typescript-eslint/no-explicit-any */

jest.mock('../src/exec');
jest.mock('node:fs/promises', () => ({
  writeFile: jest.fn().mockResolvedValue(undefined),
}));

describe('Test CollectMinikubeEventsHelper', () => {
  let container: Container;
  let collectMinikubeEventsHelper: CollectMinikubeEventsHelper;
  let configuration: any;
  const jobNameSuffixMethod = jest.fn();

  beforeEach(() => {
    container = new Container();
    configuration = {
      jobNameSuffix: jobNameSuffixMethod,
    };
    container.bind(Configuration).toConstantValue(configuration);

    container.bind(CollectMinikubeEventsHelper).toSelf().inSingletonScope();
    collectMinikubeEventsHelper = container.get(CollectMinikubeEventsHelper);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  test('collect', async () => {
    const stdout = 'dummy output of kubectl get events commmand';
    const defaultOptions = {
      retentionDays: 1,
      compressionLevel: 6,
    };

    (execFile as any).mockResolvedValue({ stdout, stderr: '' });

    (writeFile as any).mockResolvedValue(undefined);
    const uploadArtifactSpy = jest.spyOn(artifact, 'uploadArtifact').mockResolvedValue({} as any);
    jobNameSuffixMethod.mockReturnValue('suffix');
    await collectMinikubeEventsHelper.collect();
    // core.info
    expect(core.info).toBeCalled();
    expect((core.info as any).mock.calls[0][0]).toContain('Capturing kubectl events');

    expect((execFile as any).mock.calls[0][0]).toBe('kubectl');
    expect((execFile as any).mock.calls[0][1][0]).toBe('get');
    expect((execFile as any).mock.calls[0][1][1]).toBe('events');

    expect(writeFile).toBeCalledWith('/tmp/kubectl-events.log', stdout, 'utf-8');
    expect(uploadArtifactSpy).toHaveBeenCalledWith(
      'kubectl events suffix',
      ['/tmp/kubectl-events.log'],
      '/tmp',
      defaultOptions,
    );
  });
});
