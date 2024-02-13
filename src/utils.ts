export const debounce = <T>(
  func: (...args: T[]) => void,
  sleep: number
): ((...args: T[]) => void) => {
  let timeoutId: NodeJS.Timeout | null = null;

  return (...args: T[]) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(func, sleep, ...args);
  };
};