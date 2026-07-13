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

import { EventEmitter } from 'node:events';
import { Container } from 'inversify';
import { MinikubeStartHelper } from '../src/minikube-start-helper';
import { spawn } from 'node:child_process';

/* eslint-disable @typescript-eslint/no-explicit-any */

jest.mock('node:child_process');

describe('Test MinikubeStartHelper', () => {
  let container: Container;
  let minikubeStartHelper: MinikubeStartHelper;

  beforeEach(() => {
    container = new Container();

    container.bind(MinikubeStartHelper).toSelf().inSingletonScope();
    minikubeStartHelper = container.get(MinikubeStartHelper);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  test('start no stdout/stderr', async () => {
    const child = new EventEmitter();
    (child as any).stdout = undefined;
    (child as any).stderr = undefined;
    (spawn as any).mockReturnValue(child);

    const startPromise = minikubeStartHelper.start();
    child.emit('close', 0);
    await startPromise;

    expect(core.info).toBeCalled();
    expect((core.info as any).mock.calls[0][0]).toContain('Starting minikube...');

    expect((spawn as any).mock.calls[0][0]).toBe('minikube');
    expect((spawn as any).mock.calls[0][1][0]).toBe('start');
  });

  test('start with stdout/stderr', async () => {
    const child = new EventEmitter();
    const stdout = new EventEmitter();
    (stdout as any).pipe = jest.fn();
    const stderr = new EventEmitter();
    (stderr as any).pipe = jest.fn();
    (child as any).stdout = stdout;
    (child as any).stderr = stderr;
    (spawn as any).mockReturnValue(child);

    const startPromise = minikubeStartHelper.start();
    child.emit('close', 0);
    await startPromise;

    expect(core.info).toBeCalled();
    expect((core.info as any).mock.calls[0][0]).toContain('Starting minikube...');

    expect((spawn as any).mock.calls[0][0]).toBe('minikube');
    expect((spawn as any).mock.calls[0][1][0]).toBe('start');
    expect((stdout as any).pipe).toHaveBeenCalledWith(process.stdout);
    expect((stderr as any).pipe).toHaveBeenCalledWith(process.stderr);
  });

  test('start with non-zero exit code', async () => {
    const child = new EventEmitter();
    (child as any).stdout = undefined;
    (child as any).stderr = undefined;
    (spawn as any).mockReturnValue(child);

    const startPromise = minikubeStartHelper.start();
    child.emit('close', 1);

    await expect(startPromise).rejects.toThrow('minikube exited with code 1');
  });

  test('start with spawn error', async () => {
    const child = new EventEmitter();
    (child as any).stdout = undefined;
    (child as any).stderr = undefined;
    (spawn as any).mockReturnValue(child);

    const startPromise = minikubeStartHelper.start();
    child.emit('error', new Error('spawn failed'));

    await expect(startPromise).rejects.toThrow('spawn failed');
  });
});
