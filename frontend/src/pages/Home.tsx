import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/auth";
import { Sparkles } from "@/components/Sparkles";
import { StarsBackground } from "@/components/StarsBackground";

export default function Home() {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    window.location.href = "/dashboard";
    return null;
  }

  const benefits = [
    {
      icon: "🎥",
      title: "Online & Offline Classes",
      description:
        "Flexible learning modes with recorded sessions available for revision anytime you miss a class.",
    },
    {
      icon: "💼",
      title: "Dedicated HR Support",
      description:
        "Our HR team with IT expertise applies for jobs on your behalf—no more job hunting stress.",
    },
    {
      icon: "📊",
      title: "Bi-weekly Assessments",
      description:
        "Regular self-evaluation every 15 days to track progress and optimize your learning journey.",
    },
    {
      icon: "🎯",
      title: "1:1 Mock Interviews",
      description:
        "Personalized mock interviews until you're confident enough to ace any real interview.",
    },
    {
      icon: "🗣️",
      title: "Soft Skills Training",
      description:
        "Business communication sessions to showcase your technical expertise effectively in interviews.",
    },
    {
      icon: "🌟",
      title: "Masterclasses on Core Skills",
      description:
        "Learn DevOps, Microservices, SDLC, GenAI, Git, and more—become a 360° tech professional.",
    },
    {
      icon: "🤝",
      title: "Weekend Doubt Sessions",
      description:
        "One-on-one sessions with mentors to clear any learning hurdles and revise difficult topics.",
    },
    {
      icon: "👨‍🏫",
      title: "Industry Expert Trainers",
      description:
        "Handpicked trainers with real IT industry experience to guide you with practical knowledge.",
    },
    {
      icon: "⏸️",
      title: "Pause & Continue",
      description:
        "Life happens. Pause your learning whenever needed and resume from where you left off.",
    },
    {
      icon: "📱",
      title: "Mobile App Access",
      description:
        "Learn on-the-go with our mobile app—access courses, attend classes, and track progress anytime.",
    },
    {
      icon: "🎓",
      title: "Industry-Recognized Certificates",
      description:
        "Get certified after course completion—boost your resume and stand out to employers.",
    },
    {
      icon: "🏆",
      title: "Lifetime Placement Support",
      description:
        "Our commitment doesn't end after placement. Get support for career growth and job transitions.",
    },
  ];

  const courses = [
    "Full Stack Development",
    "DevOps Engineering",
    "Data Science & AI",
    "Cloud Computing",
    "Cybersecurity",
    "Machine Learning",
    "React Native",
    "Python Django",
    "Fullstack with AI",
    "Data Engineering with AI",
  ];

  const keyHighlights = [
    {
      number: "1 Year",
      text: "Placement Support",
      color: "from-blue-500 to-cyan-500",
    },
    {
      number: "15%",
      text: "CTC After Placement",
      color: "from-green-500 to-emerald-500",
    },
    {
      number: "0%",
      text: "EMI Available",
      color: "from-purple-500 to-pink-500",
    },
    {
      number: "24/7",
      text: "Access to Recordings",
      color: "from-orange-500 to-red-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950 relative">
      {/* Fixed Background - Behind everything */}
      <div
        className="fixed inset-0"
        style={{
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        {/* Gradient Background */}
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_#1e3a8a_0%,_#0f172a_50%,_#000_100%)]"
          style={{
            opacity: 0.8,
            pointerEvents: "none",
          }}
        />

        {/* Stars Background - Optimized */}
        <StarsBackground
          starColor="#60a5fa"
          factor={0.0005}
          speed={30}
        />

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: "40px 40px",
            pointerEvents: "none",
          }}
        />

        {/* Gradient Orbs */}
        <div
          className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"
          style={{ pointerEvents: "none" }}
        />
        <div
          className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl"
          style={{ pointerEvents: "none" }}
        />

        {/* Sparkles */}
        <div style={{ pointerEvents: "none" }}>
          <Sparkles
            colors={{ first: "#60a5fa", second: "#818cf8" }}
            count={60}
            speed={0.8}
            minSize={3}
            maxSize={10}
            className="opacity-60"
          />
        </div>
      </div>

      {/* Content - Interactive */}
      <div
        className="relative"
        style={{
          zIndex: 1,
          position: "relative",
        }}
      >
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-5xl md:text-7xl font-light text-white mb-6 tracking-tight">
                Launch Your Tech Career with
                <span className="block mt-2 font-semibold bg-gradient-to-r from-blue-400 via-white to-blue-400 bg-clip-text text-transparent">
                  Zero Risk, Maximum Impact
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-light mb-8">
                Industry-leading training with{" "}
                <span className="text-blue-400 font-medium">
                  Pay-After-Placement
                </span>
                . Get placed first, pay later—15% of CTC only after you land
                your dream job.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg shadow-blue-600/30 text-lg"
                >
                  Start Your Journey
                </Link>
                <Link
                  to="/courses"
                  className="px-10 py-4 bg-transparent border-2 border-white/20 hover:border-white/30 text-white font-semibold rounded-lg transition-all duration-200 text-lg"
                >
                  Explore Courses
                </Link>
              </div>
            </div>

            {/* Key Highlights */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
              {keyHighlights.map((highlight, index) => (
                <div
                  key={index}
                  className="bg-slate-900/40 backdrop-blur-sm border border-slate-800/50 rounded-xl p-6 text-center"
                >
                  <div
                    className={`text-3xl md:text-4xl font-bold bg-gradient-to-r ${highlight.color} bg-clip-text text-transparent mb-2`}
                  >
                    {highlight.number}
                  </div>
                  <div className="text-sm text-slate-400">{highlight.text}</div>
                </div>
              ))}
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  10,000+
                </div>
                <div className="text-lg text-slate-400">Students Trained</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  95%+
                </div>
                <div className="text-lg text-slate-400">Placement Rate</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  500+
                </div>
                <div className="text-lg text-slate-400">Companies</div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/30 backdrop-blur-sm relative">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-semibold text-white text-center mb-12">
              Why Choose{" "}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Vector Skill Academy?
              </span>
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-all"
                >
                  <div className="text-4xl mb-4">{benefit.icon}</div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-slate-400 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured GenAI Course Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-gradient-to-br from-cyan-900/40 via-blue-900/40 to-purple-900/40 border-2 border-cyan-500/30 rounded-2xl p-8 md:p-12 mb-16 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.1),transparent)]"></div>
              <div className="relative z-10">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-1 text-center md:text-left">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-sm font-semibold mb-4">
                      Featured Program
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                      Master the Full{" "}
                      <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                        GenAI Stack
                      </span>
                    </h2>
                    <p className="text-lg md:text-xl text-slate-300 mb-6 leading-relaxed">
                      From Python Fundamentals to Autonomous Agents & Quantum Computing. 
                      Become a Certified GenAI Professional with our industry-first 26-week curriculum.
                    </p>
                    <div className="flex flex-wrap gap-4 mb-6">
                      <div className="px-4 py-2 bg-slate-900/50 rounded-lg border border-slate-700">
                        <span className="text-sm text-slate-400">Duration</span>
                        <div className="text-white font-semibold">26 Weeks</div>
                      </div>
                      <div className="px-4 py-2 bg-slate-900/50 rounded-lg border border-slate-700">
                        <span className="text-sm text-slate-400">Levels</span>
                        <div className="text-white font-semibold">13 Core Modules</div>
                      </div>
                    </div>
                    <Link
                      to="/genai"
                      className="inline-block px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold rounded-lg transition-all shadow-lg shadow-cyan-600/30 hover:shadow-cyan-600/50"
                    >
                      Explore GenAI Program
                    </Link>
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="w-64 h-64 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-2xl border border-cyan-500/30 flex items-center justify-center">
                      <div className="text-6xl">🧠</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Futuristic Courses Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-semibold text-white text-center mb-4">
              Cutting-Edge{" "}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Tech Courses
              </span>
            </h2>
            <p className="text-xl text-slate-400 text-center mb-12 max-w-2xl mx-auto">
              Master the technologies that shape tomorrow's digital landscape
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
              {courses.map((course, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-blue-900/30 to-indigo-900/30 border border-blue-800/30 rounded-xl p-6 text-center hover:border-blue-700/50 transition-all group"
                >
                  <div className="text-2xl mb-3">🚀</div>
                  <h3 className="text-lg font-medium text-white group-hover:text-blue-300 transition-colors">
                    {course}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Placement Support Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/30 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-semibold text-white mb-6">
                  Your Career Success is Our{" "}
                  <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                    Mission
                  </span>
                </h2>
                <p className="text-xl text-slate-300 mb-6 leading-relaxed">
                  We don't just train you—we place you. Our dedicated HR team
                  works round the clock to find the perfect opportunities for
                  you.
                </p>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">✅</span>
                    <span className="text-slate-300 text-lg">
                      Automated job application system
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">✅</span>
                    <span className="text-slate-300 text-lg">
                      Resume optimization and ATS compliance
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">✅</span>
                    <span className="text-slate-300 text-lg">
                      Interview scheduling and follow-ups
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">✅</span>
                    <span className="text-slate-300 text-lg">
                      Salary negotiation support
                    </span>
                  </li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border border-green-800/30 rounded-2xl p-8">
                <div className="text-6xl mb-6 text-center">💼</div>
                <div className="text-center space-y-4">
                  <div className="text-5xl font-bold text-white">1 Year</div>
                  <div className="text-xl text-slate-300">
                    Placement Support Guarantee
                  </div>
                  <div className="text-sm text-slate-400 mt-4">
                    We keep working until you're placed in your dream role
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Payment Model CTA */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-br from-blue-900/50 to-indigo-900/50 border border-blue-800/50 rounded-2xl p-12">
              <h2 className="text-4xl md:text-5xl font-semibold text-white mb-6">
                Pay Only After You're{" "}
                <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  Placed
                </span>
              </h2>
              <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                Zero upfront cost. Zero risk. Pay 15% of your first-year CTC
                only after you start working. If you don't get placed, you
                don't pay.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="inline-block px-10 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg shadow-green-600/30 text-lg"
                >
                  Enroll Now - Pay After Placement
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">
              Ready to Transform Your Career?
            </h2>
            <p className="text-lg text-slate-400 mb-8">
              Join thousands of students who've successfully launched their tech
              careers with us
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg shadow-blue-600/30 text-lg"
              >
                Get Started Today
              </Link>
              <Link
                to="/login"
                className="px-8 py-3.5 bg-transparent border border-slate-700 hover:border-slate-600 text-slate-200 font-medium rounded-lg transition-all duration-200 min-w-[200px]"
              >
                Already Enrolled? Login
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
