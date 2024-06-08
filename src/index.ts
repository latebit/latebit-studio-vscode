import * as vscode from 'vscode';
import { activate as activateSprite } from './sprites';
import { TuneEditorProvider } from './audio';
import { BuildCommandsProvider, TaskProvider, DebugCommandProvider } from './launcher';

export function activate(context: vscode.ExtensionContext) {
	activateSprite(context);
	context.subscriptions.push(TuneEditorProvider.register(context, TuneEditorProvider.ViewType.Music));
	context.subscriptions.push(TuneEditorProvider.register(context, TuneEditorProvider.ViewType.Sound));

	vscode.tasks.registerTaskProvider('latebit', new TaskProvider());
	context.subscriptions.push(DebugCommandProvider.register(context));
	context.subscriptions.push(...BuildCommandsProvider.register(context));
}

export function deactivate() { }
