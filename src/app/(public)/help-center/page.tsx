"use client";
import React, { useState, useRef } from "react";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import LoginPromptModal from "../../components/LoginPromptModal";
import SignupPromptModal from "../../components/SignupPromptModal";

type FaqItem = {
  id: string;
  question: string;
  answer: React.ReactNode | string;
  requiresSignup?: boolean;
  requiresLogin?: boolean;
};

export default function HelpCenter() {
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [signupModalOpen, setSignupModalOpen] = useState(false);
  const [openItem, setOpenItem] = useState<string | null>(null);

  const faqItemRefs = useRef<Map<string, HTMLDivElement | null>>(new Map());

  const faqItems: FaqItem[] = [
    { id: "account", question: "👤 How do I create an account?", answer: <>Click <a href="/signup" className="text-orange-500 hover:underline font-medium">here</a> to create your account quickly.</>, requiresSignup: true },
    { id: "password", question: "🔑 I forgot my password", answer: "You can reset your password using the 'Forgot Password' link on the login page.", requiresLogin: true },
    { id: "listing", question: "🏠 How do I list my property?", answer: "You must be logged in to list a property on HouseMart.", requiresLogin: true },
    { id: "payments", question: "💳 Payments & Billing issues", answer: "Check your invoices or contact support for payment assistance.", requiresLogin: true },
    { id: "support", question: "📞 How do I contact support?", answer: "Reach out via email or live chat for assistance.", requiresSignup: false, requiresLogin: false },
    { id: "save", question: "❤️ How do I save a property?", answer: "Save your favorite properties to revisit later.", requiresLogin: true },
    { id: "viewings", question: "📅 Can I schedule property viewings?", answer: "You need an account to schedule viewings online.", requiresSignup: true },
    { id: "profile", question: "🧾 How do I update my profile?", answer: "Profile updates require logging in to your account.", requiresLogin: true },
    { id: "alerts", question: "🔔 How do I subscribe to alerts?", answer: "Sign up to receive alerts for new properties matching your preferences.", requiresSignup: true },
    { id: "methods", question: "💰 What payment methods are supported?", answer: "We support multiple payment methods including card and bank transfer.", requiresSignup: false, requiresLogin: false },
    { id: "browse", question: "👀 Can I browse properties without an account?", answer: "Yes, you can browse all properties and view basic details without signing up.", requiresSignup: false, requiresLogin: false },
    { id: "ratings", question: "⭐ How do property ratings work?", answer: "Properties are rated by previous tenants and verified reviews to help you make better decisions.", requiresSignup: false, requiresLogin: false },
    { id: "mobile", question: "📱 Is there a mobile app?", answer: "Currently, you can access HouseMart via mobile web. The app is coming soon!", requiresSignup: false, requiresLogin: false },
    { id: "share", question: "🔗 Can I share a property listing?", answer: "Yes, use the share button on any property page to send it to friends or family.", requiresSignup: false, requiresLogin: false },
  ];

  const topics = [
    { label: "Account Setup", targetId: "account" },
    { label: "Listing Properties", targetId: "listing" },
    { label: "Payments", targetId: "payments" },
    { label: "Support", targetId: "support" },
  ];

  // Only handle modals here
  const handleTriggerClick = (item: FaqItem, e: React.MouseEvent) => {
    if (item.requiresSignup) {
      e.preventDefault();
      setSignupModalOpen(true);
    } else if (item.requiresLogin) {
      e.preventDefault();
      setLoginModalOpen(true);
    }
  };

  const handleTopicClick = (targetId: string) => {
    const index = faqItems.findIndex((f) => f.id === targetId);
    if (index === -1) return;

    const value = `item-${index}`;
    setOpenItem(value);

    const node = faqItemRefs.current.get(targetId) ?? null;
    if (node) {
      node.scrollIntoView({ behavior: "smooth", block: "center" });
      node.classList.add("ring-2", "ring-orange-300", "bg-orange-50");
      window.setTimeout(() => {
        node.classList.remove("ring-2", "ring-orange-300", "bg-orange-50");
      }, 1200);
    }
  };

  return (
    <main className="flex flex-col lg:mx-auto lg:max-w-[1440px] pb-28 pt-20 px-4 md:px-14 text-gray-900">
      {/* HERO */}
      <section className="w-full text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-black mb-3 leading-[120%] tracking-tight">
          Help Center
        </h1>
        <p className="text-gray-700 text-base md:text-lg max-w-3xl mx-auto leading-[170%]">
          Find answers to common questions or learn how to make the most of HouseMart.
        </p>
      </section>

      {/* POPULAR TOPICS */}
      <section className="max-w-4xl mx-auto mb-10 text-center">
        <h2 className="text-2xl md:text-3xl font-semibold text-black mb-4 tracking-tight">Popular Topics</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {topics.map((topic) => (
            <button
              key={topic.targetId}
              onClick={() => handleTopicClick(topic.targetId)}
              className="px-5 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition tracking-wide"
              aria-controls={topic.targetId}
            >
              {topic.label}
            </button>
          ))}
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="w-full max-w-3xl mx-auto">
        <Accordion.Root
          type="single"
          collapsible
          value={openItem ?? undefined}
          onValueChange={(val) => setOpenItem(val ?? null)} // ✅ sync state with Radix
          className="flex flex-col gap-4"
        >
          {faqItems.map((item, idx) => {
            const value = `item-${idx}`;
            const isOpen = openItem === value;
            return (
              <div
                key={item.id}
                id={item.id}
                ref={(el: HTMLDivElement | null) => {
                  if (el) faqItemRefs.current.set(item.id, el);
                  else faqItemRefs.current.delete(item.id);
                }}
                className="rounded-xl"
              >
                <Accordion.Item value={value} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition">
                  <Accordion.Header>
                    <Accordion.Trigger
                      aria-expanded={isOpen}
                      className="w-full flex justify-between items-center p-6 text-left text-lg md:text-xl font-medium text-gray-900 focus:outline-none hover:bg-orange-50 transition"
                      onClick={(e) => handleTriggerClick(item, e)}
                    >
                      <span>{item.question}</span>
                      <ChevronDown className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} size={20} />
                    </Accordion.Trigger>
                  </Accordion.Header>

                  {/* Show content only for public items */}
                  {!item.requiresSignup && !item.requiresLogin && (
                    <Accordion.Content className="px-6 pb-6 text-gray-700 text-[15px] leading-[170%] transition-all duration-300">
                      {item.answer}
                    </Accordion.Content>
                  )}
                </Accordion.Item>
              </div>
            );
          })}
        </Accordion.Root>
      </section>

      {/* CTA */}
      <section className="text-center mt-12">
        <h3 className="text-2xl font-semibold mb-3">Still need help?</h3>
        <p className="text-gray-700 mb-4 max-w-xl mx-auto">If the FAQ doesn&apos;t answer your question, visit our Support page for direct contact options.</p>
        <button
          onClick={() => (window.location.href = "/support")}
          className="bg-orange-500 text-white px-6 py-3 rounded-full hover:bg-orange-600 transition"
        >
          Go to Support
        </button>
      </section>

      {/* MODALS */}
      {loginModalOpen && <LoginPromptModal onClose={() => setLoginModalOpen(false)} />}
      {signupModalOpen && <SignupPromptModal onClose={() => setSignupModalOpen(false)} />}
    </main>
  );
}