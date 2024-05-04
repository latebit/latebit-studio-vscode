import * as vscode from 'vscode';
import { LatebitTaskType } from './utils';

export interface LatebitTaskDefinition extends vscode.TaskDefinition {
  type: 'latebit';
  typ: LatebitTaskType;
  command?: string;
  flags?: string[];
  environment?: { [key: string]: string };
}
