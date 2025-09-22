'use client';

import { useEffect } from 'react';

export default function ErrorGuard() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const originalDefineProperty = Object.defineProperty;

    const patchedDefineProperty: typeof Object.defineProperty = (
      target,
      property,
      descriptor
    ) => {
      try {
        return originalDefineProperty(target, property, descriptor);
      } catch (error) {
        const message = error instanceof Error ? error.message : '';
        const key = typeof property === 'symbol' ? property.toString() : property;

        if (target === window && key === 'conflux' && message.includes('Cannot redefine property')) {
          return Reflect.get(target, property);
        }

        throw error;
      }
    };

    Object.defineProperty = patchedDefineProperty;

    const suppressError = (event: ErrorEvent) => {
      if (event.message?.toLowerCase().includes('conflux')) {
        event.preventDefault();
      }
    };

    const suppressRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      const message =
        typeof reason === 'string'
          ? reason
          : reason instanceof Error
            ? reason.message
            : '';

      if (message.toLowerCase().includes('conflux')) {
        event.preventDefault();
      }
    };

    window.addEventListener('error', suppressError);
    window.addEventListener('unhandledrejection', suppressRejection);

    return () => {
      window.removeEventListener('error', suppressError);
      window.removeEventListener('unhandledrejection', suppressRejection);
      Object.defineProperty = originalDefineProperty;
    };
  }, []);

  return null;
}
