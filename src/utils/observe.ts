import { IPerformanceEntryMap } from '../types';

export const observe = <K extends keyof IPerformanceEntryMap>(
  type: K,
  cb: (entries: IPerformanceEntryMap[K]) => void,
  opts?: PerformanceObserverInit,
): PerformanceObserver | undefined => {
  try {
    if (PerformanceObserver.supportedEntryTypes.includes(type)) {
      const po = new PerformanceObserver(list => {
        Promise.resolve().then(() => {
          cb(list.getEntries() as IPerformanceEntryMap[K]);
        });
      });

      po.observe(
        Object.assign(
          {
            type,
            buffered: true,
          },
          opts || {},
        ) as PerformanceObserverInit,
      );

      return po;
    }
  } catch (e) {}

  return;
};
