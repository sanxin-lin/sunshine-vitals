import {
  bindReporter,
  initMetric,
  onBFCacheRestore,
  getNavigationEntry,
  getActivationStart,
  whenReady,
} from '../utils';
import { MetricRatingThresholds, ReportOpts, TTFBReportCallback } from '../types';

export const TTFBThresholds: MetricRatingThresholds = [800, 1800];

export const onTTFB = (onReport: TTFBReportCallback, opts?: ReportOpts) => {
  // Set defaults
  opts = opts || {};

  let metric = initMetric('TTFB');
  let report = bindReporter(onReport, metric, TTFBThresholds, opts.reportAllChanges);

  whenReady(() => {
    const navEntry = getNavigationEntry();

    if (navEntry) {
      const responseStart = navEntry.responseStart;

      // In some cases no value is reported by the browser (for
      // privacy/security reasons), and in other cases (bugs) the value is
      // negative or is larger than the current page time. Ignore these cases:
      // https://github.com/GoogleChrome/web-vitals/issues/137
      // https://github.com/GoogleChrome/web-vitals/issues/162
      // https://github.com/GoogleChrome/web-vitals/issues/275
      if (responseStart <= 0 || responseStart > performance.now()) return;

      // The activationStart reference is used because TTFB should be
      // relative to page activation rather than navigation start if the
      // page was prerendered. But in cases where `activationStart` occurs
      // after the first byte is received, this time should be clamped at 0.
      metric.value = Math.max(responseStart - getActivationStart(), 0);

      metric.entries = [navEntry];
      report(true);

      // Only report TTFB after bfcache restores if a `navigation` entry
      // was reported for the initial load.
      onBFCacheRestore(() => {
        metric = initMetric('TTFB', 0);
        report = bindReporter(onReport, metric, TTFBThresholds, opts!.reportAllChanges);

        report(true);
      });
    }
  });
};
