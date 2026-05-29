
import 'react';

declare module 'react' {
    export function useRef<T>(initialValue: T): MutableRefObject<T>;
    export function useRef<T>(initialValue: T | null): RefObject<T>;
    export function useRef<T = undefined>(): MutableRefObject<T | undefined>;
}
