import * as vscode from 'vscode';
import { activate as activateSprite } from './sprites';
import { LatebitTuneEditorProvider } from './audio';
import { LatebitBuildCommandProvider, LatebitTaskProvider, LatebitDebugCommandProvider } from './launcher';

export function activate(context: vscode.ExtensionContext) {
	activateSprite(context);
	context.subscriptions.push(LatebitTuneEditorProvider.register(context));

	vscode.tasks.registerTaskProvider('latebit', new LatebitTaskProvider());
	context.subscriptions.push(LatebitDebugCommandProvider.register(context));
	context.subscriptions.push(LatebitBuildCommandProvider.register(context));
}

export function deactivate() { }
