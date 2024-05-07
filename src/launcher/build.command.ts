import * as vscode from 'vscode';
import { DEFAULT_CONFIGURATION, CommandType, TaskType } from './utils';
import { getCMakeExtensionParameters } from './cmake';

export class BuildCommandsProvider {
  static register(context: vscode.ExtensionContext): vscode.Disposable[] {
    const provider = new BuildCommandsProvider(context);
    return [
      vscode.commands.registerCommand(CommandType.Build, () => provider.build()),
      vscode.commands.registerCommand(CommandType.Configure, () => provider.configure())
    ]
  }

  constructor(private readonly context: vscode.ExtensionContext) { }

  async build() {
    const tasks = await vscode.tasks.fetchTasks({ type: 'latebit' });
    const buildTask = await this.getBuildTask(tasks);
    const isConfigured = await this.isConfigured();

    if (!isConfigured) {
      const configureTask = await this.getConfigureTask(tasks);
      await vscode.tasks.executeTask(configureTask);
      const { dispose } = vscode.tasks.onDidEndTask(async e => {
        if (e.execution.task.name === configureTask.name && buildTask) {
          try {
            await vscode.tasks.executeTask(buildTask);
          } finally {
            dispose();
          }
        }
      })
      return;
    }

    await vscode.tasks.executeTask(buildTask);
  }

  async configure() {
    const tasks = await vscode.tasks.fetchTasks({ type: 'latebit' });
    const configureTask = await this.getConfigureTask(tasks);
    await vscode.tasks.executeTask(configureTask);
  }

  private async isConfigured() {
    const defaultBuildFolder = DEFAULT_CONFIGURATION[TaskType.Configure].buildDirectory;
    const { buildDirectory = defaultBuildFolder } = getCMakeExtensionParameters();

    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
      vscode.window.showErrorMessage('No workspace folder open.');
      return;
    }

    return (await vscode.workspace.findFiles(`${buildDirectory}/CMakeCache.txt`)).length > 0;
  }

  private async getConfigureTask(tasks: vscode.Task[]) {
    const configureTasks = tasks.filter(task => task.definition.typ === TaskType.Configure);
    let configureTask = configureTasks[0];
    if (configureTasks.length > 1) {
      const picks = configureTasks.map(task => task.name);
      const pick = await vscode.window.showQuickPick(picks, { placeHolder: 'Select a configure task' });
      configureTask = configureTasks.find(task => task.name === pick)!;
    }
    return configureTask;
  }

  private async getBuildTask(tasks: vscode.Task[]) {
    const buildTasks = tasks.filter(task => task.definition.typ === TaskType.Build);
    let buildTask = buildTasks[0];
    if (buildTasks.length > 1) {
      const picks = buildTasks.map(task => task.name);
      const pick = await vscode.window.showQuickPick(picks, { placeHolder: 'Select a build task' });
      buildTask = buildTasks.find(task => task.name === pick)!;
    }
    return buildTask;
  }
}