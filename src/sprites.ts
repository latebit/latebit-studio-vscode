import fs from 'node:fs';
import path from 'node:path';
import * as vscode from 'vscode';
import { VIEWS_PATH, getUri } from './constants';
import { Command, Event, response } from './ipc';

const view = fs.readFileSync(path.join(VIEWS_PATH, 'sprites', 'index.html'), { encoding: 'utf-8' });

export class SpriteEditorProvider implements vscode.CustomTextEditorProvider {
  static viewType = 'latebit-studio.sprite' as const

  static register(context: vscode.ExtensionContext): vscode.Disposable {
    const provider = new SpriteEditorProvider(context);
    return vscode.window.registerCustomEditorProvider(
      SpriteEditorProvider.viewType,
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
        case Command.GetDocumentText:
          return webviewPanel.webview.postMessage({
            type: response(Command.GetDocumentText), payload: document.getText()
          });
        case Command.UpdateDocumentText:
          if (document.getText() === e.payload) { return; }

          const edit = new vscode.WorkspaceEdit();
          edit.replace(document.uri, new vscode.Range(0, 0, document.lineCount, 0), e.payload);
          return vscode.workspace.applyEdit(edit);
        case Command.Info:
          return vscode.window.showInformationMessage(e.payload);
        case Command.Error:
          return vscode.window.showErrorMessage(e.payload);
      }
    });

    webviewPanel.onDidChangeViewState((e) => {
      // Reload the document when the view becomes active, to allow external
      // changes to be reflected in the view
      if (e.webviewPanel.visible) {
        webviewPanel.webview.postMessage({
          type: Event.DocumentTextUpdated,
          payload: document.getText()
        });
      }
    })

    vscode.workspace.onDidChangeTextDocument((e) => {
      if (e.reason == null) { return; }

      const isUndoRedo = [vscode.TextDocumentChangeReason.Redo, vscode.TextDocumentChangeReason.Undo].includes(e.reason);
      if (e.document === document && isUndoRedo) {
        webviewPanel.webview.postMessage({
          type: Event.DocumentTextUpdated,
          payload: document.getText()
        });
      }
    });
  }

  private getHTML(webview: vscode.Webview) {
    const views = getUri(webview, this.context, 'views');
    const renderer = getUri(webview, this.context, 'lib', 'renderer', 'build');
    const nodeModules = getUri(webview, this.context, 'node_modules');

    return view
      .replaceAll("{{ viewType }}", SpriteEditorProvider.viewType)
      .replaceAll("{{ views }}", views)
      .replaceAll("{{ nodeModules }}", nodeModules)
      .replaceAll("{{ renderer }}", renderer);
  }
}