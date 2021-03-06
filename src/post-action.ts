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

import { inject, injectable } from 'inversify';

import { CollectMinikubeEventsHelper } from './collect-minikube-events-helper';

/**
 * Post Action
 */
@injectable()
export class PostAction {
  @inject(CollectMinikubeEventsHelper)
  private collectMinikubeEventsHelper: CollectMinikubeEventsHelper;

  public async execute(): Promise<void> {
    core.info('Post action being executed...');
    this.collectMinikubeEventsHelper.collect();
  }
}
