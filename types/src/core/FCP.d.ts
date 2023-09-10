import type { FCPReportCallback, MetricRatingThresholds, ReportOpts } from '../types';
export declare const FCPThresholds: MetricRatingThresholds;
export declare const onFCP: (onReport: FCPReportCallback, opts?: ReportOpts) => void;
