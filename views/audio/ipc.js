const vscode = acquireVsCodeApi();

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
  vscode.postMessage({ type: `command:${command}`, payload });
  /** @type {(event: CustomMessageEvent<R>) => void} */
  const callback = (event) => {
    if (event.data.type === `command:${command}:response`) {
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