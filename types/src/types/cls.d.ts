import { LayoutShift, Metric } from './base';
export interface CLSMetric extends Metric {
    name: 'CLS';
    entries: LayoutShift[];
}
