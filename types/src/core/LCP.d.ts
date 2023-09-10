import { MetricRatingThresholds, LCPReportCallback, ReportOpts } from '../types';
export declare const LCPThresholds: MetricRatingThresholds;
export declare const onLCP: (onReport: LCPReportCallback, opts?: ReportOpts) => void;
