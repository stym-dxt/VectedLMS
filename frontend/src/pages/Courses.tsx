import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Brain, Cloud, GitBranch, Sparkles, Clock, BookOpen, ArrowRight } from "lucide-react";
import api from "@/lib/api";

interface Course {
  id: number;
  title: string;
  description: string;
  short_description: string | null;
  price: number;
  category: string | null;
}

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/courses")
      .then((response) => {
        setCourses(response.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950">
        <div className="text-slate-300">Loading courses...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-light text-white mb-4">
            Training Programs
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl">
            Explore our comprehensive catalog of IT and AI training programs
            designed to enhance your technical skills and advance your career.
          </p>
        </div>

        {/* Featured Programs */}
        <div className="mb-16">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-blue-400" />
            <h2 className="text-2xl font-semibold text-white">Featured Programs</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {/* GenAI Program */}
            <Link
              to="/genai"
              className="group relative overflow-hidden bg-gradient-to-br from-cyan-900/40 via-blue-900/40 to-purple-900/40 border-2 border-cyan-500/30 rounded-2xl p-6 hover:border-cyan-500/50 transition-all hover:shadow-[0_0_30px_rgba(6,182,212,0.3)]"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-cyan-500/20 rounded-xl">
                    <Brain className="w-6 h-6 text-cyan-400" />
                  </div>
                  <span className="px-2 py-1 bg-cyan-500/20 text-cyan-300 text-xs font-semibold rounded border border-cyan-500/30">
                    EXCLUSIVE
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                  Master GenAI Stack
                </h3>
                <p className="text-slate-300 text-sm mb-4 leading-relaxed">
                  From Python to Quantum Computing. 13 modules, 26 weeks of comprehensive GenAI training.
                </p>
                <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-3 h-3" />
                    <span>13 Modules</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>26 Weeks</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm">
                  <span>Explore Program</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            {/* AWS Program */}
            <Link
              to="/aws"
              className="group relative overflow-hidden bg-gradient-to-br from-orange-900/40 via-yellow-900/40 to-orange-900/40 border-2 border-orange-500/30 rounded-2xl p-6 hover:border-orange-500/50 transition-all hover:shadow-[0_0_30px_rgba(249,115,22,0.3)]"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-orange-500/20 rounded-xl">
                    <Cloud className="w-6 h-6 text-orange-400" />
                  </div>
                  <span className="px-2 py-1 bg-orange-500/20 text-orange-300 text-xs font-semibold rounded border border-orange-500/30">
                    CERTIFIED
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-300 transition-colors">
                  AWS Cloud Platform
                </h3>
                <p className="text-slate-300 text-sm mb-4 leading-relaxed">
                  Master AWS services from fundamentals to advanced. 9 modules covering all major AWS services.
                </p>
                <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-3 h-3" />
                    <span>9 Modules</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>12-16 Weeks</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-orange-400 font-semibold text-sm">
                  <span>Explore Program</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            {/* DevOps Program */}
            <Link
              to="/devops"
              className="group relative overflow-hidden bg-gradient-to-br from-green-900/40 via-emerald-900/40 to-green-900/40 border-2 border-green-500/30 rounded-2xl p-6 hover:border-green-500/50 transition-all hover:shadow-[0_0_30px_rgba(34,197,94,0.3)]"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-green-500/20 rounded-xl">
                    <GitBranch className="w-6 h-6 text-green-400" />
                  </div>
                  <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs font-semibold rounded border border-green-500/30">
                    COMPLETE
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-green-300 transition-colors">
                  DevOps & SRE
                </h3>
                <p className="text-slate-300 text-sm mb-4 leading-relaxed">
                  End-to-end DevOps mastery. CI/CD, Kubernetes, Terraform, and SRE practices in 18 modules.
                </p>
                <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-3 h-3" />
                    <span>18 Modules</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>20-24 Weeks</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-green-400 font-semibold text-sm">
                  <span>Explore Program</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Other Courses */}
        {courses.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold text-white mb-6">All Programs</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Link
                  key={course.id}
                  to={`/courses/${course.id}`}
                  className="group bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-lg p-6 hover:border-slate-700 transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="text-sm text-slate-500 uppercase tracking-wider">
                      Program
                    </div>
                    {course.price > 0 ? (
                      <div className="text-sm font-medium text-blue-400">
                        ₹{course.price.toLocaleString()}
                      </div>
                    ) : (
                      <div className="text-sm font-medium text-green-400">
                        Free
                      </div>
                    )}
                  </div>
                  <h2 className="text-xl font-medium text-white mb-3 group-hover:text-blue-400 transition-colors">
                    {course.title}
                  </h2>
                  <p className="text-slate-400 text-sm mb-4 line-clamp-3 leading-relaxed">
                    {course.short_description ||
                      course.description?.substring(0, 120)}
                    ...
                  </p>
                  <div className="flex justify-between items-center pt-4 border-t border-slate-800">
                    {course.category && (
                      <span className="text-xs text-slate-500 uppercase tracking-wider">
                        {course.category}
                      </span>
                    )}
                    <span className="text-sm text-blue-400 group-hover:text-blue-300 transition-colors">
                      View Details →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {courses.length === 0 && (
          <div className="text-center py-20">
            <p className="text-slate-400 text-lg">
              No additional courses available at this time. Please check back later.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
