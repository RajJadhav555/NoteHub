declare module 'react' {
  function useState<S>(initialState: S | (() => S)): [S, (value: S | ((val: S) => S)) => void];
  function useEffect(effect: () => void | (() => void), deps?: any[]): void;
  const FC: any;
  const Component: any;
  const ReactElement: any;
}

declare namespace JSX {
  interface Element {}
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}


