"use client";

import Link from "next/link";

const Footer = () => {
  const footerNav = [
    {
      title: "Company",
      links: [
        { name: "About Us", url: "/about" },
        { name: "Contact", url: "/contact" },
        { name: "Careers", url: "/careers" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Blog", url: "/blog" },
        { name: "FAQ", url: "/faq" },
        { name: "Help Center", url: "/help" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", url: "/privacy" },
        { name: "Terms & Conditions", url: "/terms" },
      ],
    },
  ];

  const socials = [
    { name: "Facebook", src: "/images/icons/facebook.svg", href: "#" },
    { name: "Twitter", src: "/images/icons/twitter.svg", href: "#" },
    { name: "Instagram", src: "/images/icons/instagram.svg", href: "#" },
    { name: "LinkedIn", src: "/images/icons/linkedin.svg", href: "#" },
  ];

  return (
    <footer className="bg-[#161814] w-full text-white tracking-[-0.5px] leading-[1.5]">
      <div className="flex flex-col gap-5 px-4 pt-16 md:px-14 lg:mx-auto lg:max-w-[1440px] lg:px-14 lg:pt-16">
        {/* CTA Section */}
        <div className="flex flex-col gap-3 items-center justify-center text-center">
          <h2 className="text-[40px]/[40px] tracking-[-2px] font-semibold text-white">
            Ready to Find Your Dream Home?
          </h2>
          <p className="text-[15px]/[22.5px] tracking-[-0.9px] text-[#999999] max-w-[600px]">
            Create your free HouseMart account and start exploring thousands of verified listings from trusted landlords and agents.
          </p>
          <Link href="/signup">
            <button
              className="flex gap-2 justify-center items-center rounded-[8px] bg-[#169B4C] px-5 h-10 cursor-pointer transition-transform hover:scale-105"
              aria-label="Join HouseMart"
            >
              <span className="text-white text-[15px]/[15px] font-medium tracking-[-0.9px] capitalize">
                get started
              </span>
            </button>
          </Link>
        </div>

        {/* Footer Columns */}
        <div className="flex flex-col gap-5 md:flex-row md:gap-0">
          {/* Company / Logo Section */}
          <div className="border-t border-[#333333] flex flex-col gap-5 pt-5 md:flex-1 md:border-l md:border-l-[#333333] first-of-type:border-l-0 md:border-y md:py-10 md:px-5">
            <h3 className="text-[10px]/[12px] font-bold tracking-[-0.6px] text-[#999999] uppercase">
              🏠 HouseMart
            </h3>

            <Link
              href="/about"
              className="text-[15px]/[22.5px] font-normal tracking-[-0.9px] text-white capitalize hover:text-[#169B4C]"
            >
              About HouseMart
            </Link>

            <div className="flex flex-col gap-3 md:flex-row md:gap-4">
              <Link href="/login">
                <button
                  className="flex gap-2 justify-center items-center rounded-[8px] bg-transparent px-5 h-12 cursor-pointer text-[#169B4C] border border-[#169B4C] capitalize transition-all hover:bg-[#169B4C] hover:text-white"
                  aria-label="List your property"
                >
                  lease
                </button>
              </Link>

              <Link href="/login">
                <button
                  className="flex gap-2 justify-center items-center rounded-[8px] bg-transparent px-5 h-12 cursor-pointer text-[#169B4C] border border-[#169B4C] capitalize transition-all hover:bg-[#169B4C] hover:text-white"
                  aria-label="List your property"
                >
                  Buy and sell
                </button>
              </Link>
            </div>
          </div>

          {/* Navigation Sections */}
          {footerNav.map((item, index) => (
            <div
              key={index}
              className="border-t border-[#333333] flex flex-col gap-5 pt-5 md:flex-1 md:border-l md:border-l-[#333333] md:border-y md:py-10 md:px-5"
            >
              <h3 className="text-[10px]/[12px] font-bold tracking-[-0.6px] text-[#999999] uppercase">
                {item.title}
              </h3>
              <div className="flex flex-col gap-3">
                {item.links.map((link, idx) => (
                  <Link
                    key={idx}
                    href={link.url}
                    className="text-[15px]/[22.5px] font-normal tracking-[-0.9px] text-white capitalize hover:text-[#169B4C]"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Decorative Text Divider */}
        <div className="border-y border-[#333333] pt-[15px] px-[6px] md:border-t-0 relative flex items-center justify-center">
          <h2 className="text-[80px] md:text-[160px] font-bold text-white/5 tracking-[-4px] select-none pointer-events-none text-center">
            HouseMart
          </h2>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col gap-8 items-start justify-center py-[30px] sm:items-center md:items-start md:flex-row-reverse md:justify-between">
          {/* Socials */}
          <div className="flex gap-6 items-center sm:justify-center md:justify-end flex-wrap">
            {socials.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform hover:scale-110"
              >
                <div
                  className="w-6 h-6 bg-no-repeat bg-contain bg-center brightness-90 hover:brightness-110"
                  style={{ backgroundImage: `url(${social.src})` }}
                  aria-label={social.name}
                />
              </a>
            ))}
          </div>

          {/* Policies and Copyright */}
          <div className="flex flex-col gap-6 items-start justify-center sm:items-center md:items-start md:flex-row md:gap-6">
            <Link
              href="/privacy"
              className="text-[13px]/[19.5px] font-normal tracking-[-0.78px] text-[#CCCCCC] capitalize hover:text-white"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-[13px]/[19.5px] font-normal tracking-[-0.78px] text-[#CCCCCC] capitalize hover:text-white"
            >
              Terms of Service
            </Link>
          </div>

          <p className="text-[13px]/[19.5px] font-normal tracking-[-0.78px] text-[#CCCCCC] capitalize">
            © {new Date().getFullYear()} HouseMart.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;