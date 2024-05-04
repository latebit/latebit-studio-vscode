import * as vscode from 'vscode';
import { LatebitTaskDefinition } from './types';
import { DEFAULT_CONFIGURATION } from './utils';

function getCMakeExtensionParameters() {
  const extension = vscode.extensions.getExtension('twxs.cmake');
  const version = extension?.packageJSON.version;
  const config = vscode.workspace.getConfiguration('cmake');

  const buildDirectory = config.get<string>('buildDirectory');
  const cmakePath = config.get<string>('cmakePath');
  const isActive = extension?.isActive;

  return { version, isActive, cmakePath, buildDirectory };
}

// Returns a CustomExecution or ShellExecution based on the existing configuration of the CMake Extension.
// If no CMake Extension is found, a ShellExecution using a local cmake is returned.
export function makeExecution(definition: LatebitTaskDefinition): vscode.CustomExecution | vscode.ShellExecution {
  const type = definition.typ;
  const defaults = DEFAULT_CONFIGURATION[type];
  const {
    buildDirectory = defaults.buildDirectory,
    cmakePath = defaults.command,
    version: CMakeExtensionVersion,
    isActive: CMakeExtension
  } = getCMakeExtensionParameters();

  const command = definition.command || cmakePath;
  const flags = (definition.flags ?? defaults.getFlags(buildDirectory)).join(' ');
  const env = definition.environment ?? defaults.environment;

  // Use CMake Extension only if it is active and no command is provided
  const useCMakeExtension = !definition.command && CMakeExtension;
  if (useCMakeExtension) {
    console.log(`Using twxs.cmake@${CMakeExtensionVersion} Extension.`);
  }

  const writeEmitter = new vscode.EventEmitter<string>();
  const closeEmitter = new vscode.EventEmitter<void>();

  return useCMakeExtension
    ? new vscode.CustomExecution(async () => ({
      onDidWrite: writeEmitter.event,
      onDidClose: closeEmitter.event,
      open: async () => {
        await vscode.commands.executeCommand(defaults.fallbackCMakeExtensionCommand);
        return closeEmitter.fire();
      },
      close: () => { }
    }))
    : new vscode.ShellExecution(`${command} ${flags}`, { env });
}
