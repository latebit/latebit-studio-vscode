import * as vscode from 'vscode';
import { activate as activateSprite } from './sprites';

export function activate(context: vscode.ExtensionContext) {
	activateSprite(context);
}

export function deactivate() { }
