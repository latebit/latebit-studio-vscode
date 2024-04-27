import fs from 'node:fs';
import path from 'node:path';
import * as vscode from 'vscode';
import { VIEWS_PATH } from './constants';

const view = fs.readFileSync(path.join(VIEWS_PATH, 'audio.html'), { encoding: 'utf-8' });

export class LatebitTuneEditorProvider implements vscode.CustomTextEditorProvider {
  static VIEW_TYPE = 'latebit-studio.tune';

  static register(context: vscode.ExtensionContext): vscode.Disposable {
    const provider = new LatebitTuneEditorProvider(context);
    return vscode.window.registerCustomEditorProvider(
      LatebitTuneEditorProvider.VIEW_TYPE,
      provider
    );
  }

  constructor(private readonly context: vscode.ExtensionContext) { }

  async resolveCustomTextEditor(
    document: vscode.TextDocument,
    webviewPanel: vscode.WebviewPanel,
    token: vscode.CancellationToken): Promise<void> {
    webviewPanel.webview.options = { enableScripts: true };
    webviewPanel.webview.html = this.getHTML(webviewPanel.webview);

    webviewPanel.webview.onDidReceiveMessage(e => {
      switch (e.type) {
        case 'log': return console.log(...e.args);
        case 'error': return console.error(...e.args);
        case 'command:getDocumentText':
          webviewPanel.webview.postMessage({ type: 'command:getDocumentText:response', payload: document.getText() });
        case 'command:info':
          vscode.window.showInformationMessage(e.payload);
          return;
      }
    });
  }

  /// Private

  private getHTML(webview: vscode.Webview) {
    const url = webview.asWebviewUri(vscode.Uri.file(path.join(this.context.extensionPath, 'player/build/player.js')));
    const root = webview.asWebviewUri(vscode.Uri.file(path.join(this.context.extensionPath, 'player/build/')));
    return view.replaceAll("{{ player }}", url.toString()).replaceAll("{{ root }}", root.toString());
  }
}
