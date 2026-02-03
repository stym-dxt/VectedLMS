import React from "react";
import { IconGlobeAlt, IconBolt, IconRocketLaunch } from "./Icons";

export const SmartApplaiCard: React.FC<{ isEnrolled?: boolean }> = ({
  isEnrolled = false,
}) => {
  return (
    <div className="bg-slate-900/80 backdrop-blur-sm border border-indigo-500/30 rounded-xl p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-indigo-500/20 border border-indigo-500/40 rounded-lg flex items-center justify-center flex-shrink-0">
          <IconGlobeAlt className="w-6 h-6 text-indigo-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="text-xl font-semibold text-white">Smart Applai</h3>
            <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 text-xs font-medium rounded border border-indigo-500/30">
              EXCLUSIVE USP
            </span>
          </div>
          <p className="text-sm text-indigo-300/70">
            AI-Powered 24/7 Job Application System
          </p>
        </div>
      </div>

      {/* Main Description */}
      <p className="text-slate-300 mb-6 leading-relaxed">
        Our proprietary <span className="font-semibold text-indigo-400">Smart Applai</span> system automatically applies to hundreds of job postings across multiple job boards on your behalf, 24/7.
      </p>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-800/50 border border-indigo-500/20 rounded-lg p-4">
          <div className="flex items-center gap-2.5 mb-2.5">
            <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <IconGlobeAlt className="w-4 h-4 text-indigo-400" />
            </div>
            <h4 className="font-medium text-white text-sm">Multiple Platforms</h4>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Naukri, LinkedIn, Indeed, Glassdoor, and 20+ more job boards simultaneously.
          </p>
        </div>

        <div className="bg-slate-800/50 border border-indigo-500/20 rounded-lg p-4">
          <div className="flex items-center gap-2.5 mb-2.5">
            <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <IconBolt className="w-4 h-4 text-indigo-400" />
            </div>
            <h4 className="font-medium text-white text-sm">24/7 Automated</h4>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Never miss an opportunity. Applies to new postings instantly, even while you sleep.
          </p>
        </div>

        <div className="bg-slate-800/50 border border-indigo-500/20 rounded-lg p-4">
          <div className="flex items-center gap-2.5 mb-2.5">
            <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <IconRocketLaunch className="w-4 h-4 text-indigo-400" />
            </div>
            <h4 className="font-medium text-white text-sm">Unlimited</h4>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Apply to as many positions as you want across all job boards without restrictions.
          </p>
        </div>
      </div>

      {/* Stats */}
      {isEnrolled ? (
        <div className="bg-slate-800/50 border border-indigo-500/20 rounded-lg p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-indigo-300/70 mb-1">
                Applications (7 days)
              </div>
              <div className="text-xl font-bold text-indigo-400">145+</div>
            </div>
            <div>
              <div className="text-xs text-indigo-300/70 mb-1">
                Active Platforms
              </div>
              <div className="text-xl font-bold text-indigo-400">24</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 text-center">
          <p className="text-sm text-slate-400">
            <span className="font-medium text-slate-300">Enroll now</span> to activate Smart Applai and unlock unlimited job applications.
          </p>
        </div>
      )}
    </div>
  );
};

