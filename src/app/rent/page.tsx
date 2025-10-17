"use client"

import { useState, useMemo } from "react"

import filterData from "../data/filter.json"
import Filter from "../components/Filter"

import locationData from "../data/location.json"
import Location from "../components/Location"

import GreenBoxNigeria from "../components/Listing"
import listing from "../data/listing.json"

import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Pagination } from "swiper/modules"
import "swiper/css"
import "swiper/css/pagination"

export default function RentPage() {
  const [selectedFilter, setSelectedFilter] = useState(0)
  const [selectedLocation, setSelectedLocation] = useState(0)

  const selectedCategory = filterData[selectedFilter]?.title
  const selectedCity = locationData[selectedLocation]?.title

  // --- 🔍 fuzzy filter matching helper ---
  const matchesFilter = (badgeTitle: string, filterTitle: string) => {
    const normalize = (str: string) =>
      str.toLowerCase().replace(/[-&\/]/g, "").replace(/\s+/g, " ").trim()

    const badge = normalize(badgeTitle)
    const filter = normalize(filterTitle)

    const keywords = [
      ["eco", "eco-friendly", "green"],
      ["home", "house", "domestic"],
      ["beauty", "skincare", "cosmetic"],
      ["fashion", "clothing", "apparel", "wear"],
      ["clean", "cleaning", "detergent"],
      ["health", "wellness", "fitness"],
      ["recycle", "recycled", "upcycled"],
      ["tech", "innovation", "device", "solar"],
      ["grocery", "packaging", "plastic-free"],
      ["natural", "organic"],
    ]

    return (
      badge.includes(filter) ||
      filter.includes(badge) ||
      keywords.some(group =>
        group.some(word => badge.includes(word) && filter.includes(word))
      )
    )
  }

  // --- ✅ Filter businesses using fuzzy logic ---
  const filteredBusinesses = useMemo(() => {
    return listing.filter(biz => {
      const hasCategory =
        selectedCategory === "All" ||
        biz.badges?.some(badge => matchesFilter(badge.title, selectedCategory))

      const hasLocation =
        selectedCity === "All" ||
        biz.badges?.some(badge => matchesFilter(badge.title, selectedCity))

      return hasCategory && hasLocation
    })
  }, [selectedCategory, selectedCity])

  return (
    <main>
      <section className="flex flex-col gap-16 lg:mx-auto lg:max-w-[1440px] pb-30 pt-50 px-4 md:px-14">
        {/* --- RENT HERO SECTION WITH SWIPER --- */}
        <section className="relative w-full h-[70vh] md:h-[500px] overflow-hidden flex flex-col justify-center items-center rounded-xl">
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
            {Array(3)
              .fill(0)
              .map((_, index) => (
                <SwiperSlide key={index} className="relative h-full w-full">
                  <div className="flex flex-col text-center w-full h-full bg-black/50 justify-center items-center rounded-xl p-6 md:p-8 lg:p-10">
                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-[120%] tracking-[-0.02em]">
                      Rent A Property
                    </h2>
                    <p className="text-white/90 mt-4 max-w-2xl text-base md:text-lg leading-[160%] tracking-[-0.02em]">
                      Discover your next home with ease and confidence.
                    </p>
                  </div>
                </SwiperSlide>
              ))}
          </Swiper>

          {/* Pagination Container */}
          <div className="custom-pagination w-full flex justify-center mt-4" />

          {/* Custom CSS for pagination bullets */}
          <style jsx>{`
            .custom-pagination .swiper-pagination-bullet {
              width: 12px;
              height: 12px;
              background: #ffffff80;
              border-radius: 50%;
              margin: 0 8px;
              transition: transform 0.3s ease, background 0.3s ease;
            }

            .custom-pagination .swiper-pagination-bullet-active {
              transform: scale(1.6);
              background: #169b4c;
            }
          `}</style>
        </section>

        {/* --- 🏠 RENT WITH US NOTE SECTION --- */}
        <section className="flex flex-col items-start justify-center gap-6 py-8 md:py-10">
          <h2 className="text-2xl md:text-3xl font-semibold text-black leading-[140%] tracking-[-0.02em] text-left">
            Experience Stress-Free Renting with Us
          </h2>
          <p className="text-[#333] text-left text-[16px] md:text-[15px] leading-[170%] tracking-[-0.02em] max-w-4xl">
            Renting a property with us means more than just finding a place to
            live, it’s about experiencing comfort, convenience, and peace of
            mind. Every rental comes with well-maintained, move-in ready spaces,
            transparent pricing, and responsive support whenever you need it. We
            take care of the details, from reliable maintenance and secure
            environments, to flexible lease options, so you can focus on living
            your best life. Whether you’re looking for a modern apartment, a
            family home, or a cozy studio, our properties are designed to suit
            your lifestyle and budget, making your rental journey simple,
            stress-free, and rewarding. <span className="text-[#dd6e06] font-bold">Check out what suits you from our options available.</span>
          </p>
        </section>

        {/* FILTER SECTION */}
        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <h1 className="text-[15px] md:text-[16px] leading-[150%] tracking-[-0.02em] font-semibold uppercase">
              Categories
            </h1>
            <Filter
              items={filterData}
              selected={selectedFilter}
              onSelect={setSelectedFilter}
            />
          </div>

          <div className="flex flex-col gap-3">
            <h1 className="text-[15px] md:text-[16px] leading-[150%] tracking-[-0.02em] font-semibold uppercase">
              Location
            </h1>
            <Location
              items={locationData}
              selected={selectedLocation}
              onSelect={setSelectedLocation}
            />
          </div>
        </section>

        {/* BUSINESS LISTING */}
        <section className="flex flex-col gap-8">
          {filteredBusinesses.length > 0 ? (
            <GreenBoxNigeria items={filteredBusinesses} />
          ) : (
            <div className="flex justify-center items-center rounded-2xl border border-gray-200 md:h-[300px] h-[200px]">
              <p className="text-gray-500 text-center capitalize text-[19px] md:text-[21px] leading-[150%] tracking-[-0.02em]">
                No Housing Available
              </p>
            </div>
          )}
        </section>
      </section>
    </main>
  )
}