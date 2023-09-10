import type { Metric } from './base';

export interface FCPMetric extends Metric {
  name: 'FCP';
  entries: PerformancePaintTiming[];
}


export interface FCPReportCallback {
  (metric: FCPMetric): void;
}