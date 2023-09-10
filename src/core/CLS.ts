import {
  onBFCacheRestore,
  initMetric,
  observe,
  bindReporter,
  doubleRAF,
  onHidden,
  runOnce,
} from '../utils';
import { onFCP } from './FCP';
import {
  CLSMetric,
  CLSReportCallback,
  MetricRatingThresholds,
  ReportOpts,
  ILayoutShift,
} from '../types';

export const CLSThresholds: MetricRatingThresholds = [0.1, 0.25];

export const onCLS = (onReport: CLSReportCallback, opts?: ReportOpts) => {
  // Set defaults
  opts = opts || {};

  // Start monitoring FCP so we can only report CLS if FCP is also reported.
  // Note: this is done to match the current behavior of CrUX.
  onFCP(
    runOnce(() => {
      let metric = initMetric('CLS', 0);
      let report: ReturnType<typeof bindReporter>;

      let sessionValue = 0;
      let sessionEntries: ILayoutShift[] = [];

      const handleEntries = (entries: ILayoutShift[]) => {
        entries.forEach(entry => {
          // Only count layout shifts without recent user input.
          if (!entry.hadRecentInput) {
            const firstSessionEntry = sessionEntries[0];
            const lastSessionEntry = sessionEntries[sessionEntries.length - 1];

            // If the entry occurred less than 1 second after the previous entry
            // and less than 5 seconds after the first entry in the session,
            // include the entry in the current session. Otherwise, start a new
            // session.
            if (
              sessionValue &&
              entry.startTime - lastSessionEntry.startTime < 1000 &&
              entry.startTime - firstSessionEntry.startTime < 5000
            ) {
              sessionValue += entry.value;
              sessionEntries.push(entry);
            } else {
              sessionValue = entry.value;
              sessionEntries = [entry];
            }
          }
        });

        // If the current session value is larger than the current CLS value,
        // update CLS and the entries contributing to it.
        if (sessionValue > metric.value) {
          metric.value = sessionValue;
          metric.entries = sessionEntries;
          report();
        }
      };

      const po = observe('layout-shift', handleEntries);
      if (po) {
        report = bindReporter(onReport, metric, CLSThresholds, opts!.reportAllChanges);

        onHidden(() => {
          handleEntries(po.takeRecords() as CLSMetric['entries']);
          report(true);
        });

        // Only report after a bfcache restore if the `PerformanceObserver`
        // successfully registered.
        onBFCacheRestore(() => {
          sessionValue = 0;
          metric = initMetric('CLS', 0);
          report = bindReporter(onReport, metric, CLSThresholds, opts!.reportAllChanges);

          doubleRAF(() => report());
        });

        // Queue a task to report (if nothing else triggers a report first).
        // This allows CLS to be reported as soon as FCP fires when
        // `reportAllChanges` is true.
        setTimeout(report, 0);
      }
    }),
  );
};
