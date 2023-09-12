declare global {
    interface Performance {
        interactionCount: number;
    }
}
export declare const getInteractionCount: () => number;
export declare const initInteractionCountPolyfill: () => void;
