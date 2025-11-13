"use client";
import * as Accordion from "@radix-ui/react-accordion";
import faqs from "../../data/faqs.json";

export default function FaqPage() {
  return (
    <main className="flex flex-col lg:mx-auto lg:max-w-[1440px] pb-28 pt-76 px-4 md:px-14 bg-[#fffefc] text-gray-900">
      
      {/* ===== HERO ===== */}

          <section className="w-full text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-extrabold text-black mb-4 leading-[120%]">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-700 text-lg md:text-xl max-w-3xl mx-auto leading-[170%]">
            Everything you need to know about using HouseMart. Find answers to common questions and get the most out of our platform.
          </p>
        </section>

      {/* ===== FAQ ACCORDION ===== */}
      <section className="w-full max-w-3xl mx-auto mb-28">
        <h2 className="text-3xl md:text-4xl font-semibold text-black text-center mb-10">
          Got Questions? We’ve Got Answers
        </h2>

        <Accordion.Root type="single" collapsible className="flex flex-col gap-4">
          {faqs.map((faq, index) => (
            <Accordion.Item
              key={index}
              value={`item-${index}`}
              className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
            >
              <Accordion.Header>
                <Accordion.Trigger className="w-full flex justify-between items-center p-6 text-left text-lg md:text-xl font-medium text-gray-900 focus:outline-none hover:bg-orange-50 transition">
                  {faq.question}
                  <span className="transition-transform duration-300 data-[state=open]:rotate-180">
                    ▼
                  </span>
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="px-6 pb-6 text-gray-700 text-[17px] leading-[175%] transition-all duration-300">
                {faq.answer}
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </section>

      {/* ===== STILL NEED HELP CTA ===== */}
      <section className="bg-[#fff6ef] border border-orange-100 rounded-2xl p-10 md:p-14 text-center shadow-sm">
        <h2 className="text-3xl md:text-4xl font-semibold text-black mb-4">
          Still have questions?
        </h2>
        <p className="text-[#444] text-[17px] leading-[170%] max-w-2xl mx-auto mb-6">
          Our friendly support team is ready to assist you with any inquiries or issues you might have.
        </p>
        <a
          href="/support"
          className="bg-orange-500 text-white px-8 py-3 rounded-full text-[16px] font-semibold hover:bg-orange-600 transition"
        >
          Contact Support
        </a>
      </section>
    </main>
  );
}