export declare const getVisibilityWatcher: () => {
    readonly firstHiddenTime: number;
};
export interface OnHiddenCallback {
    (event: Event): void;
}
export declare const onHidden: (cb: OnHiddenCallback) => void;
