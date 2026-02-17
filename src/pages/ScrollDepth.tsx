import {useEffect, useRef, useState} from 'react';

export function useScrollDepth(containerRef: React.RefObject<HTMLDivElement | null>) {
  const [scrollDepth, setScrollDepth] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onScroll = () => {
      const {scrollTop, scrollHeight, clientHeight} = container;
      const depth = scrollTop / (scrollHeight - clientHeight);

      // Ensure depth is between 0 and 1
      const clampedDepth = Math.min(1, Math.max(0, depth));
      setScrollDepth(clampedDepth);
    };

    container.addEventListener('scroll', onScroll);
    return () => container.removeEventListener('scroll', onScroll);
  }, [containerRef]);

  return scrollDepth; // value between 0 and 1
}

export const ScrollVisualizer = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollDepth = useScrollDepth(containerRef);

  const container = containerRef.current;
  const scrollHeight = container?.scrollHeight || 0;
  const clientHeight = container?.clientHeight || 0;
  const scrollTop = container?.scrollTop || 0;

  return (
    <div>
      <div
        ref={containerRef}
        style={{
          width: '300px',
          height: '300px',
          overflowY: 'scroll',
          border: '1px solid black',
        }}
      >
        <div style={{height: '1000px'}}>Scrollable Content</div>
      </div>

      <div style={{marginTop: '20px'}}>
        <p>Scroll Top: {scrollTop}px</p>
        <p>Scroll Height: {scrollHeight}px</p>
        <p>Client Height: {clientHeight}px</p>
        <p>Scroll Depth: {(scrollDepth * 100).toFixed(2)}%</p>
      </div>

      <div
        style={{
          marginTop: '10px',
          width: '300px',
          height: '10px',
          backgroundColor: '#ddd',
        }}
      >
        <div
          style={{
            width: `${scrollDepth * 100}%`,
            height: '100%',
            backgroundColor: 'blue',
          }}
        />
      </div>
    </div>
  );
};
