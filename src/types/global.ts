
export interface PerformanceEntryMap {
  navigation: PerformanceNavigationTiming;
  resource: PerformanceResourceTiming;
  paint: PerformancePaintTiming;
}

export interface GlobalPerformance extends Performance {
  getEntriesByType<K extends keyof PerformanceEntryMap>(type: K): PerformanceEntryMap[K][];
}

export interface Global extends Window {
  performance: GlobalPerformance;
  __sunshine_polyfill__: boolean;
}

export interface GlobalDocument extends Document {
  prerendering?: boolean;
  wasDiscarded?: boolean;
}
