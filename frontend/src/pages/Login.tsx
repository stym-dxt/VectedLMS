import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth";
import { AuthLayout } from "@/components/AuthLayout";
import { auth, isFirebaseConfigured } from "@/lib/firebase";
import type { ConfirmationResult } from "firebase/auth";

type Step = "phone" | "otp";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<Step>("phone");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const confirmationRef = useRef<ConfirmationResult | null>(null);
  const recaptchaRef = useRef<HTMLDivElement>(null);
  const { login, loginWithPhone } = useAuthStore();
  const navigate = useNavigate();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Login failed. Please check your credentials.");
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
      if (!recaptchaRef.current || !auth) return;
      const recaptchaVerifier = new RecaptchaVerifier(auth, recaptchaRef.current, { size: "invisible" });
      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
      confirmationRef.current = confirmation;
      setStep("otp");
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
      const status = err.response?.status;
      const detail = err.response?.data?.detail;
      if (status === 404 || (detail && String(detail).toLowerCase().includes("not registered"))) {
        setError("This number isn't registered. Sign up first to create an account.");
      } else {
        setError(detail || err.message || "Invalid code. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const loadingSpinner = (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );

  const inputClass =
    "w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all";
  const btnClass =
    "w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg shadow-blue-600/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center";

  return (
    <AuthLayout
      title="Sign in"
      subtitle="Use your phone or email to continue"
      footerPrompt="Don't have an account?"
      footerLinkText="Sign up"
      footerLinkTo="/register"
    >
      <div ref={recaptchaRef} id="recaptcha-container" className="sr-only" aria-hidden="true" />

      {error && (
        <div className="mb-6 bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-sm">
          {error}
          {error.includes("isn't registered") && (
            <p className="mt-2">
              <Link to="/register" className="font-medium text-blue-300 hover:text-blue-200 underline">
                Sign up with your phone
              </Link>
            </p>
          )}
        </div>
      )}

      {/* Phone sign-in */}
      <div className="mb-8">
        <h3 className="text-sm font-medium text-slate-400 mb-3">Sign in with phone</h3>
        {step === "phone" && (
          <div className="space-y-4">
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={inputClass}
              placeholder="+91 98765 43210"
            />
            <p className="text-xs text-slate-500">We'll send a one-time code via SMS.</p>
            <button type="button" onClick={sendOtp} disabled={loading} className={btnClass}>
              {loading ? <>{loadingSpinner} Sending...</> : "Send code"}
            </button>
          </div>
        )}
        {step === "otp" && (
          <form className="space-y-4" onSubmit={verifyOtp}>
            <p className="text-sm text-slate-400">Code sent to {phone}</p>
            <input
              id="otp"
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              className={`${inputClass} text-center text-lg tracking-widest`}
              placeholder="000000"
            />
            <button type="submit" disabled={loading || otp.length !== 6} className={btnClass}>
              {loading ? <>{loadingSpinner} Verifying...</> : "Verify & sign in"}
            </button>
            <button
              type="button"
              onClick={() => { setStep("phone"); setOtp(""); setError(""); confirmationRef.current = null; }}
              className="w-full text-sm text-slate-400 hover:text-white"
            >
              Use a different number
            </button>
          </form>
        )}
      </div>

      {/* Divider */}
      <div className="relative mb-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-700" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-3 bg-slate-900/80 text-slate-500">or</span>
        </div>
      </div>

      {/* Email sign-in */}
      <div>
        <h3 className="text-sm font-medium text-slate-400 mb-3">Sign in with email</h3>
        <form className="space-y-4" onSubmit={handleEmailSubmit}>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            placeholder="you@example.com"
          />
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
            placeholder="Password"
          />
          <div className="text-right">
            <Link to="/forgot-password" className="text-sm text-blue-400 hover:text-blue-300">Forgot password?</Link>
          </div>
          <button type="submit" disabled={loading} className={btnClass}>
            {loading ? <>{loadingSpinner} Signing in...</> : "Sign in with email"}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}
