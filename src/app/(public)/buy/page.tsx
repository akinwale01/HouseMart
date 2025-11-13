"use client"

import { useState, useMemo } from "react"
import filterData from "../../data/filter.json"
import Filter from "../../components/Filter"
import locationData from "../../data/location.json"
import Location from "../../components/Location"
import Listing from "../../components/Listing"
import buy from "../../data/buy.json"

import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Pagination } from "swiper/modules"
import "swiper/css"
import "swiper/css/pagination"

export default function BuyPage() {
  const [selectedFilter, setSelectedFilter] = useState(0)
  const [selectedLocation, setSelectedLocation] = useState(0)

  const selectedCategory = filterData[selectedFilter]?.title
  const selectedCity = locationData[selectedLocation]?.title

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

  const filteredBusinesses = useMemo(() => {
    return buy.filter(biz => {
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
      <section className="flex flex-col gap-24 lg:mx-auto lg:max-w-[1440px] pb-30 pt-50 px-4 md:px-14">

        {/* --- HERO SECTION --- */}
        <section className="relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh] overflow-hidden flex flex-col justify-center items-center rounded-xl">
          <Swiper
            modules={[Autoplay, Pagination]}
            slidesPerView={1}
            loop
            grabCursor
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            pagination={{ clickable: true, el: ".custom-pagination" }}
            spaceBetween={16}
            className="h-full w-full"
          >
            {Array(3).fill(0).map((_, index) => (
              <SwiperSlide key={index} className="relative h-full w-full">
                <div className="flex flex-col text-center w-full h-full bg-black/50 justify-center items-center rounded-xl p-4 sm:p-6 md:p-8 lg:p-10">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-snug sm:leading-tight md:leading-tight tracking-[-0.02em] mb-2 sm:mb-4">
                    Buy A Property
                  </h2>
                  <p className="text-white/90 mt-2 sm:mt-4 max-w-full sm:max-w-2xl text-sm sm:text-base md:text-lg leading-[160%] tracking-[-0.02em]">
                    Discover your dream home from our diverse range of properties on sale.
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Pagination Container */}
          <div className="custom-pagination w-full flex justify-center mt-4" />

          <style jsx>{`
            .custom-pagination .swiper-pagination-bullet {
              width: 10px;
              height: 10px;
              background: #ffffff80;
              border-radius: 50%;
              margin: 0 6px;
              transition: transform 0.3s ease, background 0.3s ease;
            }
            .custom-pagination .swiper-pagination-bullet-active {
              transform: scale(1.4);
              background: #169b4c;
            }
          `}</style>
        </section>

        {/* --- WHY BUY SECTION --- */}
        <section className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
          <div className="flex-1 flex flex-col gap-4 md:gap-6">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-black leading-[140%] tracking-[-0.02em] text-left">
              Why Buy A Property With Us?
            </h2>
            <p className="text-[#333] text-left text-[15px] sm:text-[16px] md:text-[17px] leading-[170%] tracking-[-0.02em] max-w-full md:max-w-2xl">
              Buying a property with us is more than just a transaction—it’s an investment in your future. Every property is carefully selected to meet our high standards, ensuring you move into a space that is well-maintained, secure, and ready to live in. With transparent pricing and dedicated support, we take care of the details so you can focus on enjoying your new home. From modern apartments to family homes and cozy studios, our properties are designed to fit your lifestyle and budget, making the buying process simple, stress-free, and rewarding. <span className="text-[#dd6e06] font-bold">Explore our wide range of options below and find the perfect place to call home.</span>
            </p>
          </div>

          <div className="flex-1 w-full h-[200px] sm:h-[250px] md:h-[300px] rounded-xl overflow-hidden md:mt-4">
            <video
              src="/images/bought.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
        </section>

        {/* --- FILTER SECTION --- */}
        <section className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-[14px] sm:text-[15px] md:text-[16px] leading-[150%] tracking-[-0.02em] font-semibold uppercase">
              Categories
            </h1>
            <Filter
              items={filterData}
              selected={selectedFilter}
              onSelect={setSelectedFilter}
            />
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="text-[14px] sm:text-[15px] md:text-[16px] leading-[150%] tracking-[-0.02em] font-semibold uppercase">
              Location
            </h1>
            <Location
              items={locationData}
              selected={selectedLocation}
              onSelect={setSelectedLocation}
            />
          </div>
        </section>

        {/* --- BUSINESS LISTING --- */}
        <section className="flex flex-col gap-6">
          {filteredBusinesses.length > 0 ? (
            <Listing items={filteredBusinesses} />
          ) : (
            <div className="flex justify-center items-center rounded-2xl border border-gray-200 h-[150px] sm:h-[200px] md:h-[250px]">
              <p className="text-gray-500 text-center capitalize text-[16px] sm:text-[18px] md:text-[20px] leading-[150%] tracking-[-0.02em]">
                No Housing Available
              </p>
            </div>
          )}
        </section>
      </section>
    </main>
  )
}