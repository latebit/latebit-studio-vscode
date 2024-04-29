const vscode = acquireVsCodeApi();

export function executeHostCommand(command, payload = null, onResponse = null, onError = null) {
  vscode.postMessage({ type: `command:${command}`, payload });
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