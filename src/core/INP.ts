import {
  onBFCacheRestore,
  bindReporter,
  initMetric,
  observe,
  onHidden,
  whenActivated,
  initInteractionCountPolyfill,
  getInteractionCount,
} from '../utils';
import type {
  INPMetric,
  INPReportCallback,
  IPerformanceEventTiming,
  MetricRatingThresholds,
  ReportOpts,
} from '../types';

interface Interaction {
  id: number;
  latency: number;
  entries: PerformanceEventTiming[];
}

export const INPThresholds: MetricRatingThresholds = [200, 500];

let prevInteractionCount = 0;

const getInteractionCountForNavigation = () => {
  return getInteractionCount() - prevInteractionCount;
};

const MAX_INTERACTIONS_TO_CONSIDER = 10;

let longestInteractionList: Interaction[] = [];

const longestInteractionMap: { [interactionId: string]: Interaction } = {};

const processEntry = (entry: any) => {
  const minLongestInteraction = longestInteractionList[longestInteractionList.length - 1];

  const existingInteraction = longestInteractionMap[entry.interactionId!];

  if (
    existingInteraction ||
    longestInteractionList.length < MAX_INTERACTIONS_TO_CONSIDER ||
    entry.duration > minLongestInteraction.latency
  ) {
    if (existingInteraction) {
      existingInteraction.entries.push(entry);
      existingInteraction.latency = Math.max(existingInteraction.latency, entry.duration);
    } else {
      const interaction = {
        id: entry.interactionId!,
        latency: entry.duration,
        entries: [entry],
      };
      longestInteractionMap[interaction.id] = interaction;
      longestInteractionList.push(interaction);
    }

    longestInteractionList.sort((a, b) => b.latency - a.latency);
    longestInteractionList.splice(MAX_INTERACTIONS_TO_CONSIDER).forEach(i => {
      delete longestInteractionMap[i.id];
    });
  }
};

const estimateP98LongestInteraction = () => {
  const candidateInteractionIndex = Math.min(
    longestInteractionList.length - 1,
    Math.floor(getInteractionCountForNavigation() / 50),
  );

  return longestInteractionList[candidateInteractionIndex];
};

export const onINP = (onReport: INPReportCallback, opts?: ReportOpts) => {
  // Set defaults
  opts = opts || {};

  whenActivated(() => {
    // TODO(philipwalton): remove once the polyfill is no longer needed.
    initInteractionCountPolyfill();

    let metric = initMetric('INP');
    let report: ReturnType<typeof bindReporter>;

    const handleEntries = (entries: INPMetric['entries']) => {
      // console.log([...entries])
      entries.forEach((entry: IPerformanceEventTiming) => {
        if (entry.interactionId) {
          processEntry(entry);
        }
        if (entry.entryType === 'first-input') {
          const noMatchingEntry = !longestInteractionList.some(interaction => {
            return interaction.entries.some((prevEntry: IPerformanceEventTiming) => {
              return (
                entry.duration === prevEntry.duration && entry.startTime === prevEntry.startTime
              );
            });
          });
          if (noMatchingEntry) {
            processEntry(entry);
          }
        }
      });

      const inp = estimateP98LongestInteraction();
      console.log(inp)
      if (inp && inp.latency !== metric.value) {
        metric.value = inp.latency;
        metric.entries = inp.entries;
        report();
      }
    };

    const po = observe('event', handleEntries, {
      durationThreshold: opts!.durationThreshold || 40,
    } as PerformanceObserverInit);

    report = bindReporter(onReport, metric, INPThresholds, opts!.reportAllChanges);

    if (po) {
      if ('interactionId' in PerformanceEventTiming.prototype) {
        po.observe({ type: 'first-input', buffered: true });
      }

      onHidden(() => {
        handleEntries(po.takeRecords() as INPMetric['entries']);

        if (metric.value < 0 && getInteractionCountForNavigation() > 0) {
          metric.value = 0;
          metric.entries = [];
        }

        report(true);
      });

      onBFCacheRestore(() => {
        longestInteractionList = [];
        prevInteractionCount = getInteractionCount();

        metric = initMetric('INP');
        report = bindReporter(onReport, metric, INPThresholds, opts!.reportAllChanges);
      });
    }
  });
};
