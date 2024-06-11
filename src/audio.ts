import fs from 'node:fs';
import path from 'node:path';
import * as vscode from 'vscode';
import { VIEWS_PATH, getUri } from './constants';
import { Command, Event, response } from './ipc';

const view = fs.readFileSync(path.join(VIEWS_PATH, 'audio', 'index.html'), { encoding: 'utf-8' });

export type ViewType = typeof TuneEditorProvider.ViewType[keyof typeof TuneEditorProvider.ViewType];

export class TuneEditorProvider implements vscode.CustomTextEditorProvider {
  static ViewType = {
    Music: 'latebit-studio.music' as const,
    Sound: 'latebit-studio.sound' as const,
  }

  static register(context: vscode.ExtensionContext, viewType: ViewType): vscode.Disposable {
    const provider = new TuneEditorProvider(context, viewType);
    return vscode.window.registerCustomEditorProvider(
      viewType,
      provider,
      {
        webviewOptions: {
          retainContextWhenHidden: true,
        },
      }
    );
  }

  constructor(private readonly context: vscode.ExtensionContext, private readonly viewType: ViewType) { }

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
      if (e.webviewPanel.active && e.webviewPanel.visible) {
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
    const player = getUri(webview, this.context, 'lib', 'player', 'build');
    const nodeModules = getUri(webview, this.context, 'node_modules');

    return view
      .replaceAll("{{ viewType }}", this.viewType)
      .replaceAll("{{ views }}", views)
      .replaceAll("{{ nodeModules }}", nodeModules)
      .replaceAll("{{ player }}", player);
  }
}