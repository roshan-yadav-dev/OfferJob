import { useEffect, useRef, useState } from 'react';

export function useAnimatedCounter(target, duration = 1800) {
    const [value, setValue] = useState(0);
    const ref = useRef(null);
    const hasAnimated = useRef(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting || hasAnimated.current) return;

                hasAnimated.current = true;
                const start = performance.now();

                const animate = (now) => {
                    const progress = Math.min((now - start) / duration, 1);
                    const eased = 1 - (1 - progress) ** 3;
                    setValue(Math.round(target * eased));

                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    }
                };

                requestAnimationFrame(animate);
            },
            { threshold: 0.3 },
        );

        observer.observe(element);

        return () => observer.disconnect();
    }, [target, duration]);

    return { value, ref };
}
