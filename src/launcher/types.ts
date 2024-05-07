import * as vscode from 'vscode';
import { TaskType } from './utils';

export interface TaskDefinition extends vscode.TaskDefinition {
  type: 'latebit';
  typ: TaskType;
  command?: string;
  flags?: string[];
  environment?: { [key: string]: string };
}
