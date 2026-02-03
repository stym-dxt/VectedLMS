import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ReactPlayer from 'react-player';
import { 
  GraduationCap, 
  Users, 
  Folder, 
  Globe, 
  Rocket, 
  BarChart3, 
  Calendar, 
  Clock, 
  CheckCircle, 
  DollarSign, 
  Briefcase, 
  Sparkles as SparklesIcon,
  Zap,
  Lock,
  Brain,
  Cloud,
  GitBranch,
  ArrowRight,
  BookOpen,
  Target,
  TrendingUp,
  Sparkles,
  Play
} from "lucide-react";
import { useAuthStore } from "@/store/auth";
import api from "@/lib/api";
import { SmartApplaiBanner } from "@/components/SmartApplaiBanner";

// YouTube video URL for dashboard welcome video
const DASHBOARD_VIDEO_URL = 'https://youtu.be/oRedI9IBXbo';

interface PlacementMetrics {
  interviewsScheduled: number;
  upcomingInterviews: number;
  interviewRoundsCleared: number;
  totalOffersReceived: number;
  rejectionReasons: string[];
  resumeQuality: number;
  hrPocName: string;
  hrPocEmail: string;
  hrPocPhone: string;
  applicationsSubmitted: number;
  profileOptimized: boolean;
  resumeOptimized: boolean;
  linkedinOptimized: boolean;
  mockInterviewsCompleted: number;
  softSkillsScore: number;
}

const FOMOBanner = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-900/40 via-orange-900/40 to-amber-900/40 border border-amber-500/30 p-6 flex items-start gap-4 shadow-lg hover:shadow-xl transition-all backdrop-blur-sm"
  >
    <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-orange-500/10"></div>
    <div className="p-3 bg-gradient-to-br from-amber-500/30 to-orange-500/30 rounded-xl text-white shrink-0 shadow-md">
      <Zap className="w-6 h-6" />
    </div>
    <div className="relative z-10 flex-1">
      <div className="flex items-center gap-2 mb-2">
        <h4 className="text-amber-100 font-bold text-base">Limited Time Offer</h4>
        <span className="px-2 py-0.5 bg-red-500/80 text-white text-[10px] font-bold rounded-full animate-pulse">
          URGENT
        </span>
      </div>
      <p className="text-amber-200/90 text-sm leading-relaxed">
        Complete your profile today to get priority access to the upcoming placement drive. Don't miss out on this exclusive opportunity!
      </p>
    </div>
  </motion.div>
);

const SmartApplaiCard = ({ isEnrolled }: { isEnrolled: boolean }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
    className="relative p-8 bg-slate-900/80 backdrop-blur-sm rounded-3xl shadow-xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6"
  >
    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-purple-500/5"></div>
    <div className="space-y-4 max-w-lg relative z-10">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-blue-300 text-xs font-bold uppercase tracking-wider">
        <SparklesIcon className="w-4 h-4" />
        AI-Powered
      </div>
      <h3 className="text-3xl font-bold text-white">
        Smart Applai <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">2.0</span>
      </h3>
      <p className="text-slate-300 leading-relaxed text-base">
        Our autonomous agent applies to <span className="font-bold text-blue-400">500+ relevant jobs weekly</span> on your behalf using your optimized profile.
      </p>
      <div className="flex flex-wrap gap-2">
        {['LinkedIn', 'Indeed', 'Glassdoor', 'Naukri'].map((platform) => (
          <span 
            key={platform} 
            className="px-3 py-1.5 bg-slate-800/70 rounded-lg text-xs text-slate-300 border border-slate-700/50 hover:border-blue-500/50 hover:text-blue-300 transition-all cursor-default font-medium"
          >
            {platform}
          </span>
        ))}
      </div>
    </div>
    <div className="shrink-0 relative z-10">
      <div className={`w-36 h-36 rounded-full border-4 ${isEnrolled ? 'border-blue-500 border-t-blue-300 shadow-[0_0_50px_rgba(59,130,246,0.5)]' : 'border-slate-700 border-t-slate-600'} flex items-center justify-center bg-slate-950 relative overflow-hidden`}>
        {isEnrolled && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border-4 border-transparent border-t-blue-300 rounded-full"
          />
        )}
        <Globe className={`w-14 h-14 ${isEnrolled ? 'text-blue-400' : 'text-slate-600'}`} />
      </div>
      {isEnrolled && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-[10px] font-bold px-4 py-1.5 rounded-full shadow-lg"
        >
          ACTIVE
        </motion.div>
      )}
    </div>
  </motion.div>
);

const PlacementRoadmap = ({ steps }: { steps: any[] }) => (
  <div className="relative space-y-8">
    {steps.map((step, idx) => {
      const isActive = step.status === 'active';
      const isCompleted = step.status === 'completed';
      const isLocked = step.status === 'pending';
      
      return (
        <motion.div
          key={step.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.1 }}
          className={`relative flex items-center gap-6 ${isLocked ? 'opacity-60' : 'opacity-100'}`}
        >
          <div className="flex-shrink-0 w-12 h-12 rounded-full border-4 border-slate-950 bg-slate-950 shadow-lg flex items-center justify-center z-10">
            <div className={`w-full h-full rounded-full flex items-center justify-center transition-all ${isCompleted ? 'bg-gradient-to-br from-green-500 to-emerald-500 text-white' : isActive ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white' : 'bg-slate-800 text-slate-500'}`}>
              {isCompleted ? <CheckCircle className="w-5 h-5" /> : step.icon}
            </div>
          </div>
          <div className={`flex-1 p-6 rounded-2xl border-2 transition-all ${
            isCompleted ? 'bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-500/30' :
            isActive ? 'bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-500/30 shadow-md' :
            'bg-slate-900/50 border-slate-800'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex-1">
                <h3 className={`font-bold text-lg ${isActive || isCompleted ? 'text-white' : 'text-slate-500'}`}>
                  {step.title}
                </h3>
                {step.team && (
                  <div className="mt-1">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800/50 border border-slate-700/50 text-xs font-medium text-slate-400">
                      <Users className="w-3 h-3" />
                      {step.team}
                    </span>
                  </div>
                )}
              </div>
              {step.metrics && (
                <div className="flex gap-2">
                  {step.metrics.map((m: any, i: number) => (
                    <span key={i} className="text-[10px] font-mono px-2 py-1 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30 font-bold">
                      {m.value}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <p className={`text-sm leading-relaxed ${isActive || isCompleted ? 'text-slate-300' : 'text-slate-500'}`}>
              {step.description}
            </p>
          </div>
        </motion.div>
      );
    })}
  </div>
);

export default function Dashboard() {
  const { isAuthenticated, user, fetchUser } = useAuthStore();
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});
  const [placementMetrics, setPlacementMetrics] = useState<PlacementMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [animateHeader, setAnimateHeader] = useState(false);
  
  const isEnrolled = enrollments.length > 0;

  useEffect(() => {
    setAnimateHeader(true);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    
    const loadDashboardData = async () => {
      try {
        await fetchUser();

        const [enrolls, certs, classes, resumes, preps] = await Promise.all([
          api.get("/courses/my/enrollments").then((r) => r.data).catch((err) => {
            console.error("Error fetching enrollments:", err);
            return [];
          }),
          api.get("/certifications").then((r) => r.data).catch((err) => {
            console.error("Error fetching certifications:", err);
            return [];
          }),
          api.get("/live-classes").then((r) => r.data).catch((err) => {
            console.error("Error fetching live classes:", err);
            return [];
          }),
          api.get("/career/resumes").then((r) => r.data).catch((err) => {
            console.error("Error fetching resumes:", err);
            return [];
          }),
          api.get("/career/interview-prep").then((r) => r.data).catch((err) => {
            console.error("Error fetching interview prep:", err);
            return [];
          }),
        ]);

        setEnrollments(enrolls || []);
        setStats({
          enrollments: (enrolls || []).length,
          certifications: (certs || []).length,
          upcomingClasses: (classes || []).filter((c: any) => !c.is_completed).length,
        });

        const enrolled = (enrolls || []).length > 0;
        setPlacementMetrics({
          interviewsScheduled: enrolled ? ((preps || []).length || 0) : 0,
          upcomingInterviews: enrolled ? 2 : 0,
          interviewRoundsCleared: enrolled ? 5 : 0,
          totalOffersReceived: enrolled ? 1 : 0,
          rejectionReasons: enrolled ? ["Technical skills gap", "Communication"] : [],
          resumeQuality: enrolled && (resumes || []).length > 0 ? 85 : 45,
          hrPocName: "Priya Sharma",
          hrPocEmail: "priya.sharma@vectorskillacademy.com",
          hrPocPhone: "+91 98765 43210",
          applicationsSubmitted: enrolled ? 15 : 0,
          profileOptimized: enrolled,
          resumeOptimized: enrolled && (resumes || []).length > 0,
          linkedinOptimized: enrolled,
          mockInterviewsCompleted: enrolled ? ((preps || []).length || 0) : 0,
          softSkillsScore: enrolled ? 78 : 0,
        });
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [isAuthenticated, navigate, fetchUser]);

  if (!isAuthenticated || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-400">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-sm font-medium tracking-wider uppercase">Loading Dashboard...</div>
        </div>
      </div>
    );
  }

  const handleGetAccessClick = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  const MetricCard = ({ 
    title, 
    value, 
    subtext, 
    icon: Icon, 
    colorClass, 
    bgGradient,
    borderColor
  }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05, y: -5 }}
      className={`relative overflow-hidden bg-slate-900/80 backdrop-blur-sm rounded-2xl p-6 border-2 ${borderColor} shadow-lg hover:shadow-xl transition-all`}
    >
      <div className={`absolute top-0 right-0 w-32 h-32 ${bgGradient} rounded-full blur-3xl opacity-20`}></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl ${bgGradient} ${colorClass} shadow-md`}>
            <Icon className="w-7 h-7" />
          </div>
          {!isEnrolled && (
            <span className="flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase text-slate-500 bg-slate-800 px-2 py-1 rounded-full border border-slate-700">
              <Lock className="w-2.5 h-2.5" /> Locked
            </span>
          )}
        </div>
        <div className="space-y-1">
          <div className={`text-5xl font-bold tracking-tight ${isEnrolled ? "text-white" : "text-slate-500"}`}>
            {value}
            </div>
          <div className="font-semibold text-slate-300 text-base">{title}</div>
          <div className={`text-xs font-medium ${isEnrolled ? colorClass : "text-slate-500"}`}>
            {subtext}
          </div>
        </div>
            </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500 selection:text-white overflow-x-hidden">
      {/* Background Effects - Matching Course Pages */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[150px]"></div>
            </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        {/* Header Section - Matching Course Page Style */}
        <header className="relative z-10 container mx-auto px-6 py-16 text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`transition-all duration-1000 ease-out transform ${animateHeader ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}
          >
            {/* Dashboard Logo/Badge */}
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-2xl animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-2 border-blue-500/40 rounded-3xl p-6 backdrop-blur-sm">
                  <BarChart3 size={64} className="text-blue-400 mx-auto drop-shadow-[0_0_20px_rgba(59,130,246,0.8)]" />
            </div>
          </div>
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-950/30 border border-blue-500/30 text-blue-400 text-sm font-medium mb-8 animate-pulse">
              <Sparkles size={16} />
              <span>Vector Skill Academy Dashboard</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-600">
                Welcome back, {user?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "Student"}
              </span>
            </h1>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed mb-10">
              {isEnrolled
                ? "Your career control center is active. Track your placement progress and accelerate your journey."
                : "Your journey to a dream career starts here. Complete enrollment to activate your dashboard and unlock unlimited opportunities."}
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="px-6 py-3 bg-slate-900/50 backdrop-blur-md rounded-xl border border-slate-800 flex items-center gap-3 hover:border-blue-500/50 transition-all">
                <Calendar size={20} className="text-blue-400" />
                <span className="font-bold">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</span>
              </div>
              <div className="px-6 py-3 bg-slate-900/50 backdrop-blur-md rounded-xl border border-slate-800 flex items-center gap-3 hover:border-purple-500/50 transition-all">
                <BookOpen size={20} className="text-purple-400" />
                <span className="font-bold">{stats.enrollments || 0} Enrollments</span>
            </div>
              <div className="px-6 py-3 bg-slate-900/50 backdrop-blur-md rounded-xl border border-slate-800 flex items-center gap-3 hover:border-pink-500/50 transition-all">
                <Rocket size={20} className="text-pink-400" />
                <span className="font-bold">{isEnrolled ? 'Active' : 'Get Started'}</span>
          </div>
            </div>
          </motion.div>
        </header>

        {/* Welcome Video Section */}
        <section className="relative z-10 container mx-auto px-4 mb-12 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-3xl border border-blue-500/30 bg-gradient-to-br from-slate-900/90 to-slate-950/90 shadow-[0_0_40px_rgba(59,130,246,0.15)]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-purple-500/10"></div>
            
            <div className="p-8 md:p-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-500/20 rounded-xl border border-blue-500/30">
                  <Play className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">Welcome Video</h2>
                  <p className="text-slate-400 text-sm">Watch this video to get started with your journey</p>
                </div>
              </div>

              <div className="relative w-full rounded-2xl overflow-hidden bg-slate-950 border-2 border-slate-800 shadow-2xl">
                <div className="relative pt-[56.25%]">
                  {typeof window !== 'undefined' && (
                    <ReactPlayer
                      url={DASHBOARD_VIDEO_URL}
                      width="100%"
                      height="100%"
                      className="absolute top-0 left-0"
                      controls={true}
                      light={false}
                      playing={false}
                      onError={(error) => {
                        console.error("ReactPlayer error:", error);
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Career Timeline Projection */}
        {!isEnrolled && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 relative overflow-hidden rounded-3xl bg-slate-900/80 backdrop-blur-sm border border-slate-800 p-8 md:p-10 shadow-xl"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl shadow-lg">
                  <TrendingUp className="w-7 h-7 text-white" />
            </div>
                <div>
                  <h2 className="text-3xl font-bold text-white mb-1">Your Career Timeline Projection</h2>
                  <p className="text-slate-400 text-base">Start today and see your transformation journey</p>
          </div>
        </div>

              <div className="grid md:grid-cols-3 gap-6">
                {(() => {
                  const today = new Date();
                  const profileReadyDate = new Date(today);
                  profileReadyDate.setDate(today.getDate() + 21);
                  
                  const interviewReadyDate = new Date(today);
                  interviewReadyDate.setDate(today.getDate() + 90);
                  
                  const dreamJobDate = new Date(today);
                  dreamJobDate.setDate(today.getDate() + 150);

                  const milestones = [
                    {
                      title: "Profile Built",
                      date: profileReadyDate,
                      days: 21,
                      description: "Resume optimized, LinkedIn updated, portfolio live",
                      icon: <Briefcase className="w-6 h-6" />,
                      gradient: "from-blue-500 to-cyan-500",
                      bgGradient: "bg-gradient-to-br from-blue-900/30 to-cyan-900/30",
                      borderColor: "border-blue-500/50",
                      textColor: "text-blue-400"
                    },
                    {
                      title: "Interview Ready",
                      date: interviewReadyDate,
                      days: 90,
                      description: "Technical skills mastered, mock interviews completed",
                      icon: <CheckCircle className="w-6 h-6" />,
                      gradient: "from-purple-500 to-pink-500",
                      bgGradient: "bg-gradient-to-br from-purple-900/30 to-pink-900/30",
                      borderColor: "border-purple-500/50",
                      textColor: "text-purple-400"
                    },
                    {
                      title: "Dream Job",
                      date: dreamJobDate,
                      days: 150,
                      description: "Multiple offers, salary negotiation, placement secured",
                      icon: <Rocket className="w-6 h-6" />,
                      gradient: "from-green-500 to-emerald-500",
                      bgGradient: "bg-gradient-to-br from-green-900/30 to-emerald-900/30",
                      borderColor: "border-green-500/50",
                      textColor: "text-green-400"
                    }
                  ];

                  return milestones.map((milestone, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.2 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                      className={`relative ${milestone.bgGradient} border-2 ${milestone.borderColor} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all`}
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
                      <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                          <div className={`p-2 bg-gradient-to-br ${milestone.gradient} rounded-lg text-white shadow-md`}>
                            {milestone.icon}
                          </div>
                          <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 bg-slate-900/50 rounded border ${milestone.borderColor} ${milestone.textColor}`}>
                            Milestone
                          </span>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3">{milestone.title}</h3>
                        <div className="mb-4">
                          <div className="text-4xl font-bold text-white mb-1">
                            {milestone.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </div>
                          <div className="text-sm text-slate-300">
                            {milestone.date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mb-4">
                          <div className="flex-1 h-2 bg-slate-900/50 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${((index + 1) / 3) * 100}%` }}
                              transition={{ duration: 1, delay: index * 0.2 }}
                              className={`h-full bg-gradient-to-r ${milestone.gradient} rounded-full shadow-sm`}
                            ></motion.div>
                          </div>
                          <span className="text-xs text-slate-400 font-mono font-bold">{milestone.days}d</span>
                        </div>
                        <p className="text-sm text-slate-300 leading-relaxed">{milestone.description}</p>
                      </div>
                    </motion.div>
                  ));
                })()}
              </div>

              <div className="mt-8 p-6 bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/30 rounded-2xl backdrop-blur-sm">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-5 h-5 text-blue-400" />
                      <span className="text-white font-bold text-lg">Starting Today</span>
                    </div>
                    <p className="text-slate-300 text-base">
                      Begin your journey now and transform your career in just <span className="font-bold text-white text-lg">5 months</span>
                    </p>
                  </div>
            <Link
                    to="/courses"
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-105 whitespace-nowrap text-base"
                  >
                    Start Your Journey →
                  </Link>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* Alerts & Banners */}
        <div className="space-y-8 mb-12">
          <FOMOBanner />
          <SmartApplaiCard isEnrolled={isEnrolled} />
        </div>

        {/* Smart Applai Banner for Non-Enrolled */}
        {!isEnrolled && (
          <div className="mb-12">
            <SmartApplaiBanner onGetAccessClick={handleGetAccessClick} theme="genai" />
          </div>
        )}

        {/* Start Your Course Today CTA */}
        {!isEnrolled && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-1 shadow-2xl"
          >
            <div className="bg-slate-950 rounded-[28px] p-8 md:p-12 relative">
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl opacity-50"></div>
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl opacity-50"></div>
              <div className="relative z-10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="flex-1 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-600/20 border-2 border-blue-500/30 mb-5">
                      <Target className="w-5 h-5 text-blue-300" />
                      <span className="text-blue-200 text-sm font-bold">Start Your Journey Today</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-5 leading-tight">
                      Transform Your Career in{" "}
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300">
                        2026
                      </span>
                    </h2>
                    <p className="text-blue-100 text-lg mb-8 leading-relaxed max-w-2xl">
                      Join thousands of students who are already building their future. Choose from our industry-leading programs and unlock unlimited placement opportunities.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                      <Link
                        to="/genai"
                        className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-110 flex items-center gap-2 text-base"
                      >
                        <Brain className="w-5 h-5" />
                        <span>GenAI Program</span>
            </Link>
            <Link
                        to="/aws"
                        className="px-8 py-4 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-110 flex items-center gap-2 text-base"
                      >
                        <Cloud className="w-5 h-5" />
                        <span>AWS Program</span>
                      </Link>
                      <Link
                        to="/devops"
                        className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-110 flex items-center gap-2 text-base"
                      >
                        <GitBranch className="w-5 h-5" />
                        <span>DevOps Program</span>
                      </Link>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="w-56 h-56 md:w-72 md:h-72 relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl opacity-50"></div>
                      <div className="relative w-full h-full bg-gradient-to-br from-blue-900/50 to-purple-900/50 rounded-full border-4 border-blue-500/30 flex items-center justify-center shadow-2xl">
                        <Rocket className="w-32 h-32 md:w-40 md:h-40 text-blue-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* Featured Courses */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-500/30">
                  <BookOpen className="w-6 h-6 text-purple-400" />
                </div>
                Featured Programs
              </h2>
              <p className="text-slate-400 text-base ml-14">
                {isEnrolled ? "Continue your learning journey" : "Explore our most popular programs"}
              </p>
            </div>
            <Link
              to="/courses"
              className="text-sm text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-blue-500/10 transition-all"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { to: "/genai", icon: Brain, title: "Master GenAI Stack", desc: "13 modules • 26 weeks • From Python to Quantum Computing", gradient: "from-cyan-500 to-blue-500", bgGradient: "bg-gradient-to-br from-cyan-900/40 to-blue-900/40", borderColor: "border-cyan-500/40", textColor: "text-cyan-400", badge: "EXCLUSIVE" },
              { to: "/aws", icon: Cloud, title: "AWS Cloud Platform", desc: "9 modules • 12-16 weeks • Complete AWS mastery", gradient: "from-orange-500 to-yellow-500", bgGradient: "bg-gradient-to-br from-orange-900/40 to-yellow-900/40", borderColor: "border-orange-500/40", textColor: "text-orange-400", badge: "CERTIFIED" },
              { to: "/devops", icon: GitBranch, title: "DevOps & SRE", desc: "18 modules • 20-24 weeks • End-to-end DevOps", gradient: "from-green-500 to-emerald-500", bgGradient: "bg-gradient-to-br from-green-900/40 to-emerald-900/40", borderColor: "border-green-500/40", textColor: "text-green-400", badge: "COMPLETE" }
            ].map((course, idx) => {
              const Icon = course.icon;
              return (
                <motion.div
                  key={course.to}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <Link
                    to={course.to}
                    className={`group relative overflow-hidden ${course.bgGradient} border-2 ${course.borderColor} rounded-2xl p-7 shadow-lg hover:shadow-xl transition-all block backdrop-blur-sm`}
                  >
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:blur-[60px] transition-all"></div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-5">
                        <div className={`p-3 bg-gradient-to-br ${course.gradient} rounded-xl text-white shadow-md`}>
                          <Icon className="w-7 h-7" />
                        </div>
                        <span className={`px-3 py-1 bg-slate-900/50 text-xs font-bold rounded-lg border ${course.borderColor} ${course.textColor}`}>
                          {course.badge}
                        </span>
                      </div>
                      <h3 className={`text-2xl font-bold text-white mb-3 group-hover:${course.textColor} transition-colors`}>
                        {course.title}
                      </h3>
                      <p className="text-slate-300 text-sm mb-5 leading-relaxed">
                        {course.desc}
                      </p>
                      <div className={`flex items-center gap-2 ${course.textColor} font-bold text-sm`}>
                        <span>Explore</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Metrics Grid */}
        {placementMetrics && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-lg border border-blue-500/30">
                  <BarChart3 className="w-7 h-7 text-blue-400" />
                </div>
                Placement Analytics
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Interviews Scheduled"
                value={placementMetrics.interviewsScheduled}
                subtext="Total Opportunities"
                icon={Calendar}
                colorClass="text-emerald-400"
                bgGradient="bg-gradient-to-br from-emerald-500 to-teal-500"
                borderColor="border-emerald-500/40"
              />
              <MetricCard
                title="Upcoming Interviews"
                value={placementMetrics.upcomingInterviews}
                subtext="Next 7 Days"
                icon={Clock}
                colorClass="text-blue-400"
                bgGradient="bg-gradient-to-br from-blue-500 to-indigo-500"
                borderColor="border-blue-500/40"
              />
              <MetricCard
                title="Rounds Cleared"
                value={placementMetrics.interviewRoundsCleared}
                subtext="Technical & HR"
                icon={CheckCircle}
                colorClass="text-purple-400"
                bgGradient="bg-gradient-to-br from-purple-500 to-fuchsia-500"
                borderColor="border-purple-500/40"
              />
              <MetricCard
                title="Offers Received"
                value={placementMetrics.totalOffersReceived}
                subtext="Waiting for Action"
                icon={DollarSign}
                colorClass="text-amber-400"
                bgGradient="bg-gradient-to-br from-amber-500 to-orange-500"
                borderColor="border-amber-500/40"
              />
            </div>
          </section>
        )}

        {/* Main Content Split */}
        {placementMetrics && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Journey */}
            <div className="lg:col-span-2 space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-500/30">
                    <Rocket className="w-7 h-7 text-purple-400" />
                  </div>
                  Your Journey
                </h2>
                {isEnrolled && (
                  <span className="text-xs font-bold px-4 py-2 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border-2 border-green-500/40 shadow-md">
                    On Track
                  </span>
                )}
              </div>
              <div className="bg-slate-900/80 backdrop-blur-sm border-2 border-slate-800 rounded-3xl p-2 shadow-xl">
                <div className="bg-slate-950/50 rounded-[24px] p-6 sm:p-8">
                  <PlacementRoadmap
                    steps={[
                      {
                        id: "career-counselling",
                        title: "Career Counselling",
                        description: "Guiding aspirant to choose the best suitable tech stack.",
                        status: "pending",
                        icon: <Target className="w-5 h-5" />,
                        team: "Counselling Team",
                      },
                      {
                        id: "technical-training",
                        title: "Technical Training",
                        description: isEnrolled
                          ? "Mastering full-stack development through hands-on curriculum."
                          : "Master cutting-edge technologies through structured curriculum.",
                        status: isEnrolled ? "active" : "pending",
                        icon: <GraduationCap className="w-5 h-5" />,
                        team: "Mentors Team",
                        metrics: isEnrolled ? [{ label: "Modules", value: stats.enrollments || 0 }] : undefined,
                      },
                      {
                        id: "soft-skills",
                        title: "Soft Skills & Comm.",
                        description: isEnrolled
                          ? `Mock interviews completed: ${placementMetrics.mockInterviewsCompleted}`
                          : "Develop essential communication skills.",
                        status: isEnrolled && placementMetrics.mockInterviewsCompleted > 0 ? "completed" : isEnrolled ? "active" : "pending",
                        icon: <Users className="w-5 h-5" />,
                        team: "Mentors Team",
                        metrics: isEnrolled ? [{ label: "Score", value: `${placementMetrics.softSkillsScore}%` }] : undefined,
                      },
                      {
                        id: "projects",
                        title: "Portfolio Building",
                        description: isEnrolled
                          ? "Building industry-standard projects for Github."
                          : "Create real-world projects to showcase expertise.",
                        status: isEnrolled ? "active" : "pending",
                        icon: <Folder className="w-5 h-5" />,
                        team: "HR Team",
                      },
                      {
                        id: "smart-applai",
                        title: "Smart Applai Auto-Apply",
                        description: isEnrolled
                          ? `${placementMetrics.applicationsSubmitted} apps sent. 24/7 active hunting.`
                          : "Automated system applies to hundreds of jobs 24/7.",
                        status: isEnrolled && placementMetrics.applicationsSubmitted > 0 ? "active" : isEnrolled ? "active" : "pending",
                        icon: <Globe className="w-5 h-5" />,
                        team: "Product Team",
                        metrics: isEnrolled ? [{ label: "Applied", value: placementMetrics.applicationsSubmitted }] : undefined,
                      },
                      {
                        id: "profile",
                        title: "Profile Optimization",
                        description: "ATS-optimized resume and LinkedIn makeover.",
                        status: isEnrolled && placementMetrics.profileOptimized ? "completed" : isEnrolled ? "active" : "pending",
                        icon: <BarChart3 className="w-5 h-5" />,
                        team: "HR Team",
                        metrics: isEnrolled ? [{ label: "Resume", value: `${placementMetrics.resumeQuality}%` }] : undefined,
                      },
                      {
                        id: "mock-interviews",
                        title: "Mock Interviews",
                        description: "Preparing you to crack interviews confidently",
                        status: isEnrolled && placementMetrics.mockInterviewsCompleted > 0 ? "active" : "pending",
                        icon: <Users className="w-5 h-5" />,
                        team: "Placement Cell",
                        metrics: isEnrolled ? [{ label: "Completed", value: placementMetrics.mockInterviewsCompleted }] : undefined,
                      },
                      {
                        id: "offers",
                        title: "Offers & Negotiation",
                        description: "Final stage salary negotiation support.",
                        status: isEnrolled && placementMetrics.totalOffersReceived > 0 ? "completed" : isEnrolled && placementMetrics.interviewsScheduled > 0 ? "active" : "pending",
                        icon: <Rocket className="w-5 h-5" />,
                        team: "Placement Cell",
                      },
                    ]}
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Widgets */}
            <div className="space-y-6">
              {isEnrolled && (
                <div className="bg-slate-900/80 backdrop-blur-sm border-2 border-slate-800 rounded-2xl p-6 shadow-lg">
                  <h3 className="font-bold text-white mb-5 flex items-center gap-2 text-lg">
                    <BookOpen className="w-6 h-6 text-blue-400" />
                    Quick Access
              </h3>
                  <div className="space-y-3">
                    {[
                      { to: "/genai", icon: Brain, label: "GenAI Program", color: "cyan" },
                      { to: "/aws", icon: Cloud, label: "AWS Program", color: "orange" },
                      { to: "/devops", icon: GitBranch, label: "DevOps Program", color: "green" }
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.to}
                          to={item.to}
                          className="flex items-center gap-3 p-4 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-all group border border-slate-700/50 hover:border-blue-500/50 hover:shadow-lg"
                        >
                          <Icon className={`w-6 h-6 text-${item.color}-400`} />
                          <span className="text-base text-slate-300 flex-1 font-medium">{item.label}</span>
                          <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-2 transition-all" />
            </Link>
                      );
                    })}
          </div>
        </div>
              )}

              {!isEnrolled && (
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-white shadow-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="w-6 h-6 text-yellow-300" />
                    <h3 className="text-2xl font-bold">Start Today!</h3>
                  </div>
                  <p className="text-blue-100 text-sm mb-6 leading-relaxed">
                    Enroll now to activate Smart Applai, get a dedicated HR manager, and unlock your placement journey.
                  </p>
                <Link
                    to="/courses"
                    className="block w-full text-center px-4 py-3.5 bg-white text-blue-700 font-bold rounded-xl hover:bg-blue-50 transition-all shadow-lg hover:scale-105 transform text-base"
                  >
                    Browse All Programs
                  </Link>
                  <Rocket className="absolute -bottom-8 -right-8 w-40 h-40 text-white opacity-10 rotate-[-15deg]" />
                    </div>
              )}

              {/* Profile Health Widget */}
              <div className="bg-slate-900/80 backdrop-blur-sm border-2 border-slate-800 rounded-2xl p-6 shadow-lg">
                <h3 className="font-bold text-white mb-6 flex items-center gap-2 text-lg">
                  <Briefcase className="w-6 h-6 text-blue-400" />
                  Profile Health
                  </h3>
                
                <div className="relative pt-2 pb-6 flex flex-col items-center">
                  <div className="relative w-36 h-36 flex items-center justify-center mb-3">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="72" cy="72" r="64" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-slate-800" />
                      <circle cx="72" cy="72" r="64" stroke="currentColor" strokeWidth="10" fill="transparent" strokeDasharray={402.12} strokeDashoffset={402.12 - (402.12 * placementMetrics.resumeQuality) / 100} className="text-blue-500 transition-all duration-1000 ease-out" strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-bold text-white">{placementMetrics.resumeQuality}%</span>
                      <span className="text-xs text-slate-400 font-medium">Quality</span>
                    </div>
                  </div>
                  <p className="text-sm text-center text-slate-300 max-w-[220px] leading-relaxed">
                    {placementMetrics.resumeQuality >= 80 ? "Excellent work! Your profile is ready for top-tier companies." : "Keep optimizing your profile to unlock more opportunities."}
                  </p>
                </div>
                <div className="space-y-3 pt-4 border-t-2 border-slate-800">
                  {[
                    { label: "Resume Optimized", active: placementMetrics.resumeOptimized },
                    { label: "LinkedIn Verified", active: placementMetrics.linkedinOptimized },
                    { label: "Portfolio Live", active: isEnrolled },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="text-slate-300 font-medium">{item.label}</span>
                      <span className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold ${item.active ? "bg-blue-500/20 text-blue-300 border border-blue-500/40" : "bg-slate-800 text-slate-500 border border-slate-700"}`}>
                        <div className={`w-2 h-2 rounded-full ${item.active ? "bg-blue-400 animate-pulse" : "bg-slate-500"}`} />
                        {item.active ? "Ready" : "Pending"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Learning Stats */}
              <div className="bg-slate-900/80 backdrop-blur-sm border-2 border-slate-800 rounded-2xl p-6 flex items-center justify-between shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl border border-indigo-500/30 shadow-md">
                    <GraduationCap className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-400 font-medium">Certifications</div>
                    <div className="text-2xl font-bold text-white">{stats.certifications || 0} <span className="text-base font-normal text-slate-500">earned</span></div>
                  </div>
                </div>
              </div>

              {/* Dedicated SPOCs Widget */}
              <div className="bg-slate-900/80 backdrop-blur-sm border-2 border-slate-800 rounded-2xl overflow-hidden shadow-lg">
                <div className="bg-gradient-to-r from-slate-800/60 to-slate-800/40 p-4 border-b-2 border-slate-800 flex items-center justify-between">
                  <h3 className="font-bold text-white text-lg">Dedicated SPOCs</h3>
                  <span className="text-[10px] font-bold bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full border-2 border-blue-500/40">TEAMS</span>
                </div>
                <div className="p-6 space-y-4">
                  {[
                    { team: "Counselling Team", icon: Target, bgClass: "bg-purple-500/20", borderClass: "border-purple-500/30", iconClass: "text-purple-400" },
                    { team: "Mentors Team", icon: GraduationCap, bgClass: "bg-blue-500/20", borderClass: "border-blue-500/30", iconClass: "text-blue-400" },
                    { team: "HR Team", icon: Briefcase, bgClass: "bg-cyan-500/20", borderClass: "border-cyan-500/30", iconClass: "text-cyan-400" },
                    { team: "Product Team", icon: Zap, bgClass: "bg-yellow-500/20", borderClass: "border-yellow-500/30", iconClass: "text-yellow-400" },
                    { team: "Placement Cell", icon: Rocket, bgClass: "bg-green-500/20", borderClass: "border-green-500/30", iconClass: "text-green-400" },
                  ].map((teamItem, idx) => {
                    const Icon = teamItem.icon;
                    return (
                      <motion.div
                        key={teamItem.team}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-slate-600 transition-all"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${teamItem.bgClass} border ${teamItem.borderClass}`}>
                              <Icon className={`w-5 h-5 ${teamItem.iconClass}`} />
                            </div>
                            <div>
                              <div className="font-bold text-white text-sm">{teamItem.team}</div>
                              <div className="text-xs text-slate-400">Single Point of Contact</div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/50 border border-slate-700/50">
                          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-500">
                            ?
                          </div>
                          <div className="flex-1">
                            <div className="text-xs font-medium text-slate-500">Unassigned</div>
                            <div className="text-[10px] text-slate-600">SPOC will be assigned soon</div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
