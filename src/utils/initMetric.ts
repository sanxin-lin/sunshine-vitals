import { _document } from './global';
import {getBFCacheRestoreTime} from './bfcache';
import type { MetricType } from '../types';
import { getActivationStart, getNavigationEntry } from './navigation';
import { generateUniqueID } from './uniqueID';

export const initMetric = <MetricName extends MetricType['name']>(
  name: MetricName,
  value?: number,
) => {
  const navEntry = getNavigationEntry();
  let navigationType: MetricType['navigationType'] = 'navigate';

  if (getBFCacheRestoreTime() >= 0) {
    navigationType = 'back-forward-cache';
  } else if (navEntry) {
    if (_document.prerendering || getActivationStart() > 0) {
      navigationType = 'prerender';
    } else if (_document.wasDiscarded) {
      navigationType = 'restore';
    } else if (navEntry.type) {
      navigationType = navEntry.type.replace(/_/g, '-') as MetricType['navigationType'];
    }
  }

  // Use `entries` type specific for the metric.
  const entries: Extract<MetricType, { name: MetricName }>['entries'] = [];

  return {
    name,
    value: typeof value === 'undefined' ? -1 : value,
    rating: 'good' as const, // If needed, will be updated when reported. `const` to keep the type from widening to `string`.
    delta: 0,
    entries,
    id: generateUniqueID(),
    navigationType,
  };
};
