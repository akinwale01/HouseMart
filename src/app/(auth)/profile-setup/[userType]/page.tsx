"use client";

import React, { useEffect, useState, ChangeEvent, FormEvent, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

type UserType = "customer" | "landlord" | "agent";
type FormFieldValue = string | File | number | undefined;
type FormDataShape = Record<string, FormFieldValue>;

export default function ProfileSetup() {
  const params = useParams() as { userType?: string };
  const router = useRouter();
  const userType: UserType = (params.userType as UserType) || "customer";

  const [formData, setFormData] = useState<FormDataShape>({});
  const [preview, setPreview] = useState<string | null>(null);
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [accepted, setAccepted] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [completed, setCompleted] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true); // ✅ updated

  const usernameDebounceRef = useRef<number | null>(null);

  const fields: Record<UserType, { name: string; placeholder: string; type: "text" | "textarea" | "number"; required?: boolean }[]> = {
    customer: [
      { name: "username", placeholder: "Choose a username", type: "text", required: true },
      { name: "phone", placeholder: "Phone number", type: "text", required: true },
      { name: "address", placeholder: "Address", type: "text", required: true },
      { name: "bio", placeholder: "Short bio", type: "textarea" },
    ],
    landlord: [
      { name: "username", placeholder: "Choose a username", type: "text", required: true },
      { name: "phone", placeholder: "Phone number", type: "text", required: true },
      { name: "propertyCount", placeholder: "Number of properties", type: "number", required: true },
      { name: "bio", placeholder: "About you", type: "textarea" },
    ],
    agent: [
      { name: "username", placeholder: "Choose a username", type: "text", required: true },
      { name: "agencyName", placeholder: "Agency name", type: "text", required: true },
      { name: "phone", placeholder: "Business phone", type: "text", required: true },
      { name: "licenseNumber", placeholder: "License number", type: "text", required: true },
      { name: "website", placeholder: "Website (optional)", type: "text" },
      { name: "bio", placeholder: "Agency description", type: "textarea" },
    ],
  };

  useEffect(() => {
    const ls = typeof window !== "undefined" ? localStorage.getItem("signupData") : null;
    const googleEmail = typeof window !== "undefined" ? localStorage.getItem("googleEmail") : null;
    const userEmail = (googleEmail || (ls ? JSON.parse(ls).email : null)) as string | null;
    if (!userEmail) {
      setLoadingProfile(false);
      return;
    }
    setEmail(userEmail);

    (async () => {
      try {
        const res = await fetch(`/api/temp-user?email=${encodeURIComponent(userEmail)}`);
        const json: { success: boolean; data?: Record<string, string> } = await res.json();
        if (json.success && json.data) {
          const t = json.data;
          setFormData((prev) => ({
            ...prev,
            firstName: t.firstName || prev.firstName,
            lastName: t.lastName || prev.lastName,
            phone: t.phone || prev.phone,
            email: t.email || prev.email,
            agencyName: t.agencyName || prev.agencyName,
            licenseNumber: t.licenseNumber || prev.licenseNumber,
            address: t.address || prev.address,
            bio: t.bio || prev.bio,
            propertyCount: t.propertyCount || prev.propertyCount,
            username: t.username || prev.username,
            website: t.website || prev.website,
          }));
          if (t.picture) setPreview(t.picture);
        }
      } catch (err) {
        console.warn("Could not prefill temp user", err);
      } finally {
        setLoadingProfile(false); // ✅ stop loading for all users
      }
    })();
  }, []);

  const setFieldValue = (name: string, value: FormFieldValue) => setFormData((s) => ({ ...s, [name]: value }));

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setNotification("❌ Image too large (max 5MB)");
      return;
    }
    setFieldValue("profilePictureFile", file);
    setPreview(URL.createObjectURL(file));
  };

  const checkUsername = (username: string) => {
    setUsernameAvailable(null);
    setSuggestions([]);
    if (usernameDebounceRef.current) {
      clearTimeout(usernameDebounceRef.current);
      usernameDebounceRef.current = null;
    }
    if (!username || username.trim().length < 3) return;

    usernameDebounceRef.current = window.setTimeout(async () => {
      try {
        const res = await fetch("/api/check-username", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username }),
        });
        const data: { available: boolean; suggestions?: string[] } = await res.json();
        setUsernameAvailable(Boolean(data.available));
        setSuggestions(Array.isArray(data.suggestions) ? data.suggestions : []);
      } catch (err) {
        console.warn("Username check failed", err);
      }
    }, 300);
  };

  const uploadProfileImage = async (file: File): Promise<string> => {
    const fd = new FormData();
    fd.append("file", file);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    const res = await fetch("/api/upload-profile", { method: "POST", body: fd, signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) {
      const txt = await res.text();
      throw new Error(txt || "Upload failed");
    }
    const data: { url: string } = await res.json();
    return data.url;
  };

  const progressPercent = Math.round(((step - 1) / 2) * 100);

  const handleNext = () => {
    setNotification(null);
    if (step === 1) {
      setStep(2);
      return;
    }
    if (step === 2) {
      const username = (formData.username as string) || "";
      if (!username) return setNotification("Please choose a username before continuing.");
      if (usernameAvailable === false) return setNotification("Username is taken.");
      setStep(3);
    }
  };

  const handleBack = () => step > 1 && setStep((s) => s - 1);

  const applySuggestion = (s: string) => {
    setFieldValue("username", s);
    setUsernameAvailable(true);
    setSuggestions([]);
  };

  const handleSubmit = async (e?: FormEvent) => {
    e?.preventDefault();
    setNotification(null);

    if (!accepted) {
      setNotification("Please accept the Terms & Privacy.");
      return;
    }

    const username = (formData.username as string) || "";
    if (!username) {
      setNotification("Username required.");
      setStep(2);
      return;
    }
    if (usernameAvailable === false) {
      setNotification("Username is already taken.");
      return;
    }

    setLoading(true);
    try {
      const profilePicture =
        formData.profilePictureFile && typeof formData.profilePictureFile !== "string"
          ? await uploadProfileImage(formData.profilePictureFile as File)
          : (formData.profilePicture as string) || "";

      const payload = {
        email,
        username,
        bio: (formData.bio as string) || "",
        address: (formData.address as string) || "",
        profilePicture,
        firstName: (formData.firstName as string) || "",
        lastName: (formData.lastName as string) || "",
        phone: (formData.phone as string) || "",
        agencyName: (formData.agencyName as string) || "",
        licenseNumber: (formData.licenseNumber as string) || "",
        userType,
      };

      const res = await fetch("/api/complete-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || "Failed to complete profile");

      if (json.token) {
        localStorage.setItem("token", json.token);
        localStorage.setItem("userType", userType);
        localStorage.setItem("username", username);
        localStorage.setItem("profilePicture", profilePicture);
      }

      confetti({ particleCount: 150, spread: 80 });
      setCompleted(true);

      localStorage.setItem("username", username);
      localStorage.setItem("profilePicture", profilePicture);

      ["signupData", "googleEmail", "googleName", "googlePicture", "email"].forEach((k) =>
        typeof window !== "undefined" && localStorage.removeItem(k)
      );

      setTimeout(() => router.push(json.redirectUrl || `/dashboard/${userType}`), 2100);
    } catch (err: unknown) {
      setNotification((err as Error)?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Updated loading check: no longer depends on firstName
  if (loadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#0f172a] via-[#3b0ca9] to-[#06b6d4] p-6">
        <p className="text-white text-2xl">Loading profile setup...</p>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#3B0CA9] via-[#6C2BD9] to-[#12C2E9] p-6">
        <div className="bg-white/90 rounded-3xl p-8 max-w-xl w-full flex flex-col gap-4 items-center">
          <h2 className="text-3xl font-bold text-indigo-700">🎉 Congratulations</h2>
          <p className="text-gray-700 text-center">Your profile was created — redirecting to your dashboard…</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#0f172a] via-[#3b0ca9] to-[#06b6d4] p-6">
      <div className="bg-white/95 rounded-3xl shadow-2xl w-full max-w-3xl p-8 flex flex-col gap-6">
        {/* Header + progress */}
        <div className="flex flex-col gap-2 p-2">
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-linear-to-r from-[#4F46E5] to-[#06B6D4] text-center capitalize">
            Welcome{formData.firstName ? `, ${formData.firstName}` : ""}
          </h1>
          <p className="text-xl font-bold text-transparent bg-clip-text bg-linear-to-r from-[#4F46E5] to-[#06B6D4] text-center capitalize">
            finish your {userType} profile
          </p>
          <div className="w-full h-3 rounded-full bg-gray-200 overflow-hidden p-0">
            <div
              role="progressbar"
              aria-valuenow={progressPercent}
              className="h-full rounded-full transition-all"
              style={{ width: `${progressPercent}%`, background: "linear-gradient(90deg,#4F46E5,#06B6D4)" }}
            />
          </div>
          <div className="flex items-center justify-between gap-2 p-2">
            <div className="text-sm text-gray-600">{step}/3 steps</div>
            <div className="text-sm text-gray-500">Progress: {progressPercent}%</div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.form
            key={step}
            onSubmit={(e) => {
              e.preventDefault();
                if (step === 3) {
                  handleSubmit(e);
                } else {
                  handleNext();
                }
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35 }}
            className="flex flex-col gap-4 p-2"
          >
            {/* Step 1 */}
            {step === 1 && (
              <div className="flex flex-col items-center gap-4 p-2">
                <label htmlFor="profilePicture" className="cursor-pointer">
                  <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-indigo-300 flex items-center justify-center">
                    {preview ? (
                      <img src={preview} alt="preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-indigo-600">Upload photo</div>
                    )}
                  </div>
                </label>
                <input id="profilePicture" name="profilePicture" type="file" accept="image/*" onChange={onFileChange} className="hidden" />
                <div className="flex w-full gap-3 p-2">
                  <button type="button" onClick={handleNext} className="flex-1 bg-indigo-600 text-white font-semibold py-3 rounded-xl cursor-pointer">
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div className="flex flex-col gap-3 p-2">
                {fields[userType].map((f) =>
                  f.type === "textarea" ? (
                    <textarea
                      key={f.name}
                      name={f.name}
                      placeholder={f.placeholder}
                      value={(formData[f.name] as string) || ""}
                      onChange={(e) => setFieldValue(f.name, e.target.value)}
                      className="w-full p-3 rounded-lg border-2 border-gray-200"
                    />
                  ) : (
                    <div key={f.name} className="relative">
                      <input
                        name={f.name}
                        type={f.type === "number" ? "number" : "text"}
                        placeholder={f.placeholder}
                        value={(formData[f.name] as string) || ""}
                        onChange={(e) => {
                          setFieldValue(f.name, f.type === "number" ? Number(e.target.value) : e.target.value);
                          if (f.name === "username") checkUsername(e.target.value);
                        }}
                        className="w-full p-3 rounded-lg border-2 border-gray-200"
                      />
                      {f.name === "username" && usernameAvailable !== null && (
                        <div className={`absolute right-3 top-3 text-sm ${usernameAvailable ? "text-green-600" : "text-red-500"}`}>
                          {usernameAvailable ? "✓ Available" : "✗ Taken"}
                        </div>
                      )}
                    </div>
                  )
                )}
                {suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-2 p-2">
                    <div className="text-sm text-gray-600">Suggestions:</div>
                    {suggestions.map((s) => (
                      <div key={s} onClick={() => applySuggestion(s)} className="px-3 py-1 rounded-full bg-gray-100 text-sm cursor-pointer" role="button">
                        {s}
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-3 p-2">
                  <button type="button" onClick={handleBack} className="px-4 py-2 rounded-lg border border-indigo-600 text-indigo-600 font-semibold hover:bg-indigo-50">
                    Back
                  </button>
                  <button type="button" onClick={handleNext} className="flex-1 bg-indigo-600 text-white py-3 rounded-xl cursor-pointer">
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <div className="flex flex-col gap-4 p-2">
                <div className="flex items-center gap-2 flex-col">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    By completing your profile and reviewing our Terms & Conditions, you confirm your agreement to all the rules and policies outlined.
                    Please note that the Terms & Conditions are subject to change in accordance with the company’s policies.
                  </p>
                  <input id="terms" type="checkbox" checked={accepted} onChange={() => setAccepted((v) => !v)} className="cursor-pointer" />
                  <label htmlFor="terms" className="text-sm text-gray-700">
                    I accept the <a className="text-indigo-600 underline" href="/terms">Terms</a> and <a className="text-indigo-600 underline" href="/privacy">Privacy Policy</a>.
                  </label>
                </div>
                {notification && <div className="text-sm text-red-600">{notification}</div>}
                <div className="flex gap-3 p-2">
                  <button type="button" onClick={handleBack} className="px-4 py-2 rounded-lg border border-indigo-600 text-indigo-600 font-semibold hover:bg-indigo-50">
                    Back
                  </button>
                  <button type="submit" disabled={loading} className={`flex-1 py-3 rounded-xl font-semibold text-white cursor-pointer ${accepted ? "bg-linear-to-r from-indigo-600 to-cyan-400" : "bg-gray-300"}`}>
                    {loading ? "Completing..." : "Finish"}
                  </button>
                </div>
              </div>
            )}
          </motion.form>
        </AnimatePresence>
      </div>
    </div>
  );
}