"use client";
import { useEffect, useState } from "react";
import links from "../data/legalLinks.json";

export default function Legal() {
  const [active, setActive] = useState<string | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!isDesktop) return;

    const sections = document.querySelectorAll("section[id]");
    const sidebar = document.getElementById("legal-sidebar");

    const handleScroll = () => {
      if (!sidebar) return;

      const centerY = window.innerHeight / 2;
      let closestId: string | null = null;
      let minDistance = Infinity;
      const secs = Array.from(sections) as HTMLElement[];

      secs.forEach((sec) => {
        const rect = sec.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < window.innerHeight) {
          const secMid = rect.top + rect.height / 2;
          const dist = Math.abs(secMid - centerY);
          if (dist < minDistance) {
            minDistance = dist;
            closestId = sec.id;
          }
        }
      });

      const scrollBottom = window.innerHeight + window.scrollY;
      const pageHeight = document.documentElement.scrollHeight;
      if (scrollBottom >= pageHeight - 5) {
        const last = secs[secs.length - 1];
        if (last) closestId = last.id;
      }

      if (closestId && closestId !== active) {
        setActive(closestId);
      }
    };

    const onScroll = () => {
      requestAnimationFrame(handleScroll);
    };

    window.addEventListener("scroll", onScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, [isDesktop, active]);

  return (
    <main className="flex items-start flex-col md:flex-row gap-16 md:gap-20">

      {/* Sidebar */}
      <aside
        id="legal-sidebar"
        className="w-full md:w-[280px] lg:w-[320px] md:sticky md:top-[200px] mx-auto md:mx-0"
      >
        <div className="px-5 py-5 rounded-xl border w-full">
          <ul className="flex flex-col gap-6 text-[#999] text-[16px]/[100%] tracking-[-0.96px] font-medium text-center md:text-left">
            {links.map((link) => (
              <li
                key={link.id}
                className={`cursor-pointer transition-colors ${
                  active === link.id ? "text-green-600 font-semibold" : ""
                }`}
                onClick={() => {
                  const target = document.getElementById(link.id);
                  setActive(link.id);

                  if (target) {
                    const stickyOffset = 200;
                    const top = target.offsetTop - stickyOffset;
                    window.scrollTo({
                      top,
                      behavior: "smooth",
                    });
                  }
                }}
              >
                {link.title}
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Legal Content Sections */}
      <section className="flex flex-col md:flex-1 gap-8 md:gap-10">
        <div className="px-6"><hr /></div>

        {/* Terms & Conditions */}
        <section id="terms" className="px-6 flex flex-col gap-8 md:gap-10">
          <h2 className="text-[26px]/[100%] tracking-[-1.56px] md:text-[30px]/[120%] md:tracking-[-1.8px]">
            Terms & Conditions
          </h2>
          <div className="flex flex-col gap-6 text-[#666] text-[15px]/[150%] md:text-[18px]/[150%] md:tracking-[-0.72px]">
            <p>By using HouseMart, you agree to our rules and community values, which include honesty, transparency, and respect for other users. All users must adhere to these standards to maintain a safe and reliable platform.</p>
            <p>All accounts must provide accurate and truthful information during registration and profile updates. Misrepresentation, impersonation, or falsifying information is strictly prohibited and may lead to account suspension or termination.</p>
            <p>Users must not engage in activities that could harm other users or the platform, including spam, fraudulent listings, unauthorized commercial promotion, or any behavior that violates applicable laws.</p>
            <p>HouseMart provides a platform for property listings and related services. Vendors and users offering services or products are responsible for ensuring the accuracy of the information they provide. HouseMart cannot be held liable for errors, omissions, or misleading information provided by third parties.</p>
            <p>Users agree to comply with all applicable laws and regulations when using HouseMart. This includes data protection laws, property regulations, and ethical guidelines relevant to their activities on the platform.</p>
            <p>HouseMart reserves the right to modify or update the Terms & Conditions at any time. Users are encouraged to review them periodically to stay informed of any changes.</p>
          </div>
        </section>

        <div className="px-6"><hr /></div>

        {/* Privacy Policy */}
        <section id="privacy" className="px-6 flex flex-col gap-8 md:gap-10">
          <h2 className="text-[26px]/[100%] tracking-[-1.56px] md:text-[30px]/[120%] md:tracking-[-1.8px]">
            Privacy Policy
          </h2>
          <div className="flex flex-col gap-6 text-[#666] text-[15px]/[150%] md:text-[18px]/[150%] md:tracking-[-0.72px]">
            <p>HouseMart collects only the information you voluntarily provide, including name, email, contact details, property preferences, and activity on the platform such as saved items and listings viewed.</p>
            <p>Your information is used to deliver and improve our services, communicate important updates, offer personalized recommendations, and enhance your overall experience on HouseMart.</p>
            <p>All personal data is stored securely using industry-standard encryption and access controls. HouseMart does not sell, trade, or share your personal information with third parties for marketing purposes.</p>
            <p>Cookies and analytics tools may be used to understand user behavior, optimize platform performance, and provide a more tailored experience. You may manage cookie preferences through your browser settings.</p>
            <p>You have the right to access, correct, or request deletion of your personal information. To exercise these rights, contact our privacy team at privacy@housemart.com.</p>
            <p>We may update our privacy policy from time to time. Continued use of HouseMart constitutes acceptance of any such changes.</p>
          </div>
        </section>

        <div className="px-6"><hr /></div>

        {/* Final Note */}
        <section id="final" className="px-6 flex flex-col gap-6 md:gap-8">
          <h2 className="text-[26px]/[100%] tracking-[-1.56px] md:text-[30px]/[120%] md:tracking-[-1.8px]">
            Final Note
          </h2>
          <p>
            By using HouseMart, you acknowledge that you have read and understood these Terms & Conditions and Privacy Policy. You agree to abide by them, ensuring a secure and trustworthy environment for all platform users.
          </p>
        </section>

        <div className="px-6"><hr /></div>

        {/* Contact For Legal Concerns */}
        <section id="contact" className="px-6 flex flex-col gap-6 md:gap-8">
          <h2 className="text-[26px]/[100%] tracking-[-1.56px] md:text-[30px]/[120%] md:tracking-[-1.8px]">
            Contact For Legal Concerns
          </h2>
          <p>
            If you have any questions or concerns regarding HouseMart&apos;s Terms & Conditions or Privacy Policy, please reach out to our legal team:
            <br /> Email: legal@housemart.com
            <br /> WhatsApp: [+234 xxx xxx xxxx]
            <br /> Our team will respond promptly to ensure your questions are addressed professionally.
          </p>
        </section>

      </section>
    </main>
  );
}