import * as vscode from 'vscode';
import { init } from './sprites';

export function activate(context: vscode.ExtensionContext) {
	const sprite = init();

	context.subscriptions.push(sprite);
}

export function deactivate() { }
