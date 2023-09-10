import { onBFCacheRestore } from './bfcache.js';
import { _document, _window } from './global.js';

let firstHiddenTime = -1;

const initHiddenTime = () => {
  return _document.visibilityState === 'hidden' ? 0 : Infinity;
};

const onVisibilityUpdate = (e: Event) => {
  if (_document.visibilityState === 'hidden' && firstHiddenTime > -1) {
    firstHiddenTime = e.type === 'visibilitychange' ? e.timeStamp : 0;

    removeChangeListeners();
  }
};

const addChangeListeners = () => {
  _window.addEventListener('visibilitychange', onVisibilityUpdate, true);
  _window.addEventListener('prerenderingchange', onVisibilityUpdate, true);
};

const removeChangeListeners = () => {
  _window.removeEventListener('visibilitychange', onVisibilityUpdate, true);
  _window.addEventListener('prerenderingchange', onVisibilityUpdate, true);
};

export const getVisibilityWatcher = () => {
  if (firstHiddenTime < 0) {
    // TODO
    // if (_window.__sunshine_polyfill__) {
    //   firstHiddenTime = window.sunshine.firstHiddenTime;
    //   if (firstHiddenTime === Infinity) {
    //     addChangeListeners();
    //   }
    // } else {
    //   firstHiddenTime = initHiddenTime();
    //   addChangeListeners();
    // }
    firstHiddenTime = initHiddenTime();
    addChangeListeners();
  }

  onBFCacheRestore(() => {
    setTimeout(() => {
      firstHiddenTime = initHiddenTime();
      addChangeListeners();
    }, 0);
  });

  return {
    get firstHiddenTime() {
      return firstHiddenTime;
    },
  };
};
