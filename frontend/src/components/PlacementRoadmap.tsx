import React from "react";
import { motion } from "framer-motion";

interface RoadmapStep {
  id: string;
  title: string;
  description: string;
  status: "completed" | "active" | "pending";
  icon: React.ReactNode;
  metrics?: {
    label: string;
    value: string | number;
  }[];
}

interface PlacementRoadmapProps {
  steps: RoadmapStep[];
  isEnrolled?: boolean;
}

export const PlacementRoadmap: React.FC<PlacementRoadmapProps> = ({
  steps,
  isEnrolled = false,
}) => {
  return (
    <div className="relative w-full">
      {/* Animated Vertical Line */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/30 via-purple-500/30 via-pink-500/30 to-green-500/30" />
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-blue-500 via-purple-500 to-green-500"
          initial={{ y: "-100%" }}
          animate={{ y: "100%" }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      <div className="space-y-12">
        {steps.map((step, index) => {
          const isCompleted = step.status === "completed";
          const isActive = step.status === "active";
          const isPending = step.status === "pending" || !isEnrolled;

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.15, type: "spring", stiffness: 100 }}
              className="relative flex gap-6 group"
            >
              {/* Step Icon with Enhanced Effects */}
              <div className="relative z-10 flex-shrink-0">
                {/* Outer Glow Ring */}
                {(isCompleted || isActive) && (
                  <motion.div
                    className={`absolute inset-0 rounded-full ${
                      isCompleted
                        ? "bg-green-500/20"
                        : "bg-blue-500/20"
                    } blur-2xl`}
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                )}

                {/* Icon Container */}
                <motion.div
                  className={`w-16 h-16 rounded-full flex items-center justify-center border-4 backdrop-blur-sm relative ${
                    isCompleted
                      ? "bg-gradient-to-br from-green-500/30 to-emerald-500/30 border-green-500/60 shadow-lg shadow-green-500/40"
                      : isActive
                      ? "bg-gradient-to-br from-blue-500/30 to-cyan-500/30 border-blue-500/60 shadow-lg shadow-blue-500/40"
                      : "bg-gradient-to-br from-slate-700/40 to-slate-800/40 border-slate-600/60"
                  }`}
                  whileHover={{ scale: 1.15, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {/* Animated Border for Active */}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-blue-400"
                      animate={{
                        rotate: 360,
                      }}
                      transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  )}

                  {isCompleted ? (
                    <motion.svg
                      className="w-8 h-8 text-green-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </motion.svg>
                  ) : (
                    <motion.div
                      className="text-2xl"
                      animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      {step.icon}
                    </motion.div>
                  )}

                  {/* Pulse Ring for Active */}
                  {isActive && (
                    <>
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-blue-400"
                        animate={{
                          scale: [1, 1.5, 1.5],
                          opacity: [0.8, 0, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeOut",
                        }}
                      />
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-cyan-400"
                        animate={{
                          scale: [1, 1.8, 1.8],
                          opacity: [0.6, 0, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: 0.5,
                          ease: "easeOut",
                        }}
                      />
                    </>
                  )}
                </motion.div>
              </div>

              {/* Step Content Card */}
              <div className="flex-1 pt-1">
                <motion.div
                  className={`bg-gradient-to-br ${
                    isCompleted
                      ? "from-green-900/40 via-emerald-900/30 to-green-900/40 border-green-500/40 shadow-lg shadow-green-900/20"
                      : isActive
                      ? "from-blue-900/40 via-cyan-900/30 to-blue-900/40 border-blue-500/40 shadow-lg shadow-blue-900/20"
                      : "from-slate-800/40 to-slate-900/40 border-slate-700/40"
                  } border-2 rounded-2xl p-6 backdrop-blur-xl relative overflow-hidden ${
                    isPending ? "opacity-70" : ""
                  } group/card`}
                  whileHover={{
                    scale: isActive ? 1.02 : 1.01,
                    borderColor: isActive ? "#3b82f6" : isCompleted ? "#10b981" : undefined,
                    boxShadow: isActive
                      ? "0 20px 40px -12px rgba(59, 130, 246, 0.3)"
                      : isCompleted
                      ? "0 20px 40px -12px rgba(16, 185, 129, 0.3)"
                      : undefined,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Animated Shine Effect */}
                  {(isCompleted || isActive) && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
                      animate={{
                        x: ["-200%", "200%"],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        repeatDelay: 2,
                        ease: "easeInOut",
                      }}
                    />
                  )}

                  {/* Holographic Overlay for Active */}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 opacity-20"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 50%, rgba(236, 72, 153, 0.1) 100%)",
                      }}
                      animate={{
                        opacity: [0.1, 0.2, 0.1],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  )}

                  {/* Content */}
                  <div className="relative z-10">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3
                          className={`text-xl font-bold mb-2 ${
                            isCompleted
                              ? "text-green-300"
                              : isActive
                              ? "text-blue-300"
                              : "text-slate-400"
                          }`}
                        >
                          {step.title}
                        </h3>
                        {!isEnrolled && isPending && (
                          <motion.span
                            className="inline-block text-xs bg-slate-700/80 text-slate-400 px-3 py-1 rounded-full mt-2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                          >
                            Will Start After Enrollment
                          </motion.span>
                        )}
                      </div>
                      <motion.div
                        className={`px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 ${
                          isCompleted
                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                            : isActive
                            ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                            : "bg-slate-700/50 text-slate-500 border border-slate-600/50"
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {isCompleted && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200 }}
                          >
                            ✓
                          </motion.span>
                        )}
                        {isActive && (
                          <motion.span
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                            }}
                          >
                            ●
                          </motion.span>
                        )}
                        {isPending && !isActive && <span>○</span>}
                        <span>
                          {isCompleted
                            ? "Completed"
                            : isActive
                            ? "In Progress"
                            : "Pending"}
                        </span>
                      </motion.div>
                    </div>

                    {/* Description */}
                    <p className="text-slate-300 mb-5 leading-relaxed">
                      {step.description}
                    </p>

                    {/* Metrics Grid */}
                    {step.metrics && step.metrics.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {step.metrics.map((metric, idx) => (
                          <motion.div
                            key={idx}
                            className="bg-slate-900/60 rounded-xl p-4 border border-slate-800/60 relative overflow-hidden group/metric"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + idx * 0.1 }}
                            whileHover={{
                              scale: 1.05,
                              borderColor: isActive ? "#3b82f6" : isCompleted ? "#10b981" : "#475569",
                              boxShadow: isActive
                                ? "0 10px 20px -5px rgba(59, 130, 246, 0.2)"
                                : isCompleted
                                ? "0 10px 20px -5px rgba(16, 185, 129, 0.2)"
                                : undefined,
                            }}
                          >
                            {/* Metric Background Glow */}
                            {(isActive || isCompleted) && (
                              <motion.div
                                className={`absolute inset-0 opacity-0 group-hover/metric:opacity-100 transition-opacity ${
                                  isActive
                                    ? "bg-gradient-to-br from-blue-500/10 to-cyan-500/10"
                                    : "bg-gradient-to-br from-green-500/10 to-emerald-500/10"
                                }`}
                              />
                            )}

                            <div className="relative z-10">
                              <div className="text-xs text-slate-500 mb-2 uppercase tracking-wider">
                                {metric.label}
                              </div>
                              <div
                                className={`text-2xl font-bold ${
                                  isCompleted
                                    ? "text-green-400"
                                    : isActive
                                    ? "text-blue-400"
                                    : "text-white"
                                }`}
                              >
                                {metric.value}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

