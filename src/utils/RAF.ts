import { _window } from "./global";

export const doubleRAF = (cb: () => void) => {
  _window.requestAnimationFrame(() => _window.requestAnimationFrame(() => cb()));
};
