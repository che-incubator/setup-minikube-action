/**********************************************************************
 * Copyright (c) 2021 Red Hat, Inc.
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 ***********************************************************************/
import 'reflect-metadata';

import * as core from '@actions/core';
import * as toolCache from '@actions/tool-cache';

import { Configuration } from '../src/configuration';
import { Container } from 'inversify';
import { MinikubeSetupHelper } from '../src/minikube-setup-helper';
import { execFile } from '../src/exec';

jest.mock('../src/exec');

describe('Test MinikubeStartHelper', () => {
  let container: Container;
  let minikubeSetupHelper: MinikubeSetupHelper;
  let configuration: any;
  const minikubeVersionMethod = jest.fn();

  beforeEach(() => {
    container = new Container();
    configuration = {
      minikubeVersion: minikubeVersionMethod,
    };
    container.bind(Configuration).toConstantValue(configuration);
    container.bind(MinikubeSetupHelper).toSelf().inSingletonScope();
    minikubeSetupHelper = container.get(MinikubeSetupHelper);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  test('start default minikube', async () => {
    await minikubeSetupHelper.setup();
    // core.info
    expect(core.info).toHaveBeenCalledTimes(1);
    expect((core.info as any).mock.calls[0][0]).toContain('use pre-installed minikube version');
    expect(execFile).toHaveBeenCalledTimes(0);
  });

  test('start custom minikube', async () => {
    (execFile as any).mockResolvedValue({ stdout: '', stderr: '' });
    const customMinikubeVersion = '1.2.3-custom-minikube';
    minikubeVersionMethod.mockReturnValue(customMinikubeVersion);

    const fakeDownloadedPath = '/fake/download-archive';
    const downloadToolSpy = jest.spyOn(toolCache, 'downloadTool');
    downloadToolSpy.mockResolvedValue(fakeDownloadedPath);
    await minikubeSetupHelper.setup();
    // core.info
    expect(core.info).toHaveBeenCalled();
    expect((core.info as any).mock.calls[0][0]).toContain(`Downloading minikube ${customMinikubeVersion}...`);

    expect(downloadToolSpy).toHaveBeenCalled();
    expect(downloadToolSpy.mock.calls[0][0]).toBe(
      'https://github.com/kubernetes/minikube/releases/download/1.2.3-custom-minikube/minikube-linux-amd64',
    );

    expect(execFile).toHaveBeenCalledTimes(2);
    expect((execFile as any).mock.calls[0][0]).toBe('sudo');
    expect((execFile as any).mock.calls[0][1][0]).toBe('-E');
    expect((execFile as any).mock.calls[0][1][1]).toBe('chmod');
    expect((execFile as any).mock.calls[0][1][2]).toBe('755');
    expect((execFile as any).mock.calls[0][1][3]).toBe(fakeDownloadedPath);

    expect((execFile as any).mock.calls[1][0]).toBe('sudo');
    expect((execFile as any).mock.calls[1][1][0]).toBe('-E');
    expect((execFile as any).mock.calls[1][1][1]).toBe('mv');
  });
});
