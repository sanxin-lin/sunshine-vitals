import type { FCPMetric } from './fcp'
import type { CLSMetric } from './cls'
import type { FIDMetric } from './fid'
import type { INPMetric } from './inp'
import type { TTFBMetric } from './ttfb'
import type { LCPMetric } from './lcp'



export * from './base'
export * from './global'
export * from './fcp'
export * from './cls'
export * from './fid'
export * from './inp'
export * from './ttfb'
export * from './lcp'


export type MetricType =
  | CLSMetric
  | FCPMetric
  | FIDMetric
  | INPMetric
  | LCPMetric
  | TTFBMetric;