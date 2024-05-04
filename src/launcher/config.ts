import * as vscode from 'vscode';
import { LatebitTaskDefinition } from './types';
import { LatebitTaskType } from './utils';
import { makeExecution } from './cmake';

export class LatebitConfigurationTaskProvider implements vscode.TaskProvider {
  readonly type = LatebitTaskType.Configuration;

  constructor(private readonly context: vscode.ExtensionContext) { }

  provideTasks(token: vscode.CancellationToken): vscode.ProviderResult<vscode.Task[]> {
    const definition = { type: 'latebit' as const, typ: this.type };
    const configureTask = new vscode.Task(
      definition,
      vscode.TaskScope.Workspace,
      'Configure',
      'latebit',
      makeExecution(definition)
    );
    configureTask.detail = "Configure local environment to build the project.";

    return [configureTask];
  }

  resolveTask(task: vscode.Task, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Task> {
    const definition = task.definition as LatebitTaskDefinition;

    if (definition.typ !== this.type) return;

    return new vscode.Task(
      definition,
      vscode.TaskScope.Workspace,
      'Configure',
      'latebit',
      makeExecution(definition)
    );
  }
}