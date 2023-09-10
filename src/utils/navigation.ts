import { IPerformanceNavigationTiming, NavigationTimingPolyfillEntry } from 'src/types';
import { _performance, _window } from './global';

const getNavigationEntryFromPerformanceTiming = (): NavigationTimingPolyfillEntry => {
  const timing = performance.timing;
  const type = performance.navigation.type;

  const navigationEntry: { [key: string]: number | string } = {
    entryType: 'navigation',
    startTime: 0,
    type: type == 2 ? 'back_forward' : type === 1 ? 'reload' : 'navigate',
  };

  for (const key in timing) {
    if (key !== 'navigationStart' && key !== 'toJSON') {
      navigationEntry[key] = Math.max(
        (timing[key as keyof PerformanceTiming] as number) - timing.navigationStart,
        0,
      );
    }
  }
  return navigationEntry as unknown as NavigationTimingPolyfillEntry;
};

export const getNavigationEntry = ():
  | IPerformanceNavigationTiming
  | NavigationTimingPolyfillEntry
  | undefined => {
  const navigationEntries = _performance?.getEntriesByType?.('navigation')?.[0];
  if (!navigationEntries) return;
  if (_window.__sunshine_polyfill__) {
    return getNavigationEntryFromPerformanceTiming();
  }
  return navigationEntries;
};

export const getActivationStart = () => {
  const entry = getNavigationEntry();
  return entry?.activationStart ?? 0;
};
