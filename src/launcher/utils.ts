
export enum TaskType {
  Configure = 'configure',
  Build = 'build',
}

export enum CommandType {
  Debug = 'debug',
  Build = 'build',
  Configure = 'configure',
  Clean = 'clean',
  CleanBuild = 'clean-build'
}

export const DEFAULT_CONFIGURATION = {
  [TaskType.Configure]: {
    buildDirectory: 'build',
    command: 'cmake',
    getFlags: (buildDirectory: string) => ['-B', buildDirectory, '-DCMAKE_EXPORT_COMPILE_COMMANDS=ON', '-DCMAKE_BUILD_TYPE=Debug'],
    environment: {},
    fallbackCMakeExtensionCommand: 'cmake.configure',
  },
  [TaskType.Build]: {
    buildDirectory: 'build',
    command: 'cmake',
    getFlags: (buildDirectory: string) => ['--build', buildDirectory],
    environment: {},
    fallbackCMakeExtensionCommand: 'cmake.build',
  }
}

