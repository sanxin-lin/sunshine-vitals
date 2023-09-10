import type { FirstInputPolyfillEntry, Metric } from './base';
export interface FIDMetric extends Metric {
    name: 'FID';
    entries: (PerformanceEventTiming | FirstInputPolyfillEntry)[];
}
export interface FIDReportCallback {
    (metric: FIDMetric): void;
}
