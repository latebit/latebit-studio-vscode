import path from "node:path";
import * as vscode from 'vscode';

export const VIEWS_PATH = path.join(__dirname, '..', '..', 'views');

export const getUri = (webview: vscode.Webview, context: vscode.ExtensionContext, ...portions: string[]) => {
  return webview.asWebviewUri(vscode.Uri.file(path.join(context.extensionPath, ...portions))).toString();
};