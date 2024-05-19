import * as vscode from 'vscode';
import { TaskKind } from './utils';

export interface TaskDefinition extends vscode.TaskDefinition {
  type: 'latebit';
  kind: TaskKind;
  command?: string;
  flags?: string[];
  environment?: { [key: string]: string };
}
