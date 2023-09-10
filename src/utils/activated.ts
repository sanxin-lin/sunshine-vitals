import { _document, _window } from './global';

export const whenActivated = (cb: () => void) => {
  if (_document.prerendering) {
    addEventListener('prerenderingchange', () => cb(), true);
  } else {
    cb();
  }
};

export const whenReady = (callback: () => void) => {
  if (_document.prerendering) {
    whenActivated(() => whenReady(callback));
  } else if (document.readyState !== 'complete') {
    _window.addEventListener('load', () => whenReady(callback), true);
  } else {
    // Queue a task so the callback runs after `loadEventEnd`.
    setTimeout(callback, 0);
  }
};
