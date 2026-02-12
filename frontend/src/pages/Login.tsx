import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth";
import { AuthLayout } from "@/components/AuthLayout";
import { auth, isFirebaseConfigured } from "@/lib/firebase";
import type { ConfirmationResult } from "firebase/auth";

type LoginMode = "email" | "phone";

type Step = "phone" | "otp" | "complete"; // complete = new user, show form

export default function Login() {
  const [mode, setMode] = useState<LoginMode>("phone");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<Step>("phone");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const confirmationRef = useRef<ConfirmationResult | null>(null);
  const recaptchaRef = useRef<HTMLDivElement>(null);
  const { login, loginWithPhone, register } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (mode === "phone") {
      setError("");
      setStep("phone");
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
        setStep("complete");
        setError("");
      } else {
        setError(detail || err.message || "Invalid code. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const trimmedPhone = phone.trim().replace(/\s/g, "");
    const phoneForBackend = trimmedPhone.startsWith("+") ? trimmedPhone : `+91${trimmedPhone}`;
    if (email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        setError("Please enter a valid email address.");
        return;
      }
    }
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await register(phoneForBackend, password, fullName.trim() || undefined, email.trim() || undefined);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Could not create account. Try again.");
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
      title="Welcome"
      subtitle="Sign in or create an account with your phone"
      footerPrompt="Don't have an account?"
      footerLinkText="Sign up"
      footerLinkTo="/register"
    >
      <div className="flex rounded-lg bg-slate-800/50 p-1 mb-6">
        <button
          type="button"
          onClick={() => setMode("phone")}
          className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${mode === "phone" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"}`}
        >
          Phone
        </button>
        <button
          type="button"
          onClick={() => setMode("email")}
          className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${mode === "email" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"}`}
        >
          Email
        </button>
      </div>

      {error && (
        <div className="mb-6 bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {mode === "phone" && <div ref={recaptchaRef} id="recaptcha-container" />}

      {mode === "email" && (
        <form className="space-y-6" onSubmit={handleEmailSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">Email address</label>
            <input id="email" name="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="you@example.com" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">Password</label>
            <input id="password" name="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} placeholder="Enter your password" />
            <div className="mt-2 text-right">
              <Link to="/forgot-password" className="text-sm text-blue-400 hover:text-blue-300">Forgot password?</Link>
            </div>
          </div>
          <button type="submit" disabled={loading} className={btnClass}>
            {loading ? <>{loadingSpinner} Signing in...</> : "Sign in"}
          </button>
        </form>
      )}

      {mode === "phone" && step === "phone" && (
        <div className="space-y-4">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-slate-300 mb-2">Phone number</label>
            <input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} placeholder="+91 98765 43210" />
            <p className="mt-1 text-xs text-slate-500">Include country code. We'll send a one-time code via SMS.</p>
          </div>
          <button type="button" onClick={sendOtp} disabled={loading} className={btnClass}>
            {loading ? <>{loadingSpinner} Sending...</> : "Send code"}
          </button>
        </div>
      )}

      {mode === "phone" && step === "otp" && (
        <form className="space-y-4" onSubmit={verifyOtp}>
          <p className="text-sm text-slate-400">Code sent to {phone}. Enter it below.</p>
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-slate-300 mb-2">Verification code</label>
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
          </div>
          <button type="submit" disabled={loading || otp.length !== 6} className={btnClass}>
            {loading ? <>{loadingSpinner} Verifying...</> : "Verify & continue"}
          </button>
          <button type="button" onClick={() => { setStep("phone"); setOtp(""); confirmationRef.current = null; }} className="w-full text-sm text-slate-400 hover:text-white">
            Use a different number
          </button>
        </form>
      )}

      {mode === "phone" && step === "complete" && (
        <form className="space-y-4" onSubmit={handleCompleteAccount}>
          <p className="text-sm text-slate-300">This number isn't registered yet. Add a few details to create your account.</p>
          <div>
            <label htmlFor="complete-email" className="block text-sm font-medium text-slate-300 mb-2">Email <span className="text-slate-500">(optional)</span></label>
            <input id="complete-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="you@example.com" />
          </div>
          <div>
            <label htmlFor="complete-name" className="block text-sm font-medium text-slate-300 mb-2">Full name <span className="text-slate-500">(optional)</span></label>
            <input id="complete-name" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputClass} placeholder="Your name" />
          </div>
          <div>
            <label htmlFor="complete-password" className="block text-sm font-medium text-slate-300 mb-2">Password</label>
            <input id="complete-password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} placeholder="At least 6 characters" minLength={6} />
          </div>
          <div>
            <label htmlFor="complete-confirm" className="block text-sm font-medium text-slate-300 mb-2">Confirm password</label>
            <input id="complete-confirm" type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={inputClass} placeholder="Re-enter password" minLength={6} />
          </div>
          <button type="submit" disabled={loading} className={btnClass}>
            {loading ? <>{loadingSpinner} Creating account...</> : "Create account & continue"}
          </button>
        </form>
      )}
    </AuthLayout>
  );
}
