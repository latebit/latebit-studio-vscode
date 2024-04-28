const vscode = acquireVsCodeApi();

export function executeHostCommand(command, payload = null, onResponse = null) {
  vscode.postMessage({ type: `command:${command}`, payload });
  const callback = (event) => {
    if (event.data.type === `command:${command}:response`) {
      window.removeEventListener('message', callback);
      onResponse?.(event.data.payload);
    }
  }
  window.addEventListener('message', callback);
}