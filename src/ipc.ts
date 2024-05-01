/// NEEDS SYNCING WITH FILE `views/ipc.js` ON EVERY CHANGE
export const Command = {
  GetDocumentText: 'command:getDocumentText',
  UpdateDocumentText: 'command:updateDocumentText',
  Info: 'command:info',
  Error: 'command:error',
} as const;

export type Command = typeof Command[keyof typeof Command];

export const Event = {
  DocumentTextUpdated: 'event:documentTextUpdated',
} as const;

export type Event = typeof Event[keyof typeof Event];

export const response = (command: Command) => `${command}:response`