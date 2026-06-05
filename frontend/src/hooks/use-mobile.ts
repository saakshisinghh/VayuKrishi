'use client';

import { useEffect, useState } from 'react';
import { BREAKPOINTS } from '@/config/constants';

export function useMobile(
  breakpoint: keyof typeof BREAKPOINTS = 'md'
): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(
      `(max-width: ${BREAKPOINTS[breakpoint] - 1}px)`
    );
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [breakpoint]);

  return isMobile;
}
