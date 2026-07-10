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

import { Container } from 'inversify';
import { LaunchMinikube } from '../src/launch-minikube';
import { MinikubeSetupHelper } from '../src/minikube-setup-helper';
import { MinikubeStartHelper } from '../src/minikube-start-helper';

describe('Test LaunchMinikube', () => {
  let container: Container;
  let minikubeStartHelper: MinikubeStartHelper;
  let minikubeSetupHelper: MinikubeSetupHelper;

  beforeEach(() => {
    container = new Container();
    container.bind(LaunchMinikube).toSelf().inSingletonScope();

    minikubeSetupHelper = {
      setup: jest.fn(),
    } as any;
    container.bind(MinikubeSetupHelper).toConstantValue(minikubeSetupHelper);

    minikubeStartHelper = {
      start: jest.fn(),
    } as any;
    container.bind(MinikubeStartHelper).toConstantValue(minikubeStartHelper);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('basic', async () => {
    const launchMinikube = container.get(LaunchMinikube);
    await launchMinikube.execute();
    expect(minikubeSetupHelper.setup).toHaveBeenCalled();

    expect(minikubeStartHelper.start).toHaveBeenCalled();
  });
});
