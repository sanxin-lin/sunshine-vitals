export interface RunOnceCallback {
  (arg: unknown): void;
}

export const runOnce = (cb: RunOnceCallback) => {
  let called = false;
  return (arg: unknown) => {
    if (!called) {
      cb(arg);
      called = true;
    }
  };
};
