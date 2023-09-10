import { MetricType, MetricRatingThresholds } from '../types/';

const getRating = (value: number, thresholds: MetricRatingThresholds): MetricType['rating'] => {
  if (value > thresholds[1]) {
    return 'poor';
  }
  if (value > thresholds[0]) {
    return 'needs-improvement';
  }
  return 'good';
};

export const bindReporter = <MetricName extends MetricType['name']>(
  cb: (metric: Extract<MetricType, { name: MetricName }>) => void,
  metric: Extract<MetricType, { name: MetricName }>,
  thresholds: MetricRatingThresholds,
  reportAllChanges?: boolean,
) => {
  let pre: number = 0;
  let delta: number;
  return (force?: boolean) => {
    if (metric.value >= 0) {
      if (force || reportAllChanges) {
        delta = metric.value - pre;
        if (delta || pre) {
          pre = metric.value;
          metric.delta = delta;
          metric.rating = getRating(metric.value, thresholds);
          cb(metric);
        }
      }
    }
  };
};
