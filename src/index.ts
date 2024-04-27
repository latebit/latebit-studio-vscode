import * as vscode from 'vscode';
import { activate as activateSprite } from './sprites';
import { LatebitTuneEditorProvider } from './audio';

export function activate(context: vscode.ExtensionContext) {
	activateSprite(context);
	context.subscriptions.push(LatebitTuneEditorProvider.register(context));
}

export function deactivate() { }
