export const delayPromise = function(delay: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(delay, resolve);
  });
};