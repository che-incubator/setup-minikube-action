/**********************************************************************
 * Copyright (c) 2021 Red Hat, Inc.
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 ***********************************************************************/

import { execFile as execFileCb } from 'node:child_process';
import { execFile } from '../src/exec';

jest.mock('node:child_process', () => ({
  execFile: jest.fn(),
}));

describe('execFile', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('resolves with stdout and stderr on success', async () => {
    (execFileCb as any).mockImplementation(
      (_cmd: string, _args: string[], callback: (err: Error | undefined, stdout?: string, stderr?: string) => void) => {
        callback(undefined, 'output', 'err-output');
      },
    );

    const result = await execFile('echo', ['hello']);
    expect(result).toEqual({ stdout: 'output', stderr: 'err-output' });
    expect(execFileCb).toHaveBeenCalledWith('echo', ['hello'], expect.any(Function));
  });

  test('rejects on error', async () => {
    const error = new Error('command failed');
    (execFileCb as any).mockImplementation(
      (_cmd: string, _args: string[], callback: (err: Error | undefined, stdout?: string, stderr?: string) => void) => {
        callback(error);
      },
    );

    await expect(execFile('bad', ['cmd'])).rejects.toThrow('command failed');
  });
});
