import * as vscode from 'vscode';
import { LatebitCommandType, LatebitTaskType } from './utils';

export class LatebitConfigCommandProvider {
  static type = LatebitCommandType.Configure;

  static register(context: vscode.ExtensionContext): vscode.Disposable {
    const provider = new LatebitConfigCommandProvider(context);
    const disposable = vscode.commands.registerCommand(LatebitConfigCommandProvider.type, () => provider.launch());
    return disposable;
  }

  constructor(private readonly context: vscode.ExtensionContext) { }

  async launch() {
    const tasks = await vscode.tasks.fetchTasks({ type: 'latebit' });
    const configureTask = await this.getConfigureTask(tasks);
    await vscode.tasks.executeTask(configureTask);
  }

  private async getConfigureTask(tasks: vscode.Task[]) {
    const configureTasks = tasks.filter(task => task.definition.typ === LatebitTaskType.Configure);
    let configureTask = configureTasks[0];
    if (configureTasks.length > 1) {
      const picks = configureTasks.map(task => task.name);
      const pick = await vscode.window.showQuickPick(picks, { placeHolder: 'Select a configure task' });
      configureTask = configureTasks.find(task => task.name === pick)!;
    }
    return configureTask;
  }
}