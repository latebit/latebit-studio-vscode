import * as vscode from 'vscode';
import { DEFAULT_CONFIGURATION, CommandType, TaskKind } from './utils';
import { getCMakeExtensionParameters } from './cmake';
import { existsSync } from 'node:fs';

export class BuildCommandsProvider {
  static register(context: vscode.ExtensionContext): vscode.Disposable[] {
    const provider = new BuildCommandsProvider(context);
    return [
      vscode.commands.registerCommand(CommandType.Build, () => provider.build()),
      vscode.commands.registerCommand(CommandType.Configure, () => provider.configure()),
      vscode.commands.registerCommand(CommandType.Clean, () => provider.clean()),
      vscode.commands.registerCommand(CommandType.CleanBuild, async () => {
        await provider.clean();
        await provider.build();
      })
    ]
  }

  constructor(private readonly context: vscode.ExtensionContext) { }

  async build() {
    const tasks = await vscode.tasks.fetchTasks({ type: 'latebit' });
    const buildTask = await this.getBuildTask(tasks);
    const isConfigured = await this.isConfigured();

    // This is needed when the user is not using CMake extension.
    // CMake extension does this check autonomously and acts accordingly.
    // Doing this additional check should not change anything: if the build
    // folder is already configured this noops.
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

  async clean() {
    const defaultBuildDirectory = DEFAULT_CONFIGURATION[TaskKind.Configure].buildDirectory;
    const { buildDirectory = defaultBuildDirectory } = getCMakeExtensionParameters();
    const cleanBuildDirectory = buildDirectory.replace('${workspaceFolder}', '');

    const buildDirectoryUri = vscode.Uri.joinPath(this.getWorkspaceFolder().uri, cleanBuildDirectory);
    return await vscode.workspace.fs.delete(buildDirectoryUri, { recursive: true })
  }

  private async isConfigured() {
    const defaultBuildDirectory = DEFAULT_CONFIGURATION[TaskKind.Configure].buildDirectory;
    const { buildDirectory = defaultBuildDirectory } = getCMakeExtensionParameters();
    const cleanBuildDirectory = buildDirectory.replace('${workspaceFolder}', '');

    const cacheUri = vscode.Uri.joinPath(this.getWorkspaceFolder().uri, cleanBuildDirectory, 'CMakeCache.txt');

    return existsSync(cacheUri.fsPath);
  }

  private async getConfigureTask(tasks: vscode.Task[]) {
    const configureTasks = tasks.filter(task => task.definition.kind === TaskKind.Configure);
    let configureTask = configureTasks[0];
    if (configureTasks.length > 1) {
      const picks = configureTasks.map(task => task.name);
      const pick = await vscode.window.showQuickPick(picks, { placeHolder: 'Select a configure task' });
      configureTask = configureTasks.find(task => task.name === pick)!;
    }

    if (!configureTask) {
      throw new Error('Unable to find "configure" task. Check your .vscode/tasks.json, and a task with `kind: configure`.')
    }

    return configureTask;
  }

  private async getBuildTask(tasks: vscode.Task[]) {
    const buildTasks = tasks.filter(task => task.definition.kind === TaskKind.Build);
    let buildTask = buildTasks[0];
    if (buildTasks.length > 1) {
      const picks = buildTasks.map(task => task.name);
      const pick = await vscode.window.showQuickPick(picks, { placeHolder: 'Select a build task' });
      buildTask = buildTasks.find(task => task.name === pick)!;
    }

    if (!buildTask) {
      throw new Error('Unable to find "build" task. Check your .vscode/tasks.json, and a task with `kind: build`.')
    }

    return buildTask;
  }

  // FIXME: this encodes the assumption there is only one workspace
  private getWorkspaceFolder(): vscode.WorkspaceFolder {
    const workspaceFolders = vscode.workspace.workspaceFolders;

    if (!workspaceFolders) {
      throw new Error('No workspace folder open. Open a folder and try again.');
    }

    return workspaceFolders[0];
  }
}