import React from 'react';
import { Zap, Rocket, Sparkles as SparklesIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface SmartApplaiBannerProps {
  onGetAccessClick: () => void;
  theme?: 'genai' | 'aws' | 'devops';
}

export const SmartApplaiBanner: React.FC<SmartApplaiBannerProps> = ({ 
  onGetAccessClick,
  theme = 'genai'
}) => {
  const themeConfig = {
    genai: {
      gradient: 'from-cyan-500/10 via-transparent to-purple-500/10',
      border: 'border-cyan-500/30',
      shadow: 'shadow-[0_0_40px_rgba(6,182,212,0.15)]',
      buttonGradient: 'from-cyan-600 to-blue-600',
      buttonShadow: 'shadow-[0_0_20px_rgba(6,182,212,0.4)]',
      iconColor: 'text-cyan-400',
      iconGlow: 'drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]',
      badgeBg: 'bg-cyan-500',
      badgeText: 'text-slate-950'
    },
    aws: {
      gradient: 'from-orange-500/10 via-transparent to-yellow-500/10',
      border: 'border-orange-500/30',
      shadow: 'shadow-[0_0_40px_rgba(249,115,22,0.15)]',
      buttonGradient: 'from-orange-600 to-yellow-600',
      buttonShadow: 'shadow-[0_0_20px_rgba(249,115,22,0.4)]',
      iconColor: 'text-orange-400',
      iconGlow: 'drop-shadow-[0_0_15px_rgba(251,146,60,0.8)]',
      badgeBg: 'bg-orange-500',
      badgeText: 'text-slate-950'
    },
    devops: {
      gradient: 'from-green-500/10 via-transparent to-emerald-500/10',
      border: 'border-green-500/30',
      shadow: 'shadow-[0_0_40px_rgba(34,197,94,0.15)]',
      buttonGradient: 'from-green-600 to-emerald-600',
      buttonShadow: 'shadow-[0_0_20px_rgba(34,197,94,0.4)]',
      iconColor: 'text-green-400',
      iconGlow: 'drop-shadow-[0_0_15px_rgba(74,222,128,0.8)]',
      badgeBg: 'bg-green-500',
      badgeText: 'text-slate-950'
    }
  };

  const config = themeConfig[theme];

  return (
    <section className="relative z-10 container mx-auto px-4 mb-24 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`relative overflow-hidden rounded-3xl border ${config.border} bg-gradient-to-br from-slate-900/90 to-slate-950/90 ${config.shadow} group`}
      >
        <div className={`absolute inset-0 bg-gradient-to-r ${config.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700`}></div>
        
        <div className="p-8 md:p-12 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 text-center md:text-left">
            <div className={`inline-block px-3 py-1 rounded-md ${config.badgeBg} ${config.badgeText} font-bold text-xs uppercase tracking-widest mb-4`}>
              <div className="flex items-center gap-2">
                <SparklesIcon size={12} />
                <span>Ultimate Career Hack</span>
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Access In-House Tool: <span className={config.iconColor}>Smart ApplAI</span>
            </h2>
            <p className="text-slate-400 text-lg mb-6">
              Stop manual applying. Our proprietary AI tool enables automatic job applications—apply to 
              <span className="text-white font-bold"> 500+ jobs in 30 minutes</span>. 
              Exclusive to Vector Skill Academy students.
            </p>
            <button 
              onClick={onGetAccessClick}
              className={`px-8 py-3 rounded-xl bg-gradient-to-r ${config.buttonGradient} text-white font-bold hover:shadow-lg transition-all flex items-center gap-2 mx-auto md:mx-0`}
              style={{ boxShadow: `0 0 20px ${theme === 'genai' ? 'rgba(6,182,212,0.4)' : theme === 'aws' ? 'rgba(249,115,22,0.4)' : 'rgba(34,197,94,0.4)'}` }}
            >
              <Zap size={20} />
              <span>Get Access Now</span>
            </button>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="relative w-64 h-64">
              <div className={`absolute inset-0 ${config.iconColor.replace('text-', 'bg-')}/20 rounded-full animate-pulse blur-2xl`}></div>
              <div className="relative z-10 w-full h-full bg-slate-900 border border-slate-700 rounded-2xl flex items-center justify-center shadow-2xl">
                <Rocket size={64} className={`${config.iconColor} ${config.iconGlow}`} />
                <div className={`absolute -top-4 -right-4 px-4 py-2 ${config.badgeBg} rounded-lg ${config.badgeText} font-bold shadow-lg transform rotate-12`}>
                  500x Faster
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

