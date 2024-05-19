export enum TaskKind {
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
  [TaskKind.Configure]: {
    buildDirectory: 'build',
    command: 'cmake',
    getFlags: (buildDirectory: string) => ['-B', buildDirectory, '-DCMAKE_EXPORT_COMPILE_COMMANDS=ON', '-DCMAKE_BUILD_TYPE=Debug'],
    environment: {},
    fallbackCMakeExtensionCommand: 'cmake.configure',
  },
  [TaskKind.Build]: {
    buildDirectory: 'build',
    command: 'cmake',
    getFlags: (buildDirectory: string) => ['--build', buildDirectory],
    environment: {},
    fallbackCMakeExtensionCommand: 'cmake.build',
  }
}

