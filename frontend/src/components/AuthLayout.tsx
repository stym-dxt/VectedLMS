import { Link } from "react-router-dom";
import { Sparkles } from "@/components/Sparkles";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footerPrompt: string;
  footerLinkText: string;
  footerLinkTo: string;
}

export function AuthLayout({
  title,
  subtitle,
  children,
  footerPrompt,
  footerLinkText,
  footerLinkTo,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950 relative overflow-hidden flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
      <Sparkles
        colors={{ first: "#60a5fa", second: "#818cf8" }}
        count={40}
        speed={0.8}
        minSize={3}
        maxSize={8}
        className="opacity-40"
      />

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl shadow-2xl p-8 md:p-10">
          <div className="text-center mb-8">
            <Link to="/" className="inline-block mb-4">
              <h1 className="text-2xl font-semibold text-white">Vector Skill Academy</h1>
            </Link>
            <h2 className="text-3xl md:text-4xl font-semibold text-white mb-2">{title}</h2>
            <p className="text-slate-400 text-sm">{subtitle}</p>
          </div>

          {children}

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-400">
              {footerPrompt}{" "}
              <Link to={footerLinkTo} className="font-medium text-blue-400 hover:text-blue-300 transition-colors">
                {footerLinkText}
              </Link>
            </p>
            <div className="mt-4 pt-4 border-t border-slate-800">
              <Link to="/" className="text-sm text-slate-500 hover:text-slate-400 transition-colors">
                ← Back to home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
