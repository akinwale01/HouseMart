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
        grabCursor={true}
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
              {/* Background */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${item.image})` }}
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/40" />
              {/* Content */}
              <div className="relative z-10 flex flex-col justify-end h-full p-6 md:p-8 lg:p-10 gap-4 max-w-[600px]">
                <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold leading-snug">
                  {item.title}
                </h1>
                <p className="text-white text-lg sm:text-xl md:text-2xl">
                  {item.description}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
                  <Link
                    href={item.cta1.href}
                    className="w-[200px] sm:w-auto bg-orange-500 text-white font-semibold rounded-lg px-6 py-3 hover:bg-orange-600 transition text-center"
                  >
                    {item.cta1.text}
                  </Link>
                  <Link
                    href={item.cta2.href}
                    className="w-[200px] sm:w-auto bg-white text-orange-500 font-semibold rounded-lg px-6 py-3 hover:bg-orange-50 transition text-center"
                  >
                    {item.cta2.text}
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Pagination Container */}
      <div className="custom-pagination w-full flex justify-center mt-4" />

      {/* Custom CSS */}
      <style jsx>{`
        .custom-pagination .swiper-pagination-bullet {
          width: 12px;
          height: 12px;
          background: #ffffff80;
          border-radius: 50%;
          margin: 0 6px;
          transition: all 0.3s ease; /* smooth transition */
        }

        /* Active bullet grows bigger */
        .custom-pagination .swiper-pagination-bullet-active {
          width: 24px; /* increased width */
          height: 24px; /* increased height */
          background: #169b4c;
        }
      `}</style>
    </section>
  );
}