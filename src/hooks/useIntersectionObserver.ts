import React, {RefObject, useState} from 'react';

type Options = {
  rootMargin?: string;
  threshold?: number;
};

export function useIntersectionObserver<T extends Element>(
  elementRef: RefObject<T>,
  options: Options
) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  React.useEffect(() => {
    const currentRef = elementRef.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
        } else {
          setIsIntersecting(false);
        }
      });
    }, options);

    observer.observe(currentRef);

    // cleanup
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [elementRef, options]);

  return isIntersecting;
}
