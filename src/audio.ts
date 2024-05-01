import fs from 'node:fs';
import path from 'node:path';
import * as vscode from 'vscode';
import { VIEWS_PATH, getUri } from './constants';

const view = fs.readFileSync(path.join(VIEWS_PATH, 'audio', 'index.html'), { encoding: 'utf-8' });

export class LatebitTuneEditorProvider implements vscode.CustomTextEditorProvider {
  static VIEW_TYPE = 'latebit-studio.tune';

  static register(context: vscode.ExtensionContext): vscode.Disposable {
    const provider = new LatebitTuneEditorProvider(context);
    return vscode.window.registerCustomEditorProvider(
      LatebitTuneEditorProvider.VIEW_TYPE,
      provider,
      {
        webviewOptions: {
          retainContextWhenHidden: true,
        },
      }
    );
  }

  constructor(private readonly context: vscode.ExtensionContext) { }

  async resolveCustomTextEditor(
    document: vscode.TextDocument,
    webviewPanel: vscode.WebviewPanel,
    token: vscode.CancellationToken): Promise<void> {
    webviewPanel.webview.options = { enableScripts: true };
    webviewPanel.webview.html = this.getHTML(webviewPanel.webview);

    webviewPanel.webview.onDidReceiveMessage((e) => {
      switch (e.type) {
        case 'log': return console.log(...e.args);
        case 'error': return console.error(...e.args);
        case 'command:getDocumentText':
          return webviewPanel.webview.postMessage({ type: 'command:getDocumentText:response', payload: document.getText() });
        case 'command:updateDocumentText':
          const edit = new vscode.WorkspaceEdit();
          edit.replace(document.uri, new vscode.Range(0, 0, document.lineCount, 0), e.payload);
          return vscode.workspace.applyEdit(edit);
        case 'command:info':
          return vscode.window.showInformationMessage(e.payload);
        case 'command:error':
          return vscode.window.showErrorMessage(e.payload);
      }
    });
  }

  /// Private

  private getHTML(webview: vscode.Webview) {
    const views = getUri(webview, this.context, 'views');
    const player = getUri(webview, this.context, 'player', 'build');
    const nodeModules = getUri(webview, this.context, 'node_modules');

    return view
      .replaceAll("{{ views }}", views)
      .replaceAll("{{ nodeModules }}", nodeModules)
      .replaceAll("{{ player }}", player);
  }
}