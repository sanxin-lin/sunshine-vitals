import { IPerformanceNavigationTiming, NavigationTimingPolyfillEntry } from 'src/types';
export declare const getNavigationEntry: () => IPerformanceNavigationTiming | NavigationTimingPolyfillEntry | undefined;
export declare const getActivationStart: () => number;
