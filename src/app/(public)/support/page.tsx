"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Modal from "../../components/LoginPromptModal";
import TroubleshootingModal from "../../components/TroubleshootingModal";
import SupportBot from "../../components/SupportBot"; // ✅ bot component

type SupportOption = {
  title: string;
  desc: string;
  icon: string;
  href?: string;
  restricted?: boolean;
  action?: "contact" | "learnMore" | "call" | "troubleshoot";
};

type SupportTopic = {
  title: string;
  desc: string;
  icon: string;
  href?: string;
  action?: "learnMore" | "troubleshoot";
};

export default function SupportPage() {
  const router = useRouter();
  const contactFormRef = useRef<HTMLDivElement | null>(null);

  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginPromptOpen, setLoginPromptOpen] = useState(false);
  const [troubleshootOpen, setTroubleshootOpen] = useState(false);
  const [botOpen, setBotOpen] = useState(false);
  const [toastVisible, setToastVisible] = useState(false); // ✅ toast state

  const phoneNumber = "+2348012345678";

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle contact form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email.includes("@")) {
      alert("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/send-support-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSubmitted(true);
        setFormData({ name: "", email: "", message: "" });
        setTimeout(() => setSubmitted(false), 3000);
      } else {
        alert("Failed to send message. Please try again later.");
      }
    } catch (err) {
      console.error("Error sending message:", err);
      alert("Something went wrong while sending your message.");
    } finally {
      setLoading(false);
    }
  };

  // Scroll to contact form
  const scrollToContactForm = () => {
    contactFormRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const isMobile = () => /Mobi|Android/i.test(navigator.userAgent);

  // ✅ Handle call (with toast)
  const handleCall = () => {
    if (isMobile()) {
      window.location.href = `tel:${phoneNumber}`;
    } else {
      navigator.clipboard.writeText(phoneNumber);
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 5000);
    }
  };

  // Handle card click
  const handleCardClick = (
    href?: string,
    restricted?: boolean,
    action?: "contact" | "learnMore" | "call" | "troubleshoot"
  ) => {
    if (restricted) {
      setLoginPromptOpen(true);
      return;
    }

    if (action === "contact") {
      scrollToContactForm();
      return;
    }

    if (action === "call") {
      handleCall();
      return;
    }

    if (action === "troubleshoot") {
      setTroubleshootOpen(true);
      return;
    }

    if (href) {
      router.push(href);
    }
  };

  // Support options
  const supportOptions: SupportOption[] = [
    {
      title: "Email Support",
      desc: "Reach us via email and we’ll respond within 24 hours.",
      icon: "✉️",
      action: "contact",
    },
    {
      title: "Call Us",
      desc: "Speak directly with a HouseMart specialist.",
      icon: "📞",
      action: "call",
    },
    {
      title: "Live Chat",
      desc: "Chat instantly with a support agent (requires login).",
      icon: "💬",
      restricted: true,
    },
    {
      title: "Help Center",
      desc: "Browse FAQs and guides for quick answers.",
      icon: "📚",
      href: "/help-center",
    },
  ];

  // Support topics
  const supportTopics: SupportTopic[] = [
    {
      title: "Account Issues",
      desc: "Help with login, signup, or profile setup.",
      icon: "👤",
      href: "/help-center?topic=account-issues",
    },
    {
      title: "Rent & Buy Questions",
      desc: "Guidance on listings, payments, and transactions.",
      icon: "🏠",
      href: "/help-center?topic=rent-buy",
    },
    {
      title: "Technical Support",
      desc: "Fix glitches, errors, or connection problems.",
      icon: "🧰",
      action: "troubleshoot",
    },
    {
      title: "Legal & Policies",
      desc: "Questions about terms, privacy, and safety.",
      icon: "📄",
      href: "/help-center?topic=legal",
    },
  ];

  return (
    <main className="flex flex-col lg:mx-auto lg:max-w-[1440px] pb-28 pt-74 px-4 md:px-14 text-gray-900 leading-relaxed tracking-wide relative">
      {/* ===== HERO ===== */}
      <section className="w-full text-center mb-20">
        <h1 className="text-5xl md:text-6xl font-extrabold text-black mb-5 leading-[120%] tracking-tight">
          🛠️ HouseMart Support
        </h1>
        <p className="text-gray-700 text-lg md:text-xl max-w-3xl mx-auto leading-[175%] tracking-wide">
          We’re here to help with any questions or issues. Explore our resources or reach out
          directly — we’ve got you covered.
        </p>
      </section>

      {/* ===== CONTACT OPTIONS ===== */}
      <section className="mb-28">
        <h2 className="text-3xl md:text-4xl font-semibold text-black text-center mb-12 tracking-tight">
          How Can We Help You?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {supportOptions.map((option, i) => (
            <div
              key={i}
              onClick={() => handleCardClick(option.href, option.restricted, option.action)}
              className="flex flex-col items-start p-8 border border-gray-200 rounded-2xl shadow-sm bg-gradient-to-br from-white to-gray-50 hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer"
            >
              <div className="text-4xl mb-4">{option.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-black">{option.title}</h3>
              <p className="text-gray-600 mb-4 leading-[170%] tracking-wide">{option.desc}</p>
              {option.action === "call" && (
                <p className="font-medium text-black mb-2">{phoneNumber}</p>
              )}
              <span className="text-orange-500 font-semibold hover:underline">
                {option.href
                  ? "Visit"
                  : option.restricted
                  ? "Login to Access"
                  : option.action === "call"
                  ? "Call Now"
                  : "Contact"}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ===== SUPPORT TOPICS ===== */}
      <section className="mb-28">
        <h2 className="text-3xl md:text-4xl font-semibold text-black text-center mb-12 tracking-tight">
          Explore Support Topics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {supportTopics.map((topic, i) => (
            <div
              key={i}
              onClick={() => handleCardClick(topic.href, false, topic.action)}
              className="flex flex-col p-8 border border-gray-200 rounded-2xl shadow-sm bg-gradient-to-br from-white to-gray-50 hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer"
            >
              <div className="text-5xl mb-4">{topic.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-black">{topic.title}</h3>
              <p className="text-gray-600 leading-[170%] tracking-wide">{topic.desc}</p>
              <span className="mt-4 text-orange-500 font-medium hover:underline">Learn More</span>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CONTACT FORM ===== */}
      <section
        id="contact-form-section"
        ref={contactFormRef}
        className="border border-gray-200 rounded-3xl p-12 md:p-16 max-w-4xl mx-auto mb-28 shadow-md hover:shadow-lg transition-all bg-white"
      >
        <h2 className="text-3xl md:text-4xl font-semibold text-black text-center mb-10 tracking-tight">
          Contact Support
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-2xl mx-auto w-full">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="px-6 py-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-400 text-lg shadow-sm tracking-wide"
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="px-6 py-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-400 text-lg shadow-sm tracking-wide"
          />
          <textarea
            name="message"
            placeholder="Your Message"
            value={formData.message}
            onChange={handleChange}
            rows={8}
            required
            className="px-6 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none text-lg shadow-sm tracking-wide"
          />

          <button
            type="submit"
            disabled={loading}
            className={`${
              loading ? "bg-orange-300 cursor-not-allowed" : "bg-orange-500 hover:bg-orange-600"
            } text-white rounded-full px-10 py-4 font-semibold text-lg transition shadow-md hover:shadow-lg tracking-wide`}
          >
            {loading ? "Sending..." : "Send Message"}
          </button>

          <div className="h-6 mt-2 flex items-center justify-center overflow-hidden">
            <p
              className={`text-green-600 font-medium text-center text-sm transition-opacity duration-500 ${
                submitted ? "opacity-100" : "opacity-0"
              }`}
            >
              ✅ Your message has been sent! We’ll get back to you soon.
            </p>
          </div>
        </form>
      </section>

      {/* ===== STILL NEED HELP ===== */}
      <section className="text-center mb-28">
        <h2 className="text-3xl md:text-4xl font-semibold text-black mb-4 tracking-tight">
          Need Immediate Assistance?
        </h2>
        <p className="text-gray-700 text-[17px] leading-[170%] tracking-wide max-w-2xl mx-auto mb-6">
          Chat with our support team or call us for urgent queries. We’re always ready to assist.
        </p>
        <button
          onClick={() => handleCardClick(undefined, true)}
          className="bg-orange-500 text-white px-8 py-3 rounded-full text-[16px] font-semibold hover:bg-orange-600 transition shadow-md hover:shadow-lg tracking-wide"
        >
          Live Chat (Login Required)
        </button>
      </section>

      {/* ===== CREATE ACCOUNT ===== */}
      <section className="text-center">
        <p className="text-gray-700 mb-4 tracking-wide">
          Want faster help and personalized support?
        </p>
        <button
          onClick={() => router.push("/signup")}
          className="bg-black text-white px-8 py-3 rounded-full text-[16px] font-semibold hover:bg-gray-900 transition shadow-md hover:shadow-lg tracking-wide"
        >
          Create a Free Account
        </button>
      </section>

      {/* ✅ Toast Notification */}
      {toastVisible && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-black text-white text-sm md:text-base px-6 py-3 rounded-full shadow-lg z-50 transition-all duration-200 animate-fadeIn">
          📞 Phone number copied to clipboard
        </div>
      )}

      {/* ===== MODALS & BOT ===== */}
      {loginPromptOpen && <Modal onClose={() => setLoginPromptOpen(false)} />}
      <TroubleshootingModal
        open={troubleshootOpen}
        onClose={() => setTroubleshootOpen(false)}
        onReport={() => {
          setTroubleshootOpen(false);
          setBotOpen(true);
        }}
      />
      <SupportBot open={botOpen} onClose={() => setBotOpen(false)} />
    </main>
  );
}