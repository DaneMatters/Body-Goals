import { useRef } from "react";

/** Returns a function that debounces calls to `fn` by `delayMs`, keyed by `key`. */
export function useDebouncedCallback<T extends unknown[]>(fn: (...args: T) => void, delayMs: number) {
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  return (key: string, ...args: T) => {
    const existing = timers.current.get(key);
    if (existing) clearTimeout(existing);
    const timer = setTimeout(() => {
      timers.current.delete(key);
      fn(...args);
    }, delayMs);
    timers.current.set(key, timer);
  };
}
