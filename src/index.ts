import * as vscode from 'vscode';
import { SpriteEditorProvider } from './sprites';
import { TuneEditorProvider } from './audio';
import { BuildCommandsProvider, TaskProvider, DebugCommandProvider } from './launcher';

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(TuneEditorProvider.register(context, TuneEditorProvider.ViewType.Music));
	context.subscriptions.push(TuneEditorProvider.register(context, TuneEditorProvider.ViewType.Sound));
	context.subscriptions.push(SpriteEditorProvider.register(context));

	vscode.tasks.registerTaskProvider('latebit', new TaskProvider());
	context.subscriptions.push(DebugCommandProvider.register(context));
	context.subscriptions.push(...BuildCommandsProvider.register(context));
}

export function deactivate() { }
