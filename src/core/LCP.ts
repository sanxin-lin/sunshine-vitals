import {
  onBFCacheRestore,
  bindReporter,
  doubleRAF,
  getActivationStart,
  getVisibilityWatcher,
  initMetric,
  observe,
  onHidden,
  runOnce,
  whenActivated,
} from '../utils';
import {
  LCPMetric,
  MetricRatingThresholds,
  LCPReportCallback,
  ReportOpts,
  LargestContentfulPaint,
} from '../types';

export const LCPThresholds: MetricRatingThresholds = [2500, 4000];

const reportedMetricIDs: Record<string, boolean> = {};

export const onLCP = (onReport: LCPReportCallback, opts: ReportOpts = {}) => {
  whenActivated(() => {
    const visibilityWatcher = getVisibilityWatcher();
    let metric = initMetric('LCP');
    let report: ReturnType<typeof bindReporter>;

    const handleEntries = (entries: LCPMetric['entries']) => {
      const lastEntry = entries[entries.length - 1] as LargestContentfulPaint;
      if (lastEntry && lastEntry.startTime < visibilityWatcher.firstHiddenTime) {
        metric.value = Math.max(lastEntry.startTime - getActivationStart(), 0);
        metric.entries = [lastEntry];
        report();
      }
    };

    const po = observe('largest-contentful-paint', handleEntries);

    if (po) {
      report = bindReporter(onReport, metric, LCPThresholds, opts!.reportAllChanges);


      const stopListening = runOnce(() => {
        if (!reportedMetricIDs[metric.id]) {
          handleEntries(po!.takeRecords() as LCPMetric['entries']);
          po!.disconnect();
          reportedMetricIDs[metric.id] = true;
          report(true);
        }
      });

      ['keydown', 'click'].forEach(type => {
        addEventListener(type, stopListening, true);
      });

      onHidden(stopListening);

      onBFCacheRestore(event => {
        metric = initMetric('LCP');
        report = bindReporter(onReport, metric, LCPThresholds, opts!.reportAllChanges);

        doubleRAF(() => {
          metric.value = performance.now() - event.timeStamp;
          reportedMetricIDs[metric.id] = true;
          report(true);
        });
      });
    }
  });
};
