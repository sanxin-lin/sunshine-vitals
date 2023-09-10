import { Metric, NavigationTimingPolyfillEntry } from "./base";

export interface TTFBMetric extends Metric {
  name: 'TTFB';
  entries: PerformanceNavigationTiming[] | NavigationTimingPolyfillEntry[];
}