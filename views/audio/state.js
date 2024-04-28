const listeners = {}

const store = {
  tune: null,
}

export const state = {
  setTune(tune) {
    store.tune = tune;
    listeners.tune?.forEach(callback => callback(tune));
  },
  getTune() {
    return store.tune;
  },
  listen(property, callback) {
    listeners[property] = listeners[property] ?? [];
    listeners[property].push(callback);
  }
}