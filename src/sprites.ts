import fs from 'node:fs';
import path from 'node:path';

import * as vscode from 'vscode';

import { debounce } from './utils';
import { VIEWS_PATH } from './constants';

const view = fs.readFileSync(path.join(VIEWS_PATH, 'sprites', 'index.html'), { encoding: 'utf-8' });

export interface SpriteContext {
  frames: number;
  height: number;
  width: number;
  sleep: number;
  lines: string[];
}

// Reads the content of the sprite file and returns an object
// with the sprite context
function makeSpriteContext(spriteFileContent: string): SpriteContext {
  if (spriteFileContent.length === 0) {
    return { frames: 0, height: 0, width: 0, sleep: 0, lines: [] };
  }

  const lines = spriteFileContent.split('\n');
  const frames = parseInt(lines[0]);
  const height = parseInt(lines[1]);
  const width = parseInt(lines[2]);
  const sleep = parseInt(lines[3]);

  return {
    frames,
    height,
    width,
    sleep,
    lines: lines.slice(4),
  };
}

function getSpritePanel() {
  const panel = vscode.window.createWebviewPanel(
    'spritePreview',
    'Sprite Preview',
    vscode.ViewColumn.Beside,
    { enableScripts: true }
  );

  panel.webview.onDidReceiveMessage(e => {
    if (e.type == 'log') { console.log(...e.payload); }
  });

  panel.webview.html = view;

  return panel;
}

export function activate(context: vscode.ExtensionContext) {
  let panel: vscode.WebviewPanel | undefined;

  context.subscriptions.push(vscode.commands.registerCommand('latebit-studio.sprite', () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) { return; }

    const doc = editor.document;
    const text = doc.getText();
    panel = getSpritePanel();

    panel.webview.postMessage({ type: 'refresh', payload: makeSpriteContext(text) });
  }));

  context.subscriptions.push(vscode.workspace.onDidChangeTextDocument(debounce((e: vscode.TextDocumentChangeEvent) => {
    if (e.document.uri === vscode.window.activeTextEditor?.document.uri) {
      panel?.webview.postMessage({
        type: 'refresh',
        payload: makeSpriteContext(e.document.getText())
      });
    }
  }, 500)));

  context.subscriptions.push(vscode.workspace.onDidOpenTextDocument(document => {
    if (document.languageId === 'latebit') {
      if (!panel) {
        console.log('making new panel');
        panel = getSpritePanel();
      }

      panel.webview.postMessage({
        type: 'refresh',
        payload: makeSpriteContext(document.getText())
      });
    }
  }));
}