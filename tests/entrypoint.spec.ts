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

const startMethodMock = jest.fn();

jest.mock('../src/main', () => ({
  Main: function () {
    return { start: startMethodMock };
  },
}));

describe('Test Entrypoint', () => {
  const originalProcessExitCode = process.exitCode;
  const originalConsoleError = console.error;
  const mockedConsoleError = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
    jest.resetModules();
    console.error = mockedConsoleError;
  });
  afterEach(() => {
    console.error = originalConsoleError;
    process.exitCode = originalProcessExitCode;
  });

  test('entrypoint', async () => {
    startMethodMock.mockResolvedValue(true);
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    await require('../src/entrypoint');
    expect(startMethodMock).toHaveBeenCalled();
    expect(process.exitCode).toBeUndefined();
  });

  test('entrypoint fail to start', async () => {
    const spyExit = jest.spyOn(process, 'exit');
    const value: never = {} as never;
    spyExit.mockReturnValue(value);
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    await require('../src/entrypoint');
    startMethodMock.mockResolvedValue(false);
    expect(spyExit).toHaveBeenCalled();
    expect(startMethodMock).toHaveBeenCalled();
  });
});
