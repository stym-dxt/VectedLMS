import { Outlet, Link } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "@/store/auth";

export default function Layout() {
  const { isAuthenticated, user, logout, initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950">
      <nav className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-semibold text-white">
                Vector Skill Academy
              </Link>
            </div>
            <div className="flex items-center space-x-6">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/genai"
                    className="text-slate-300 hover:text-white text-sm font-medium transition-colors"
                  >
                    GenAI
                  </Link>
                  <Link
                    to="/aws"
                    className="text-slate-300 hover:text-white text-sm font-medium transition-colors"
                  >
                    AWS
                  </Link>
                  <Link
                    to="/devops"
                    className="text-slate-300 hover:text-white text-sm font-medium transition-colors"
                  >
                    DevOps
                  </Link>
                  <Link
                    to="/courses"
                    className="text-slate-300 hover:text-white text-sm font-medium transition-colors"
                  >
                    Explore
                  </Link>
                  <Link
                    to="/login"
                    className="text-slate-300 hover:text-white text-sm font-medium transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/dashboard"
                    className="text-slate-300 hover:text-white text-sm font-medium transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/genai"
                    className="text-slate-300 hover:text-white text-sm font-medium transition-colors"
                  >
                    GenAI
                  </Link>
                  <Link
                    to="/aws"
                    className="text-slate-300 hover:text-white text-sm font-medium transition-colors"
                  >
                    AWS
                  </Link>
                  <Link
                    to="/devops"
                    className="text-slate-300 hover:text-white text-sm font-medium transition-colors"
                  >
                    DevOps
                  </Link>
                  <Link
                    to="/courses"
                    className="text-slate-300 hover:text-white text-sm font-medium transition-colors"
                  >
                    Courses
                  </Link>
                  <Link
                    to="/live-classes"
                    className="text-slate-300 hover:text-white text-sm font-medium transition-colors"
                  >
                    Live Classes
                  </Link>
                  <Link
                    to="/career"
                    className="text-slate-300 hover:text-white text-sm font-medium transition-colors"
                  >
                    Career
                  </Link>
                  {user?.role === "admin" && (
                    <Link
                      to="/admin"
                      className="text-purple-300 hover:text-purple-200 text-sm font-medium transition-colors"
                    >
                      Admin
                    </Link>
                  )}
                  <span className="text-slate-400 text-sm">
                    {user?.full_name || user?.email}
                  </span>
                  <button
                    onClick={logout}
                    className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
