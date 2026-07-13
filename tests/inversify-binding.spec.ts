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

import { Configuration } from '../src/configuration';
import { Container } from 'inversify';
import { InversifyBinding } from '../src/inversify-binding';
import { LaunchMinikube } from '../src/launch-minikube';
import { MinikubeSetupHelper } from '../src/minikube-setup-helper';
import { MinikubeStartHelper } from '../src/minikube-start-helper';

describe('Test InversifyBinding', () => {
  test('bindings', async () => {
    const minikubeVersion = '1.2.3';

    const predefinedConfiguration = {
      minikubeVersion: () => minikubeVersion,
    } as any;
    const inversifyBinding = new InversifyBinding(predefinedConfiguration);
    const container: Container = await inversifyBinding.initBindings();

    expect(container.isBound(MinikubeSetupHelper)).toBeTruthy();
    expect(container.isBound(MinikubeStartHelper)).toBeTruthy();

    // config
    const configuration: Configuration = container.get(Configuration);
    expect(configuration).toBeDefined();
    expect(configuration.minikubeVersion()).toEqual(minikubeVersion);

    expect(container.isBound(LaunchMinikube)).toBeTruthy();
  });
});
