export function logDebug(...args) {
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.debug(...args);
  }
}
