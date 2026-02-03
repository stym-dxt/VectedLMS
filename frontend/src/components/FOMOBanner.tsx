import React from "react";
import { motion } from "framer-motion";
import { IconShieldCheck, IconStar } from "./Icons";

export const FOMOBanner: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-slate-900/80 backdrop-blur-sm border border-amber-500/30 rounded-xl p-6 lg:p-8"
    >
      <div className="flex flex-col lg:flex-row items-start gap-6">
        {/* Left Content */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-amber-500/20 border border-amber-500/40 rounded-lg flex items-center justify-center flex-shrink-0">
              <IconShieldCheck className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-0.5">
                Selective Enrollment Process
              </h3>
              <p className="text-xs text-amber-300/70">
                Quality over quantity
              </p>
            </div>
          </div>

          <div className="space-y-2.5 text-sm text-slate-300 pl-13">
            <div className="flex items-start gap-2.5">
              <div className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-2 flex-shrink-0" />
              <p>
                All applicants must pass a rigorous assessment test covering technical skills, problem-solving, and aptitude.
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <div className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-2 flex-shrink-0" />
              <p>
                Only <span className="font-semibold text-amber-400">top 30%</span> of test takers are selected for each batch to ensure focused mentorship.
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <div className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-2 flex-shrink-0" />
              <p>
                Limited seats per batch. Enrollment closes once capacity is reached.
              </p>
            </div>
          </div>
        </div>

        {/* Right Stats */}
        <div className="flex flex-row lg:flex-col gap-3 lg:min-w-[180px] w-full lg:w-auto">
          <div className="flex-1 lg:flex-none bg-slate-800/50 border border-amber-500/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <IconStar className="w-4 h-4 text-amber-400" />
              <span className="text-xs text-amber-300/70 uppercase tracking-wide">Acceptance</span>
            </div>
            <div className="text-2xl font-bold text-amber-400">30%</div>
            <div className="text-xs text-slate-400 mt-1">Selected only</div>
          </div>

          <div className="flex-1 lg:flex-none bg-slate-800/50 border border-amber-500/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <IconShieldCheck className="w-4 h-4 text-amber-400" />
              <span className="text-xs text-amber-300/70 uppercase tracking-wide">Test</span>
            </div>
            <div className="text-lg font-semibold text-white">Required</div>
            <div className="text-xs text-slate-400 mt-1">Before enrollment</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

