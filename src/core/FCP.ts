import {
  onBFCacheRestore,
  bindReporter,
  doubleRAF,
  getActivationStart,
  getVisibilityWatcher,
  initMetric,
  whenActivated,
  observe,
} from '../utils';

import type { FCPMetric, FCPReportCallback, MetricRatingThresholds, ReportOpts } from '../types';

export const FCPThresholds: MetricRatingThresholds = [1800, 3000];

export const onFCP = (onReport: FCPReportCallback, opts: ReportOpts = {}) => {
  whenActivated(() => {
    const visibilityWatcher = getVisibilityWatcher();
    let metric = initMetric('FCP');
    let report: ReturnType<typeof bindReporter>;

    const handleEntries = (entries: FCPMetric['entries']) => {
      entries.forEach(entry => {
        if (entry.name === 'first-contentful-paint') {
          po!.disconnect();
          if (entry.startTime < visibilityWatcher.firstHiddenTime) {
            // if (entry.startTime) {
            metric.value = Math.max(entry.startTime - getActivationStart(), 0);
            metric.entries.push(entry);
            report(true);
          }
        }
      });
    };

    const po = observe('paint', handleEntries);

    if (po) {
      report = bindReporter(onReport, metric, FCPThresholds, opts!.reportAllChanges);

      // Only report after a bfcache restore if the `PerformanceObserver`
      // successfully registered or the `paint` entry exists.
      onBFCacheRestore(event => {
        metric = initMetric('FCP');
        report = bindReporter(onReport, metric, FCPThresholds, opts!.reportAllChanges);

        doubleRAF(() => {
          metric.value = performance.now() - event.timeStamp;
          report(true);
        });
      });
    }
  });
};
