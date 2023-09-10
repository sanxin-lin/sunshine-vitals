import { MetricType, MetricRatingThresholds } from '../types/';
export declare const bindReporter: <MetricName extends "CLS" | "FCP" | "FID" | "INP" | "LCP" | "TTFB">(cb: (metric: Extract<import("../types/cls").CLSMetric, {
    name: MetricName;
}> | Extract<import("../types/fcp").FCPMetric, {
    name: MetricName;
}> | Extract<import("../types/fid").FIDMetric, {
    name: MetricName;
}> | Extract<import("../types/inp").INPMetric, {
    name: MetricName;
}> | Extract<import("../types/lcp").LCPMetric, {
    name: MetricName;
}> | Extract<import("../types/ttfb").TTFBMetric, {
    name: MetricName;
}>) => void, metric: Extract<import("../types/cls").CLSMetric, {
    name: MetricName;
}> | Extract<import("../types/fcp").FCPMetric, {
    name: MetricName;
}> | Extract<import("../types/fid").FIDMetric, {
    name: MetricName;
}> | Extract<import("../types/inp").INPMetric, {
    name: MetricName;
}> | Extract<import("../types/lcp").LCPMetric, {
    name: MetricName;
}> | Extract<import("../types/ttfb").TTFBMetric, {
    name: MetricName;
}>, thresholds: MetricRatingThresholds, reportAllChanges?: boolean) => (force?: boolean) => void;
