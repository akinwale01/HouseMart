"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  redirectUrl?: string;
  userType?: string;
  landlordType?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState<"customer" | "agent">("customer");
  const [landlordType, setLandlordType] = useState<"individual" | "agency">("individual");
  const [loading, setLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackType, setFeedbackType] = useState<"success" | "error">("success");
  const [showPassword, setShowPassword] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);

  const handleUserTypeChange = (type: "customer" | "agent") => {
    setUserType(type);
    setEmail("");
    setPassword("");
    if (type === "agent") setLandlordType("individual");
  };

  const handleLandlordTypeChange = (type: "individual" | "agency") => {
    setLandlordType(type);
    setEmail("");
    setPassword("");
  };

  const handleLogin = async () => {
    setFeedbackMessage("");

    if (!email || !password) {
      setFeedbackMessage("⚠️ Please enter your email and password.");
      setFeedbackType("error");
      return;
    }

    try {
      setLoading(true);

      const body = { email, password, userType, landlordType: userType === "agent" ? landlordType : undefined };
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data: LoginResponse = await res.json();

      if (!res.ok || !data.success || !data.token) {
        setFeedbackMessage(data.message || "❌ Login failed. Try again.");
        setFeedbackType("error");
        return;
      }

      const storage = keepLoggedIn ? localStorage : sessionStorage;
      storage.setItem("token", data.token);
      storage.setItem("userType", data.userType!);
      if (userType === "agent") storage.setItem("landlordType", landlordType);

      setFeedbackMessage("✅ Login successful! Redirecting...");
      setFeedbackType("success");

      setTimeout(() => {
        router.push(data.redirectUrl || "/dashboard");
      }, 1000);
    } catch (err) {
      console.error(err);
      setFeedbackMessage("❌ Server error. Please try again.");
      setFeedbackType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 relative">
      {feedbackMessage && (
        <div
          className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-lg text-white font-semibold text-center flex items-center gap-2 transform transition-all duration-500
          ${feedbackType === "success" ? "bg-linear-to-r from-green-400 to-green-600" : "bg-linear-to-r from-red-400 to-red-600"} animate-slideDown`}
          style={{ minWidth: "300px" }}
        >
          <span className="text-xl">{feedbackType === "success" ? "✅" : "❌"}</span>
          {feedbackMessage.replace("✅", "").replace("❌", "")}
        </div>
      )}

      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Welcome Back</h1>

        <div className="flex border rounded-xl overflow-hidden mb-4 shadow-sm">
          <button
            onClick={() => handleUserTypeChange("customer")}
            className={`flex-1 py-3 font-semibold transition-all ${userType === "customer" ? "bg-orange-500 text-white shadow-inner" : "bg-white text-gray-700 hover:bg-gray-100"}`}
          >
            Customer
          </button>
          <button
            onClick={() => handleUserTypeChange("agent")}
            className={`flex-1 py-3 font-semibold transition-all ${userType === "agent" ? "bg-orange-500 text-white shadow-inner" : "bg-white text-gray-700 hover:bg-gray-100"}`}
          >
            Landlord / Agent
          </button>
        </div>

        {userType === "agent" && (
          <div className="flex gap-3 mb-6">
            <button
              onClick={() => handleLandlordTypeChange("individual")}
              className={`flex-1 py-2 rounded-lg border font-medium transition ${landlordType === "individual" ? "bg-orange-100 border-orange-500 text-orange-600" : "bg-white hover:bg-gray-50"}`}
            >
              Individual Landlord
            </button>
            <button
              onClick={() => handleLandlordTypeChange("agency")}
              className={`flex-1 py-2 rounded-lg border font-medium transition ${landlordType === "agency" ? "bg-orange-100 border-orange-500 text-orange-600" : "bg-white hover:bg-gray-50"}`}
            >
              Agent / Agency
            </button>
          </div>
        )}

        <div className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 transition"
          />

          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" checked={keepLoggedIn} onChange={() => setKeepLoggedIn((v) => !v)} className="cursor-pointer" />
              Keep me logged in
            </label>
            <Link href="/forgot-password" className="text-sm text-orange-500 hover:text-orange-600 transition">
              Forgot Password?
            </Link>
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>

        <p className="text-center text-gray-600 mt-6 text-sm">
          Don’t have an account?{" "}
          <Link href="/signup" className="text-orange-500 hover:text-orange-600">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}