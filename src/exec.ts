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

export function execFile(command: string, args: string[]): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    execFileCb(command, args, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}
