import { Metric } from './base';

export interface INPMetric extends Metric {
  name: 'INP';
  entries: PerformanceEventTiming[];
}

export interface INPReportCallback {
  (metric: INPMetric): void;
}
