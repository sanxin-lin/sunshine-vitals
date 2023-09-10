import { _document } from "./global";

export const whenActivated = (cb: () => void) => {
  if (_document.prerendering) {
    addEventListener('prerenderingchange', () => cb(), true);
  } else {
    cb();
  }
};