"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordHints, setPasswordHints] = useState({
    length: false,
    uppercase: false,
    number: false,
    special: false,
  });
  const [passwordStrength, setPasswordStrength] = useState<"Weak" | "Medium" | "Strong">("Weak");

  // ✅ Check password hints dynamically
  useEffect(() => {
    const length = newPassword.length >= 8;
    const uppercase = /[A-Z]/.test(newPassword);
    const number = /[0-9]/.test(newPassword);
    const special = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

    setPasswordHints({ length, uppercase, number, special });

    const fulfilled = [length, uppercase, number, special].filter(Boolean).length;
    setPasswordStrength(
      fulfilled <= 1 ? "Weak" : fulfilled === 2 || fulfilled === 3 ? "Medium" : "Strong"
    );
  }, [newPassword]);

  const generatePassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?";
    let pass = "";
    for (let i = 0; i < 12; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewPassword(pass);
  };

  const handleSendOtp = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return setFeedback("⚠️ Please enter your email.");
    setLoading(true);
    setFeedback("");
    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, purpose: "forgot-password" }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) setFeedback(data.message || "❌ Could not send OTP.");
      else {
        setFeedback("✅ OTP sent to your email!");
        setStep(2);
      }
    } catch {
      setFeedback("❌ Server error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: FormEvent) => {
    e.preventDefault();
    if (!otp) return setFeedback("⚠️ Please enter the OTP.");
    setLoading(true);
    setFeedback("");
    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, purpose: "forgot-password" }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) setFeedback(data.message || "❌ OTP verification failed.");
      else {
        setFeedback("✅ OTP verified! You can now reset your password.");
        setStep(3);
      }
    } catch {
      setFeedback("❌ Server error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Updated to call the correct route and send password/email at top level
  const handleUpdatePassword = async (e: FormEvent) => {
    e.preventDefault();
    if (!newPassword) return setFeedback("⚠️ Please enter a new password.");
    if (Object.values(passwordHints).some((v) => !v))
      return setFeedback("⚠️ Please fulfill all password requirements.");
    setLoading(true);
    setFeedback("");
    try {
      const res = await fetch("/api/update-forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,            // top-level email
          password: newPassword, // top-level password
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) setFeedback(data.message || "❌ Could not update password.");
      else {
        setFeedback("✅ Password updated successfully! Redirecting to login...");
        setTimeout(() => router.push("/login"), 1200);
      }
    } catch {
      setFeedback("❌ Server error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-50 p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 transform animate-card-appear">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center animate-fade-up">
          Reset Your Password
        </h1>

        {feedback && (
          <div
            className={`
              relative flex items-center justify-center gap-2 text-center p-4 mb-6 rounded-xl border transition-all duration-500 transform animate-feedback
              ${feedback.startsWith("✅") ? "bg-green-50 text-green-700 border-green-200 shadow-md before:absolute before:-left-3 before:top-1/2 before:-translate-y-1/2 before:w-3 before:h-3 before:rounded-full before:bg-green-500 before:animate-ping"
                : feedback.startsWith("⚠️") ? "bg-yellow-50 text-yellow-700 border-yellow-200 shadow-md"
                : "bg-red-50 text-red-700 border-red-200 shadow-md"}
            `}
          >
            <span className={`text-xl ${feedback.startsWith("✅") ? "animate-bounce" : ""}`}>
              {feedback.startsWith("✅") ? "🎉" : feedback.startsWith("⚠️") ? "⚠️" : "❌"}
            </span>
            <span className="ml-2 font-semibold text-sm animate-slide-in">{feedback.replace(/^✅|⚠️|❌/, "")}</span>
          </div>
        )}

        {/* Step Forms */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="flex flex-col gap-4 animate-step">
            <input
              type="email"
              placeholder="Enter your account email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 transition animate-input"
            />
            <button
              type="submit"
              disabled={loading}
              className="py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition disabled:opacity-50 animate-button"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4 animate-step">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 transition animate-input"
            />
            <button
              type="submit"
              disabled={loading}
              className="py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition disabled:opacity-50 animate-button"
            >
              {loading ? "Verifying OTP..." : "Verify OTP"}
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleUpdatePassword} className="flex flex-col gap-4 animate-step">
            <div className="relative w-full animate-input">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 animate-bounce"
              >
                {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
              </button>
            </div>

            <div className="flex flex-col gap-1 text-sm text-gray-700 mb-2 animate-text">
              {Object.entries(passwordHints).map(([key, fulfilled]) => {
                const hintText = {
                  length: "• Minimum 8 characters",
                  uppercase: "• At least 1 capital letter",
                  number: "• At least 1 number",
                  special: "• At least 1 special character",
                }[key];
                return (
                  <div key={key} className={`transition-colors duration-300 ${fulfilled ? "text-green-600 font-semibold animate-pulse" : ""}`}>
                    {hintText}
                  </div>
                );
              })}
            </div>

            <div className="text-sm font-semibold mb-2 animate-text">
              Strength:{" "}
              <span
                className={`transition-colors duration-500 ${
                  passwordStrength === "Weak" ? "text-red-600 animate-pulse"
                    : passwordStrength === "Medium" ? "text-yellow-600 animate-pulse"
                    : "text-green-600 animate-pulse"
                }`}
              >
                {passwordStrength}
              </span>
            </div>

            <button
              type="button"
              onClick={generatePassword}
              className="py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition animate-button"
            >
              Generate Strong Password
            </button>

            <button
              type="submit"
              disabled={loading}
              className="py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition disabled:opacity-50 animate-button"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}