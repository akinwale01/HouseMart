"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EyeIcon, EyeSlashIcon, CheckIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { getSession } from "next-auth/react";

export default function SignupPage() {
  const router = useRouter();
  const [userType, setUserType] = useState<"customer" | "agent">("customer");
  const [landlordType, setLandlordType] = useState<"individual" | "agency">("individual");
  const [step, setStep] = useState(1);
  const [resendTimer, setResendTimer] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [verifiedMessageShown, setVerifiedMessageShown] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [progress, setProgress] = useState(0);
  const [showGoogleSignup, setShowGoogleSignup] = useState(true);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    otp: "",
    agencyName: "",
    licenseNumber: "",
    picture: "",
  });

  const [passwordRules, setPasswordRules] = useState({
    length: false,
    uppercase: false,
    number: false,
    specialChar: false,
  });

  // Password validation
  useEffect(() => {
    const pwd = formData.password || "";
    setPasswordRules({
      length: pwd.length >= 8,
      uppercase: /[A-Z]/.test(pwd),
      number: /[0-9]/.test(pwd),
      specialChar: /[!@#$%^&*]/.test(pwd),
    });
  }, [formData.password]);

  // Resend timer
  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((s) => ({ ...s, [e.target.name]: e.target.value }));
    if (showGoogleSignup) setShowGoogleSignup(false);
  };

  const prevStep = () => setStep((p) => Math.max(1, p - 1));

// ==========================
// Google Signup
// ==========================
const handleGoogleSignup = async () => {
  setFeedbackMessage("");
  try {
    const redirectType =
      userType === "customer"
        ? "customer"
        : landlordType === "agency"
        ? "agent"
        : "landlord";

    // Store user type for profile-setup redirect
    localStorage.setItem("signupUserType", userType);
    localStorage.setItem("signupLandlordType", landlordType);

    // Sign in with Google (no automatic redirect)
    const result = await signIn("google", { callbackUrl: `/profile-setup/${redirectType}`, redirect: false });

    if (result?.ok) {
      // ✅ Wait for session to be available
      const session = await getSession();
      if (session?.user?.email) {
        localStorage.setItem("googleEmail", session.user.email);
        localStorage.setItem("googleName", session.user.name || "");
        localStorage.setItem("googlePicture", session.user.image || "");
      }

      // Redirect manually to profile setup
      window.location.href = result.url || `/profile-setup/${redirectType}`;
    }
  } catch (err) {
    console.error("Google signup error:", err);
    setFeedbackMessage("❌ Google signup failed. Please try again.");
  }
};

  // ==========================
  // Send OTP (Manual Signup)
  // ==========================
  const handleSendOtp = async () => {
    setFeedbackMessage("");

    if (!formData.email || !formData.phone || !formData.password) {
      setFeedbackMessage("⚠️ Please fill all required fields.");
      return;
    }
    if (!Object.values(passwordRules).every(Boolean)) {
      setFeedbackMessage("⚠️ Password must meet all requirements.");
      return;
    }
    if (userType === "customer" && (!formData.firstName || !formData.lastName)) {
      setFeedbackMessage("⚠️ Please fill your first and last name.");
      return;
    }
    if (userType === "agent") {
      if (landlordType === "agency" && !formData.agencyName) {
        setFeedbackMessage("⚠️ Please fill your agency name.");
        return;
      } else if (landlordType === "individual" && (!formData.firstName || !formData.lastName)) {
        setFeedbackMessage("⚠️ Please fill your first and last name.");
        return;
      }
    }

    try {
      setIsSendingOtp(true);
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, userType, landlordType, google: false }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setFeedbackMessage(data.message || "❌ Failed to send OTP.");
        setIsSendingOtp(false);
        return;
      }

      setFeedbackMessage("✅ OTP sent to your email.");
      setResendTimer(60);
      setIsSendingOtp(false);
      setStep(3);

      // ✅ Save email for profile setup
      localStorage.setItem("signupEmail", formData.email);
      localStorage.setItem("signupData", JSON.stringify(formData));
      localStorage.setItem("signupUserType", userType);
      localStorage.setItem("signupLandlordType", landlordType);
    } catch (err) {
      console.error(err);
      setFeedbackMessage("❌ Server error. Please try again.");
      setIsSendingOtp(false);
    }
  };

  // ==========================
  // Verify OTP
  // ==========================
  const handleVerifyOtp = async () => {
    setFeedbackMessage("");
    if (!formData.otp) {
      setFeedbackMessage("⚠️ Please enter the OTP.");
      return;
    }
    try {
      setIsVerifying(true);
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otp: formData.otp }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setFeedbackMessage(data.message || "❌ Invalid or expired OTP.");
        setIsVerifying(false);
        return;
      }

      setFeedbackMessage("✅ Email verified successfully");
      setVerifiedMessageShown(true);
      setProgress(0);

      let progressValue = 0;
      const interval = setInterval(() => {
        progressValue += 5;
        setProgress(progressValue);
        if (progressValue >= 100) {
          clearInterval(interval);
          const redirectType =
            userType === "customer"
              ? "customer"
              : landlordType === "agency"
              ? "agent"
              : "landlord";

          // ✅ Save email and type for profile setup
          localStorage.setItem("signupEmail", formData.email);
          localStorage.setItem("signupData", JSON.stringify(formData));
          localStorage.setItem("signupUserType", userType);
          localStorage.setItem("signupLandlordType", landlordType);

          router.push(`/profile-setup/${redirectType}`);
        }
      }, 50);
    } catch (err) {
      console.error(err);
      setFeedbackMessage("❌ Server error while verifying OTP. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  // ==========================
  // Resend OTP
  // ==========================
  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    setFeedbackMessage("");
    try {
      setIsSendingOtp(true);
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, userType, landlordType }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setFeedbackMessage(data.message || "❌ Failed to resend OTP.");
        setIsSendingOtp(false);
        return;
      }
      setResendTimer(60);
      setFeedbackMessage("✅ OTP resent to your email.");
      setIsSendingOtp(false);
    } catch (err) {
      console.error(err);
      setFeedbackMessage("❌ Server error. Please try again.");
      setIsSendingOtp(false);
    }
  };


  // ==========================
  // UI Rendering
  // ==========================
  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 p-4 py-18">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        <div className="hidden md:flex items-center justify-center bg-linear-to-br from-orange-200 to-orange-400">
          <motion.img
            src="/signup-illustration.svg"
            alt="Signup Illustration"
            className="w-3/4 h-auto"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
        </div>

        <div className="p-8 md:p-12 flex flex-col gap-6 w-full min-h-[640px]">
          <h1 className="text-3xl font-bold text-gray-900 leading-snug tracking-tight">
            {userType === "customer" ? "Join as a Customer" : "Join as a Landlord / Agent"}
          </h1>

          <div className="flex border rounded-xl overflow-hidden shadow-sm">
            {["customer", "agent"].map((type) => (
              <motion.button
                key={type}
                onClick={() => {
                  setUserType(type as "customer" | "agent");
                  setLandlordType("individual");
                  setStep(1);
                  setFormData({
                    firstName: "",
                    lastName: "",
                    email: "",
                    phone: "",
                    password: "",
                    otp: "",
                    agencyName: "",
                    licenseNumber: "",
                    picture: "",
                  });
                  setFeedbackMessage("");
                  setPasswordRules({
                    length: false,
                    uppercase: false,
                    number: false,
                    specialChar: false,
                  });
                  setShowGoogleSignup(true);
                }}
                whileHover={{ scale: 1.03 }}
                className={`flex-1 py-3 font-semibold transition-all ${
                  userType === type
                    ? "bg-orange-500 text-white shadow-inner"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {type === "customer" ? "Customer" : "Landlord / Agent"}
              </motion.button>
            ))}
          </div>

          <div className="flex gap-1">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="flex-1 h-1 rounded-full"
                animate={{ backgroundColor: i < Math.min(step, 3) ? "#f97316" : "#e5e7eb" }}
              />
            ))}
          </div>

          {feedbackMessage && (
            <div
              className={`text-sm text-center font-medium rounded-lg p-2 ${
                feedbackMessage.startsWith("✅")
                  ? "text-green-700 bg-green-50 border border-green-200"
                  : "text-gray-700 bg-gray-50 border border-gray-200"
              }`}
            >
              {feedbackMessage}
            </div>
          )}

          {/* Google Signup */}
          {showGoogleSignup && step === 1 && (
            <div className="flex flex-col gap-3 w-full">
              <button
                type="button"
                onClick={handleGoogleSignup}
                className="flex items-center justify-center gap-2 py-3 w-full border border-gray-300 rounded-xl hover:bg-gray-50 transition cursor-pointer"
              >
                <FcGoogle className="w-5 h-5" />
                <span className="font-medium text-gray-700">
                  Sign up as{" "}
                  {userType === "customer"
                    ? "Customer"
                    : landlordType === "agency"
                    ? "Agent"
                    : "Landlord"}{" "}
                  with Google
                </span>
              </button>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-px bg-gray-300" />
                <span className="text-sm text-gray-500">or</span>
                <div className="flex-1 h-px bg-gray-300" />
              </div>
            </div>
          )}



          {/* Existing Form */}
          <form className="flex flex-col gap-4 w-full" onSubmit={(e) => e.preventDefault()}>
            <AnimatePresence mode="wait">
              {/* Step 1 */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  layout
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col gap-4 w-full"
                >
                  {/* Inputs for customer or agent */}
                  {userType === "customer" ? (
                    <div className="flex flex-col md:flex-row gap-4 w-full">
                      <input
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="First Name"
                        className="flex-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 transition"
                      />
                      <input
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Last Name"
                        className="flex-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 transition"
                      />
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-col gap-2">
                        <p className="text-gray-600 text-sm font-medium">Are you registering as:</p>
                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={() => setLandlordType("individual")}
                            className={`flex-1 py-2 rounded-lg border font-medium transition ${
                              landlordType === "individual"
                                ? "bg-orange-100 border-orange-500 text-orange-600"
                                : "bg-white hover:bg-gray-50"
                            }`}
                          >
                            Individual Landlord
                          </button>
                          <button
                            type="button"
                            onClick={() => setLandlordType("agency")}
                            className={`flex-1 py-2 rounded-lg border font-medium transition ${
                              landlordType === "agency"
                                ? "bg-orange-100 border-orange-500 text-orange-600"
                                : "bg-white hover:bg-gray-50"
                            }`}
                          >
                            Agent / Agency
                          </button>
                        </div>
                      </div>

                      {landlordType === "agency" && (
                        <>
                          <input
                            name="agencyName"
                            value={formData.agencyName}
                            onChange={handleInputChange}
                            placeholder="Agency or Business Name"
                            className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 transition"
                          />
                          <input
                            name="licenseNumber"
                            value={formData.licenseNumber}
                            onChange={handleInputChange}
                            placeholder="Agent / Property License Number (optional)"
                            className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 transition"
                          />
                        </>
                      )}

                      {landlordType === "individual" && (
                        <div className="flex flex-col md:flex-row gap-4">
                          <input
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            placeholder="First Name"
                            className="flex-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 transition"
                          />
                          <input
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            placeholder="Last Name"
                            className="flex-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 transition"
                          />
                        </div>
                      )}
                    </>
                  )}

                  <div className="flex flex-col md:flex-row gap-4 w-full">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Email Address"
                      className="flex-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 transition"
                    />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Phone Number"
                      className="flex-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 transition"
                    />
                  </div>

                  <div className="flex justify-between gap-4">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition disabled:opacity-50"
                      disabled
                    >
                      Back
                    </button>

                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="flex-1 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition"
                    >
                      Next
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 2 */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  layout
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col gap-4 w-full"
                >
                  <div className="relative w-full">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Password"
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

                  <div className="text-sm text-gray-600 flex flex-col gap-2">
                    {[
                      { key: "length", label: "Minimum 8 characters" },
                      { key: "uppercase", label: "At least one uppercase letter" },
                      { key: "number", label: "At least one number" },
                      { key: "specialChar", label: "At least one special character (!@#$%^&*)" },
                    ].map(({ key, label }) => (
                      <div key={key} className="flex items-center gap-2">
                        <CheckIcon
                          className={`w-4 h-4 ${
                            passwordRules[key as keyof typeof passwordRules] ? "text-green-600" : "text-gray-300"
                          }`}
                        />
                        <span
                          className={
                            passwordRules[key as keyof typeof passwordRules] ? "text-green-600 font-medium" : ""
                          }
                        >
                          {label}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between gap-4">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="flex-1 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition"
                      disabled={isSendingOtp}
                    >
                      {isSendingOtp ? "Registering..." : "Register"}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 3 */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  layout
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col gap-4 w-full"
                >
                  <input
                    name="otp"
                    value={formData.otp}
                    onChange={handleInputChange}
                    placeholder="Enter OTP"
                    className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 transition"
                  />
                  <div className="flex justify-between gap-4">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      className="flex-1 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition"
                      disabled={isVerifying}
                    >
                      {isVerifying ? "Verifying..." : "Verify OTP"}
                    </button>
                  </div>
                  <div className="text-center text-sm text-gray-500">
                    {resendTimer > 0 ? (
                      <>Resend OTP in {resendTimer}s</>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        className="text-orange-500 font-medium hover:underline"
                        disabled={isSendingOtp}
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>
                  {verifiedMessageShown && (
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <motion.div
                        className="h-2 bg-orange-500"
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.05 }}
                      />
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </form>

          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link href="/login" className="text-orange-500 font-medium hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}