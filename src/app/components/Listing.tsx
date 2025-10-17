"use client"

import { useState, useEffect, useRef } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { EffectFade } from "swiper/modules"
import type { Swiper as SwiperType } from "swiper"
import "swiper/css"
import "swiper/css/effect-fade"

type Badge = {
  title: string
  icon?: string
}

type CardItem = {
  title: string
  amount?: string
  description?: string
  image?: string
  images?: string[]
  badges?: Badge[]
}

type CardListProps = {
  items: CardItem[]
}

export default function Listing({ items }: CardListProps) {
  const [showCount, setShowCount] = useState(3)
  const [isMobile, setIsMobile] = useState(true)
  const buttonRef = useRef<HTMLDivElement | null>(null)
  const swiperRefs = useRef<(SwiperType | null)[]>([])
  const intervalRefs = useRef<(NodeJS.Timeout | null)[]>([])

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 640
      setIsMobile(mobile)
      setShowCount(mobile ? 3 : 6)
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const handleToggle = () => {
    if (showCount >= items.length) {
      setShowCount(isMobile ? 3 : 6)
      setTimeout(() => {
        buttonRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
      }, 100)
    } else {
      setShowCount((prev) => Math.min(prev + (isMobile ? items.length : 3), items.length))
    }
  }

  const visibleItems = items.slice(0, showCount)

  const handleMouseEnter = (index: number) => {
    const swiper = swiperRefs.current[index]
    if (!swiper) return

    let i = 1
    const images = swiper.slides.length
    if (images <= 1) return

    if (intervalRefs.current[index]) clearInterval(intervalRefs.current[index]!)

    intervalRefs.current[index] = setInterval(() => {
      swiper.slideToLoop(i, 1200)
      i = (i + 1) % images
    }, 2000)
  }

  const handleMouseLeave = (index: number) => {
    const swiper = swiperRefs.current[index]
    if (!swiper) return

    if (intervalRefs.current[index]) {
      clearInterval(intervalRefs.current[index]!)
      intervalRefs.current[index] = null
    }

    swiper.slideToLoop(0, 1200)
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-[19px] md:text-[21px] font-medium text-black leading-snug uppercase">
        Available Listing
      </h2>

      <div className="flex flex-col gap-4 md:grid md:grid-cols-3 md:gap-6">
        {visibleItems.map((item, index) => (
          <div
            key={index}
            className="bg-[#F5F7FA] rounded-lg flex flex-col border border-[#E6E6E6] overflow-hidden"
          >
            {/* 🖼️ Image section (now background divs instead of <Image/>) */}
            <div
              className="relative w-full h-[260px] group overflow-hidden"
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={() => handleMouseLeave(index)}
            >
              <Swiper
                modules={[EffectFade]}
                effect="fade"
                speed={1200}
                loop={true}
                onSwiper={(swiper) => (swiperRefs.current[index] = swiper)}
                className="h-full w-full"
                allowTouchMove={false}
              >
                {(item.images && item.images.length > 0
                  ? item.images
                  : [item.image || "/placeholder.png"]
                ).map((img, i) => (
                  <SwiperSlide key={i}>
                    <div
                      className="w-full h-full bg-cover bg-center transition-all duration-[1200ms] ease-in-out group-hover:scale-105"
                      style={{
                        backgroundImage: `url(${img})`,
                      }}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* 🧩 Card content */}
            <div className="p-3 flex flex-col gap-4">
              {item.badges && (
                <div className="flex flex-wrap gap-2">
                  {item.badges.map((badge, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 border border-[#E6E6E6] rounded-full px-3 py-2 bg-[#F5F7FA] text-black"
                    >
                      {badge.icon && (
                        <div
                          className="w-4 h-4 bg-center bg-contain bg-no-repeat"
                          style={{
                            backgroundImage: `url(${badge.icon})`,
                          }}
                        />
                      )}
                      <span className="text-xs sm:text-sm font-normal text-black">
                        {badge.title}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex flex-col gap-2">
                <h2 className="text-[19px] md:text-[21px] font-medium text-black leading-snug">
                  {item.title}
                </h2>

                {item.description && (
                  <p className="text-[15px] md:text-[14px] text-[#666] leading-[150%]">
                    {item.description}
                  </p>
                )}

                {item.amount && (
                  <p className="text-[15px] md:text-[18px] text-[#139c01] leading-[150%] font-semibold">
                    {item.amount}
                    <span className="text-black">/month</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      <div ref={buttonRef} className="flex justify-center mt-4 w-full">
        {items.length > (isMobile ? 3 : 6) && (
          <button
            onClick={handleToggle}
            className="flex items-center justify-center gap-2 border rounded-md px-4 py-2 bg-white text-[#169B4C] font-medium border-[#E6E6E6] h-16 w-full sm:w-auto hover:bg-[#E8F5ED] cursor-pointer"
          >
            <span className="text-[15px] md:text-[14px] text-center">
              {showCount >= items.length ? "Load Less Housing" : "Load More Housing"}
            </span>
          </button>
        )}
      </div>
    </div>
  )
}