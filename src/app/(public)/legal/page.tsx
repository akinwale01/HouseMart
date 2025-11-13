"use client";
import Legal from "../../components/Legal";

export default function LegalPage() {
  return (
    <main className="bg-gray-50 min-h-screen">
      {/* Page Container */}
      <section className="flex flex-col gap-20 lg:mx-auto lg:max-w-[1440px] pb-40 pt-76 px-4 md:px-10 lg:px-14">

        {/* Hero Section */}
        <section className="flex flex-col gap-6 text-center lg:text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight tracking-tight">
            HouseMart Legal & Privacy Information
          </h1>
          <p className="text-gray-700 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            At HouseMart, transparency, safety, and trust are our priorities. Please take a moment to review our Terms & Conditions and Privacy Policy to understand how we operate and protect your information.
          </p>
        </section>


        {/* Legal Component */}
        <section >
          <Legal />
        </section>
      </section>
    </main>
  );
}