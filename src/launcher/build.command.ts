import * as vscode from 'vscode';
import { LatebitCommandType, LatebitTaskType } from './utils';

export class LatebitBuildCommandProvider {
  static type = LatebitCommandType.Build;

  static register(context: vscode.ExtensionContext): vscode.Disposable {
    const provider = new LatebitBuildCommandProvider(context);
    const disposable = vscode.commands.registerCommand(LatebitBuildCommandProvider.type, () => provider.launch());
    return disposable;
  }

  constructor(private readonly context: vscode.ExtensionContext) { }

  async launch() {
    const tasks = await vscode.tasks.fetchTasks({ type: 'latebit' });

    const configureTasks = tasks.filter(task => task.definition.typ === LatebitTaskType.Configure);
    let configureTask = configureTasks[0];
    if (configureTasks.length > 1) {
      const picks = configureTasks.map(task => task.name);
      const pick = await vscode.window.showQuickPick(picks, { placeHolder: 'Select a configure task' });
      configureTask = configureTasks.find(task => task.name === pick)!;
    }

    const buildTasks = tasks.filter(task => task.definition.typ === LatebitTaskType.Build);
    let buildTask = buildTasks[0];
    if (buildTasks.length > 1) {
      const picks = buildTasks.map(task => task.name);
      const pick = await vscode.window.showQuickPick(picks, { placeHolder: 'Select a build task' });
      buildTask = buildTasks.find(task => task.name === pick)!;
    }

    if (configureTask) {
      await vscode.tasks.executeTask(configureTask);
    }

    if (buildTask) {
      await vscode.tasks.executeTask(buildTask);
    }
  }
}