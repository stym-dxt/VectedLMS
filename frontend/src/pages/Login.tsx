import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth";
import { Sparkles } from "@/components/Sparkles";
import { auth, isFirebaseConfigured } from "@/lib/firebase";
import type { ConfirmationResult } from "firebase/auth";

type LoginMode = "email" | "phone";

export default function Login() {
  const [mode, setMode] = useState<LoginMode>("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const confirmationRef = useRef<ConfirmationResult | null>(null);
  const recaptchaRef = useRef<HTMLDivElement>(null);
  const { login, loginWithPhone } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (mode === "phone") {
      setError("");
      setOtpSent(false);
      setOtp("");
      setPhone("");
      confirmationRef.current = null;
    }
  }, [mode]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
          "Login failed. Please check your credentials.",
      );
    } finally {
      setLoading(false);
    }
  };

  const sendOtp = async () => {
    if (!auth || !isFirebaseConfigured) {
      setError("Phone login is not configured. Use email to sign in.");
      return;
    }
    const raw = phone.trim().replace(/\s/g, "");
    const phoneNumber = raw.startsWith("+") ? raw : `+91${raw}`;
    if (phoneNumber.length < 10) {
      setError("Enter a valid phone number with country code (e.g. +91 98765 43210).");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const { RecaptchaVerifier, signInWithPhoneNumber } = await import("firebase/auth");
      if (!recaptchaRef.current) return;
      const recaptchaVerifier = new RecaptchaVerifier(
        recaptchaRef.current,
        { size: "invisible" },
        () => {},
      );
      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
      confirmationRef.current = confirmation;
      setOtpSent(true);
      setOtp("");
    } catch (err: any) {
      setError(err.message || "Failed to send OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmationRef.current || !otp.trim()) return;
    setError("");
    setLoading(true);
    try {
      const result = await confirmationRef.current.confirm(otp);
      const idToken = await result.user.getIdToken();
      await loginWithPhone(idToken);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || "Invalid code. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const loadingSpinner = (
    <svg
      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950 relative overflow-hidden flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`, backgroundSize: "40px 40px" }} />
      </div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
      <Sparkles colors={{ first: "#60a5fa", second: "#818cf8" }} count={40} speed={0.8} minSize={3} maxSize={8} className="opacity-40" />

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl shadow-2xl p-8 md:p-10">
          <div className="text-center mb-8">
            <Link to="/" className="inline-block mb-4">
              <h1 className="text-2xl font-semibold text-white">Vector Skill Academy</h1>
            </Link>
            <h2 className="text-3xl md:text-4xl font-semibold text-white mb-2">Welcome Back</h2>
            <p className="text-slate-400 text-sm">Sign in to continue your learning journey</p>
          </div>

          {/* Tabs */}
          <div className="flex rounded-lg bg-slate-800/50 p-1 mb-6">
            <button
              type="button"
              onClick={() => setMode("email")}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${mode === "email" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"}`}
            >
              Email
            </button>
            <button
              type="button"
              onClick={() => setMode("phone")}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${mode === "phone" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"}`}
            >
              Phone (OTP)
            </button>
          </div>

          {error && (
            <div className="mb-6 bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* reCAPTCHA container for phone (invisible) */}
          {mode === "phone" && <div ref={recaptchaRef} id="recaptcha-container" />}

          {mode === "email" && (
            <form className="space-y-6" onSubmit={handleEmailSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">Email address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter your password"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg shadow-blue-600/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? <>{loadingSpinner} Signing in...</> : "Sign in"}
              </button>
            </form>
          )}

          {mode === "phone" && !otpSent && (
            <div className="space-y-4">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-slate-300 mb-2">Phone number</label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="+91 98765 43210"
                />
                <p className="mt-1 text-xs text-slate-500">Include country code. OTP will be sent via SMS.</p>
              </div>
              <button
                type="button"
                onClick={sendOtp}
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg shadow-blue-600/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? <>{loadingSpinner} Sending...</> : "Send OTP"}
              </button>
            </div>
          )}

          {mode === "phone" && otpSent && (
            <form className="space-y-4" onSubmit={verifyOtp}>
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-slate-300 mb-2">Enter 6-digit code</label>
                <input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-center text-lg tracking-widest"
                  placeholder="000000"
                />
              </div>
              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg shadow-blue-600/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? <>{loadingSpinner} Verifying...</> : "Verify & sign in"}
              </button>
              <button
                type="button"
                onClick={() => { setOtpSent(false); setOtp(""); confirmationRef.current = null; }}
                className="w-full text-sm text-slate-400 hover:text-white"
              >
                Use a different number
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-400">
              Don't have an account?{" "}
              <Link to="/register" className="font-medium text-blue-400 hover:text-blue-300 transition-colors">Sign up</Link>
            </p>
            <div className="mt-4 pt-4 border-t border-slate-800">
              <Link to="/" className="text-sm text-slate-500 hover:text-slate-400 transition-colors">← Back to home</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
