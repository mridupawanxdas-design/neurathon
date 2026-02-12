import { useScroll, useTransform, useSpring, MotionValue } from "framer-motion";
import { useRef, RefObject } from "react";

interface ScrollAnimationOptions {
  offset?: [string, string];
  springConfig?: { stiffness: number; damping: number; mass: number };
}

export const useScrollAnimation = (options?: ScrollAnimationOptions) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: (options?.offset as any) || ["start end", "end start"],
  });

  const springConfig = options?.springConfig || { stiffness: 80, damping: 24, mass: 0.8 };

  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]),
    springConfig
  );

  const y = useSpring(
    useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [80, 0, 0, -80]),
    springConfig
  );

  const scale = useSpring(
    useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0.92, 1, 1, 0.92]),
    springConfig
  );

  return { ref, opacity, y, scale, scrollYProgress };
};

export const useParallax = (ref: RefObject<HTMLElement>, speed: number = 0.5) => {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useSpring(
    useTransform(scrollYProgress, [0, 1], [speed * 120, -speed * 120]),
    { stiffness: 80, damping: 24, mass: 0.8 }
  );

  return y;
};
