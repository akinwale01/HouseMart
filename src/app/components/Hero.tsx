"use client";

import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const heroContent = Array(5).fill({
  title: "Find Your Dream Home With Ease",
  description: "Buy, Rent or Sell Properties all in one place.",
  cta1: { text: "Explore Listings", href: "/listings", type: "primary" },
  cta2: { text: "Get Started", href: "/signup", type: "secondary" },
  image: "/images/hero-bg.jpg",
});

export default function Hero() {
  return (
    <section className="relative w-full h-[70vh] md:h-[500px] lg:h-[600px] overflow-hidden flex flex-col justify-end">
      <Swiper
        modules={[Autoplay, Pagination]}
        slidesPerView={1}
        loop
        grabCursor
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{
          clickable: true,
          el: ".custom-pagination",
        }}
        spaceBetween={16}
        className="h-full w-full"
      >
        {heroContent.map((item, index) => (
          <SwiperSlide key={index} className="relative h-full w-full">
            <div className="relative h-full w-full rounded-xl overflow-hidden">
              {/* Background image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-in-out hover:scale-105"
                style={{
                  backgroundImage: `url(${item.image})`,
                }}
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/40" />

              {/* Slide content */}
              <div className="relative z-10 flex flex-col justify-end h-full p-6 md:p-8 lg:p-10 gap-4 max-w-[600px]">
                <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold leading-snug tracking-tight">
                  {item.title}
                </h1>
                <p className="text-white text-base sm:text-lg md:text-xl opacity-90 leading-relaxed">
                  {item.description}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
                  <Link
                    href={item.cta1.href}
                    className="w-[200px] sm:w-auto bg-[#dd6e06] text-white font-semibold rounded-lg px-6 py-3 hover:bg-[#c85f04] transition text-center tracking-tight"
                  >
                    {item.cta1.text}
                  </Link>

                  <Link
                    href={item.cta2.href}
                    className="w-[200px] sm:w-auto bg-white text-[#dd6e06] font-semibold rounded-lg px-6 py-3 hover:bg-[#fff3e6] transition text-center tracking-tight"
                  >
                    {item.cta2.text}
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Pagination below the slider */}
      <div className="custom-pagination w-full flex justify-center mt-4" />

      {/* Custom Swiper pagination styling */}
      <style jsx>{`
        .custom-pagination .swiper-pagination-bullet {
          width: 12px;
          height: 12px;
          background: #ffffff80;
          border-radius: 50%;
          margin: 0 6px;
          transition: all 0.3s ease;
        }

        .custom-pagination .swiper-pagination-bullet-active {
          transform: scale(1.6);
          background: #169b4c;
        }
      `}</style>
    </section>
  );
}