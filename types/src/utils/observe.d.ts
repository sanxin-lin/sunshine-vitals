import { IPerformanceEntryMap } from '../types';
export declare const observe: <K extends keyof IPerformanceEntryMap>(type: K, cb: (entries: IPerformanceEntryMap[K]) => void, opts?: PerformanceObserverInit) => PerformanceObserver | undefined;
