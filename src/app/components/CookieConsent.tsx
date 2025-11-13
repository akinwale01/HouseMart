"use client";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = Cookies.get("housemart_cookie_consent");
    if (!consent) setShow(true);
  }, []);

  const handleAccept = () => {
    Cookies.set("housemart_cookie_consent", "true", { expires: 365, path: "/" });
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[90%] md:w-[500px] bg-white border border-gray-300 rounded-xl shadow-lg p-5 flex flex-col md:flex-row items-center justify-between gap-4 z-[9999]">
      <p className="text-gray-700 text-sm md:text-base leading-[150%]">
        We use cookies to improve your experience on HouseMart. By continuing to browse, you agree to our{" "}
        <a href="/legal" className="text-orange-500 underline">
          Terms & Privacy Policy
        </a>.
      </p>
      <button
        onClick={handleAccept}
        className="bg-orange-500 text-white px-5 py-2 rounded-full font-semibold hover:bg-orange-600 transition"
      >
        Accept
      </button>
    </div>
  );
}