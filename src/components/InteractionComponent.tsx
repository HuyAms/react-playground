import { Box } from "@mui/material";
import React, { useRef, useState } from "react";


// The Intersection Observer API works by creating an observer 
// that watches a target element and fires a callback when that element 
// intersects with a specified element

// Use cases:
// 1. Lazy loading images or content
// 2. Infinite scrolling
// 3. Playing/pausing videos when they enter/exit viewport
// 4. Triggering animations when elements become visible
// 5. Implementing scroll-spy navigation

interface IntersectionProps {
    threshold?: number;
    rootMargin?: string;
    onIntersect?: () => void;
    children: React.ReactNode;
}

export function InteractionComponent({children,
    rootMargin = "0px",
    threshold = 0,
    onIntersect
}: IntersectionProps) {

    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    React.useEffect(() => {

        const currentRef = ref.current;
        if (!currentRef) return;


        const options = {
            root: null, // The element to use as viewport (null = browser viewport)
            rootMargin, // Margin around the root
            threshold, // Percentage of target visibility to trigger callback (0-1)
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                  setIsVisible(true);
                  if (onIntersect) onIntersect();
                } else {
                  setIsVisible(false);
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
    }, [rootMargin, threshold, onIntersect]);


    return (
        <div ref={ref}>
            <Box sx={{position: 'fixed', top: '10px', right: '20px'}}>Visible: {isVisible.toString()}</Box>
            {children}
        </div>
    )
}