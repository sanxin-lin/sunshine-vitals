import { LargestContentfulPaint, Metric } from './base';
export interface LCPMetric extends Metric {
    name: 'LCP';
    entries: LargestContentfulPaint[];
}
export interface LCPReportCallback {
    (metric: LCPMetric): void;
}
