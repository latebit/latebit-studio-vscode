import * as vscode from 'vscode';
import { activate as activateSprite } from './sprites';
import { LatebitTuneEditorProvider } from './audio';
import { LatebitBuildTaskProvider, LatebitConfigurationTaskProvider } from './launcher';

export function activate(context: vscode.ExtensionContext) {
	activateSprite(context);
	context.subscriptions.push(LatebitTuneEditorProvider.register(context));

	const configurationTaskProvider = new LatebitConfigurationTaskProvider(context);
	vscode.tasks.registerTaskProvider('latebit', configurationTaskProvider);

	const buildTaskProvider = new LatebitBuildTaskProvider(context);
	vscode.tasks.registerTaskProvider('latebit', buildTaskProvider);
}

export function deactivate() { }
