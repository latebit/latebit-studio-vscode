import * as vscode from 'vscode';
import { LatebitCommandType } from './utils';
import { getExecutableTargets } from './cmake';

export class LatebitDebugCommandProvider {
  static type = LatebitCommandType.Debug;

  static register(context: vscode.ExtensionContext): vscode.Disposable {
    const provider = new LatebitDebugCommandProvider(context);
    const disposable = vscode.commands.registerCommand(LatebitDebugCommandProvider.type, () => provider.launch());
    return disposable;
  }

  constructor(private readonly context: vscode.ExtensionContext) { }

  private startDefaultDebugger(program: string) {
    return vscode.debug.startDebugging(undefined, {
      name: "latebit debug (gdb)",
      type: "cppdbg",
      request: "launch",
      program,
      stopAtEntry: false,
      cwd: "${workspaceFolder}",
      externalConsole: false,
      MIMode: "gdb",
      setupCommands: [
        {
          description: "Enable pretty-printing for gdb",
          text: "-enable-pretty-printing",
          ignoreFailures: true
        }
      ]
    })
  }

  async launch() {
    const cppTools = vscode.extensions.getExtension('ms-vscode.cpptools');

    if (!cppTools) {
      vscode.window.showErrorMessage('C/C++ extension is not installed. Please install it and try again.');
      return;
    }

    if (!cppTools.isActive) {
      try {
        await cppTools.activate();
      } catch (error) {
        vscode.window.showErrorMessage('Failed to activate C/C++ extension. Please try again.');
        return;
      }
    }

    const executableTargets = await getExecutableTargets();

    if (executableTargets.length > 0) {
      const picks = executableTargets
        .map(([name, path]) => ({ label: name, description: name, detail: path }));

      const execturablePick = await vscode.window.showQuickPick(picks, {
        placeHolder: 'Select an executable to debug',
        title: 'Select an executable to debug'
      })
      if (!execturablePick) return;

      return this.startDefaultDebugger(execturablePick.detail);
    }

    const files = await vscode.window.showOpenDialog({
      canSelectFiles: true,
      canSelectFolders: false,
      canSelectMany: false,
      defaultUri: vscode.workspace.workspaceFolders?.[0].uri,
      openLabel: 'Select executable to debug',
      title: 'Select executable to debug'
    });

    if (!files || files.length === 0) return;

    return this.startDefaultDebugger(files[0].fsPath);
  }
}