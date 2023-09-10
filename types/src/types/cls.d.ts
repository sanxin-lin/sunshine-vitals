import { ILayoutShift, Metric } from './base';
export interface CLSMetric extends Metric {
    name: 'CLS';
    entries: ILayoutShift[];
}
export interface CLSReportCallback {
    (metric: CLSMetric): void;
}
