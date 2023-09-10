import { _window } from "./global";

interface onBFCacheRestoreCallback {
  (event: PageTransitionEvent): void;
}

let bfcacheRestoreTime = -1;

export const getBFCacheRestoreTime = () => bfcacheRestoreTime;

export const onBFCacheRestore = (cb: onBFCacheRestoreCallback) => {
  _window.addEventListener(
    'pageshow',
    (event) => {
      if (event.persisted) {
        bfcacheRestoreTime = event.timeStamp;
        cb(event);
      }
    },
    true
  );
};
