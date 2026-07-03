// src/hooks/use-intersection.ts
import { useEffect, useRef, useState } from "react";

interface UseIntersectionOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

export function useIntersection<T extends Element = HTMLDivElement>(
  options: UseIntersectionOptions = {}
): { ref: React.RefObject<T | null>; isVisible: boolean } {
  const { threshold = 0.1, rootMargin = "0px", once = true } = options;
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref, isVisible };
}
