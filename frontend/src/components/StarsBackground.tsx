import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";

interface StarsBackgroundProps {
  factor?: number;
  speed?: number;
  starColor?: string;
  className?: string;
}

export const StarsBackground: React.FC<StarsBackgroundProps> = ({
  factor = 0.0003,
  speed = 50,
  starColor = "#60a5fa",
  className = "",
}) => {
  const [dimensions, setDimensions] = useState({ width: 1920, height: 4000 });

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: Math.max(window.innerHeight * 3, 4000),
      });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const stars = useMemo(() => {
    const starsCount = Math.min(
      Math.floor(dimensions.width * dimensions.height * factor),
      500 // Maximum 500 stars to prevent crashes
    );

    return Array.from({ length: starsCount }, (_, i) => ({
      id: i,
      x: Math.random() * dimensions.width,
      y: Math.random() * dimensions.height,
      size: Math.random() * 2 + 2, // 2-4px
      opacity: Math.random() * 0.4 + 0.6, // 0.6-1.0
      delay: Math.random() * 3,
      duration: (Math.random() * 2 + 2) * (100 / speed),
    }));
  }, [dimensions, factor, speed]);

  return (
    <div
      className={`fixed inset-0 w-screen h-screen ${className}`}
      style={{
        zIndex: -1,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${star.x}px`,
            top: `${star.y}px`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: starColor,
            opacity: star.opacity,
            boxShadow: `0 0 ${star.size * 1.5}px ${starColor}80`,
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
          }}
          animate={{
            opacity: [star.opacity, star.opacity * 0.3, star.opacity],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: star.delay,
          }}
        />
      ))}
    </div>
  );
};
