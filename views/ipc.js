const vscode = acquireVsCodeApi();

/// THIS IS COPIED FROM THE TYPESCRIPT FILE `src/ipc.ts` AND NEEDS TO BE MANUALLY SYNCED
export const Command = {
  GetDocumentText: 'command:getDocumentText',
  UpdateDocumentText: 'command:updateDocumentText',
  Info: 'command:info',
  Error: 'command:error',
};

export const Event = {
  DocumentTextUpdated: 'event:documentTextUpdated',
};

export const response = (command) => `${command}:response`;

/**
 * @template T
 * @typedef {MessageEvent & { data: CommandResponse<T> }} CustomMessageEvent
 */

/**
 * @template T
 * @typedef {Object} CommandResponse
 * @property {string} type
 * @property {T} [payload]
 * @property {Error} [error]
 */

/**
 * @template P
 * @template R
 * @param {string} command 
 * @param {P} [payload] 
 * @param {(payload: R) => void} [onResponse] 
 * @param {(error: Error) => void} [onError] 
 */
export function executeHostCommand(command, payload = null, onResponse = null, onError = null) {
  vscode.postMessage({ type: command, payload });
  /** @type {(event: CustomMessageEvent<R>) => void} */
  const callback = (event) => {
    debugger
    if (event.data.type === response(command)) {
      window.removeEventListener('message', callback);
      if (event.data.error) {
        onError?.(event.data.error);
      } else {
        onResponse?.(event.data.payload);
      }
    }
  }

  window.addEventListener('message', callback);
}

/**
 * @template P
 * @param {string} event 
 * @param {(payload: P) => void} callback
 */
export function listen(event, callback) {
  window.addEventListener('message', (e) => {
    if (e.data.type === event) {
      callback(e.data.payload);
    }
  });
}