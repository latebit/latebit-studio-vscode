
export enum LatebitTaskType {
  Configure = 'configure',
  Build = 'build',
}

export enum LatebitCommandType {
  Debug = 'debug',
  Build = 'build',
  Configure = 'configure',
}

export const DEFAULT_CONFIGURATION = {
  [LatebitTaskType.Configure]: {
    buildDirectory: 'build',
    command: 'cmake',
    getFlags: (buildDirectory: string) => ['-B', buildDirectory, '-DCMAKE_EXPORT_COMPILE_COMMANDS=ON', '-DCMAKE_BUILD_TYPE=Debug'],
    environment: {},
    fallbackCMakeExtensionCommand: 'cmake.configure',
  },
  [LatebitTaskType.Build]: {
    buildDirectory: 'build',
    command: 'cmake',
    getFlags: (buildDirectory: string) => ['--build', buildDirectory],
    environment: {},
    fallbackCMakeExtensionCommand: 'cmake.build',
  }
}

