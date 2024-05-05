import * as vscode from 'vscode';
import { LatebitTaskDefinition } from './types';
import { LatebitTaskType } from './utils';
import { makeExecution } from './cmake';

export class LatebitTaskProvider implements vscode.TaskProvider {
  private readonly source = 'latebit' as const;
  private readonly type = 'latebit' as const;

  provideTasks(token: vscode.CancellationToken): vscode.ProviderResult<vscode.Task[]> {
    const configDefinition = { type: this.type, typ: LatebitTaskType.Configure };
    const configureTask = new vscode.Task(
      configDefinition,
      vscode.TaskScope.Workspace,
      'Configure',
      this.source,
      makeExecution(configDefinition),
      []
    );
    configureTask.detail = "Configure local environment to build the project.";

    const buildDefinition = { type: this.type, typ: LatebitTaskType.Build };
    const buildTask = new vscode.Task(
      buildDefinition,
      vscode.TaskScope.Workspace,
      'Build',
      this.source,
      makeExecution(buildDefinition),
      []
    );
    buildTask.detail = "Build the project.";

    return [
      buildTask,
      configureTask
    ];
  }

  resolveTask(task: vscode.Task, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Task> {
    const definition = task.definition as LatebitTaskDefinition;

    return new vscode.Task(
      definition,
      vscode.TaskScope.Workspace,
      task.name,
      task.source,
      makeExecution(definition),
      []
    );
  }
}