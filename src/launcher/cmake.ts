import * as vscode from 'vscode';
import { TaskDefinition } from './types';
import { DEFAULT_CONFIGURATION } from './utils';

export function getCMakeExtensionParameters() {
  const extension = vscode.extensions.getExtension('ms-vscode.cmake-tools');
  const version = extension?.packageJSON.version;
  const config = vscode.workspace.getConfiguration('cmake', null);

  const buildDirectory = config.get<string>('buildDirectory');
  const cmakePath = config.get<string>('cmakePath');
  const isActive = extension?.isActive;

  return { version, isActive, cmakePath, buildDirectory };
}

// Returns a CustomExecution or ShellExecution based on the existing configuration of the CMake Extension.
// If no CMake Extension is found, a ShellExecution using a local cmake is returned.
export function makeExecution(definition: TaskDefinition): vscode.CustomExecution | vscode.ShellExecution {
  const type = definition.kind;
  const defaults = DEFAULT_CONFIGURATION[type];
  const {
    buildDirectory = defaults.buildDirectory,
    cmakePath = defaults.command,
    version: CMakeExtensionVersion,
    isActive: CMakeExtension
  } = getCMakeExtensionParameters();

  const command = definition.command || cmakePath;
  const flagList = definition.flags && definition.flags.length > 0
    ? definition.flags
    : defaults.getFlags(buildDirectory);
  const flags = flagList.join(' ');
  const env = definition.environment ?? defaults.environment;

  // Use CMake Extension only if it is active and no command is provided
  const useCMakeExtension = !definition.command && CMakeExtension;
  if (useCMakeExtension) {
    console.log(`Using ms-vscode.cmake-tools@${CMakeExtensionVersion} Extension.`);
  }

  const writeEmitter = new vscode.EventEmitter<string>();
  const closeEmitter = new vscode.EventEmitter<number>();

  return useCMakeExtension
    ? new vscode.CustomExecution(async () => ({
      onDidWrite: writeEmitter.event,
      onDidClose: closeEmitter.event,
      open: async () => {
        const tasks = await vscode.tasks.fetchTasks({ type: 'cmake' });
        const buildTask = tasks.find(task => task.definition.command === defaults.fallbackCMakeExtensionCommand);

        if (!buildTask) {
          throw new Error('No build task found.');
        }

        await vscode.tasks.executeTask(buildTask);
        const { dispose } = vscode.tasks.onDidEndTaskProcess(e => {
          if (e.execution.task.name === buildTask.name) {
            closeEmitter.fire(e.exitCode ?? 1);
            dispose();
          }
        })
      },
      close: () => { }
    }))
    : new vscode.ShellExecution(`${command} ${flags}`, { env });
}

type CMakeTarget = { targetType: 'EXECUTABLE' | string, name: string, filepath: string };

export async function getExecutableTargets(): Promise<[name: string, path: string][]> {
  const cmakeTools = vscode.extensions.getExtension('ms-vscode.cmake-tools');
  if (!cmakeTools) {
    return [];
  }

  if (!cmakeTools.isActive) {
    try {
      await cmakeTools.activate();
    } catch (error) {
      vscode.window.showErrorMessage('Failed to activate CMake Tools extension. Please try again.');
      return [];
    }
  }

  const api = cmakeTools.exports.getApi();
  const rootFolderUri = vscode.Uri.file(api.getActiveFolderPath());
  const { project } = await api.getProject(rootFolderUri);
  if (!project) {
    vscode.window.showErrorMessage('No CMake project found. Please configure a project.');
    return [];
  }

  const targets = await project.targets;
  return targets
    .filter((target: CMakeTarget) => target.targetType === 'EXECUTABLE')
    .map((t: CMakeTarget) => [t.name, t.filepath]);
}