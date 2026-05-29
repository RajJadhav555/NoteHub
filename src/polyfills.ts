import { Buffer } from 'buffer';

// Polyfill global
// @ts-ignore
if (typeof global === 'undefined') {
  (window as any).global = window;
}

// Polyfill Buffer
if (typeof (window as any).Buffer === 'undefined') {
  (window as any).Buffer = Buffer;
}

// Polyfill process (simple-peer needs process.nextTick and process.browser)
// @ts-ignore
if (typeof process === 'undefined') {
    (window as any).process = {
        env: { NODE_ENV: 'development' },
        nextTick: (fn: any) => setTimeout(fn, 0),
        browser: true
    };
} else {
    // If process exists but nextTick is missing (sometimes happens in incomplete polyfills)
    // @ts-ignore
    if (!process.nextTick) {
        // @ts-ignore
        process.nextTick = (fn: any) => setTimeout(fn, 0);
    }
}
