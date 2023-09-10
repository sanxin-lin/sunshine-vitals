import {
  // onBFCacheRestore,
  bindReporter,
  getVisibilityWatcher,
  initMetric,
  observe,
  onHidden,
  runOnce,
  whenActivated,
} from '../utils';
import { FIDMetric, FIDReportCallback, MetricRatingThresholds, ReportOpts } from '../types';


export const FIDThresholds: MetricRatingThresholds = [100, 300];


export const onFID = (onReport: FIDReportCallback, opts?: ReportOpts) => {
  // Set defaults
  opts = opts || {};

  whenActivated(() => {
    const visibilityWatcher = getVisibilityWatcher();
    let metric = initMetric('FID');
    let report: ReturnType<typeof bindReporter>;

    const handleEntry = (entry: PerformanceEventTiming) => {
      // Only report if the page wasn't hidden prior to the first input.
      if (entry.startTime < visibilityWatcher.firstHiddenTime) {
        metric.value = entry.processingStart - entry.startTime;
        metric.entries.push(entry);
        report(true);
      }
    };

    const handleEntries = (entries: FIDMetric['entries']) => {
      (entries as PerformanceEventTiming[]).forEach(handleEntry);
    };

    const po = observe('first-input', handleEntries);
    report = bindReporter(onReport, metric, FIDThresholds, opts!.reportAllChanges);

    if (po) {
      onHidden(
        runOnce(() => {
          handleEntries(po.takeRecords() as FIDMetric['entries']);
          po.disconnect();
        }),
      );
    }
    // Only monitor bfcache restores if the browser supports FID natively.
    if (po) {
      // onBFCacheRestore(() => {
      //   metric = initMetric('FID');
      //   report = bindReporter(onReport, metric, FIDThresholds, opts!.reportAllChanges);

      //   resetFirstInputPolyfill();
      //   firstInputPolyfill(handleEntry as FirstInputPolyfillCallback);
      // });
    }
  });
};
