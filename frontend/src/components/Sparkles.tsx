import React, { useMemo } from "react";
import { motion } from "framer-motion";

export interface SparklesProps {
  id?: string;
  colors?: {
    first: string;
    second: string;
  };
  count?: number;
  speed?: number;
  minSize?: number;
  maxSize?: number;
  className?: string;
}

export const Sparkles: React.FC<SparklesProps> = ({
  colors = {
    first: "#60a5fa",
    second: "#818cf8",
  },
  count = 50,
  speed = 1,
  minSize = 4,
  maxSize = 12,
  className,
}) => {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 2,
        duration: (Math.random() * 3 + 2) / speed,
        size: Math.random() * (maxSize - minSize) + minSize,
      })),
    [count, speed, minSize, maxSize],
  );

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className || ""}`}
    >
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className="absolute rounded-full blur-sm"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            background: `linear-gradient(45deg, ${colors.first}, ${colors.second})`,
            opacity: 0.6,
          }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};
