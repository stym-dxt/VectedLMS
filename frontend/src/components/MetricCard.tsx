import React from "react";
import { motion } from "framer-motion";

interface MetricCardProps {
  title: string;
  value: number | string;
  subtitle: string;
  icon: React.ReactNode;
  gradient: string;
  borderColor: string;
  textColor: string;
  iconColor: string;
  isActive: boolean;
  delay?: number;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  gradient,
  borderColor,
  textColor,
  iconColor,
  isActive,
  delay = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, type: "spring", stiffness: 100 }}
      className={`bg-gradient-to-br ${gradient} border-2 ${borderColor} rounded-2xl p-6 relative overflow-hidden group ${!isActive ? "opacity-75" : ""}`}
      whileHover={{
        scale: isActive ? 1.05 : 1.02,
        borderColor: isActive ? borderColor.replace("/30", "/60") : undefined,
        boxShadow: isActive
          ? `0 20px 40px -12px ${borderColor.replace("/30", "/20")}`
          : undefined,
        transition: { duration: 0.3 },
      }}
    >
      {/* Animated Background Glow */}
      {isActive && (
        <motion.div
          className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12`}
          animate={{
            x: ["-200%", "200%"],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatDelay: 3,
            ease: "easeInOut",
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className={`text-sm ${textColor} uppercase tracking-wider font-semibold`}>
            {title}
          </div>
          <motion.div
            className={`${iconColor}`}
            animate={isActive ? { rotate: [0, 10, -10, 0] } : {}}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 2,
            }}
          >
            {icon}
          </motion.div>
        </div>

        {/* Value */}
        <motion.div
          className="text-4xl font-bold text-white mb-2"
          animate={
            isActive
              ? {
                  scale: [1, 1.05, 1],
                }
              : {}
          }
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3,
          }}
        >
          {value}
        </motion.div>

        {/* Subtitle */}
        <div className={`text-xs ${isActive ? textColor : "text-slate-500"}`}>
          {subtitle}
        </div>

        {/* Not Started Badge */}
        {!isActive && (
          <motion.div
            className="absolute top-3 right-3"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: delay + 0.3 }}
          >
            <span className="text-xs bg-slate-800/90 text-slate-400 px-2 py-1 rounded-full border border-slate-700/50">
              Not Started
            </span>
          </motion.div>
        )}
      </div>

      {/* Hover Glow Effect */}
      {isActive && (
        <motion.div
          className={`absolute inset-0 rounded-2xl ${borderColor.replace("/30", "/10")} blur-xl opacity-0 group-hover:opacity-100 transition-opacity`}
        />
      )}
    </motion.div>
  );
};

