
export enum LatebitTaskType {
  Configuration = 'latebit.configuration',
  Build = 'latebit.build'
}

export const DEFAULT_CONFIGURATION = {
  [LatebitTaskType.Configuration]: {
    buildDirectory: '${workspaceRoot}/build',
    command: 'cmake',
    getFlags: (buildDirectory: string) => ['-B', buildDirectory],
    environment: {},
    fallbackCMakeExtensionCommand: 'cmake.configure',
  },
  [LatebitTaskType.Build]: {
    buildDirectory: '${workspaceRoot}/build',
    command: 'cmake',
    getFlags: (buildDirectory: string) => ['--build', buildDirectory],
    environment: {},
    fallbackCMakeExtensionCommand: 'cmake.build',
  }
}

