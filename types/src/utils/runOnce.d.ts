export interface RunOnceCallback {
    (arg: unknown): void;
}
export declare const runOnce: (cb: RunOnceCallback) => (arg: unknown) => void;
