"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Star, StarHalf } from "lucide-react";
import Hero from "../components/Hero";
import SignupPromptModal from "../components/SignupPromptModal";

type Property = {
  id: number;
  name: string;
  images: string[];
  shortDesc: string;
  longDesc: string;
  price: string;
  location: string;
  bedrooms?: number;
  baths?: number;
  verified?: boolean;
};

const properties: Property[] = [
  {
    id: 1,
    name: "Modern Downtown Apartment",
    images: ["/property1-1.jpg", "/property1-2.jpg", "/property1-3.jpg"],
    shortDesc: "2 Beds • 2 Baths • City Center",
    longDesc:
      "This modern apartment offers open-concept living with elegant finishes, abundant natural light, and a stunning skyline view. Features include a spacious kitchen with quartz counters, hardwood flooring, in-unit laundry, and a private balcony. Located steps from transit, cafes, and parks.",
    price: "$1,200/mo",
    location: "Downtown, New Jersey",
    bedrooms: 2,
    baths: 2,
    verified: true,
  },
  {
    id: 2,
    name: "Serene Luxury Villa",
    images: ["/property2-1.jpg", "/property2-2.jpg", "/property2-3.jpg"],
    shortDesc: "4 Beds • 3 Baths • Private Pool",
    longDesc:
      "A premium villa with a private pool, home theatre, and expansive outdoor living area. This property features high ceilings, a chef's kitchen, a landscaped yard, and a two-car garage. Ideal for families seeking privacy and luxury within a quiet neighborhood.",
    price: "$3,800/mo",
    location: "Austin, Texas",
    bedrooms: 4,
    baths: 3,
    verified: true,
  },
  {
    id: 3,
    name: "Cozy Suburban Home",
    images: ["/property3-1.jpg", "/property3-2.jpg", "/property3-3.jpg"],
    shortDesc: "3 Beds • 2 Baths • Family Friendly",
    longDesc:
      "A charming suburban home located in a peaceful community with nearby parks and highly rated schools. This house offers a warm living room with fireplace, an updated kitchen, and a backyard perfect for weekend gatherings.",
    price: "$2,200/mo",
    location: "San Diego, California",
    bedrooms: 3,
    baths: 2,
    verified: false,
  },
];


const testimonials = [
  {
    text: "“HouseMart made finding my new apartment so easy! Everything was smooth from start to finish.”",
    name: "Alex Johnson",
    location: "Tenant, New Jersey",
    stars: 5,
    img: "/user1.jpg",
  },
  {
    text: "“I listed my property and got multiple offers within days. Their platform made selling a breeze.”",
    name: "Sophie Carter",
    location: "Homeowner, Texas",
    stars: 4.5,
    img: "/user2.jpg",
  },
  {
    text: "“The best real estate experience I’ve had. Transparent, professional, and truly helpful throughout.”",
    name: "David Lee",
    location: "Buyer, California",
    stars: 5,
    img: "/user3.jpg",
  },
];

function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("house_mart_cookie_accepted");
    if (!accepted) setShow(true);
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("house_mart_cookie_accepted", "true");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white border shadow-lg rounded-xl p-5 z-50 w-[92%] max-w-lg flex flex-col md:flex-row items-center justify-between gap-4">
      <p className="text-gray-700 text-sm md:text-base leading-[1.5]">
        We use cookies to ensure you get the best experience on HouseMart. By continuing, you agree to our{" "}
        <Link href="/legal" className="text-orange-500 font-semibold hover:underline">
          Terms & Conditions and Privacy Policy
        </Link>.
      </p>
      <button
        onClick={acceptCookies}
        className="bg-orange-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-orange-600 transition"
      >
        Accept
      </button>
    </div>
  );
}

export default function HomePage() {
  const [selected, setSelected] = useState<Property | null>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [stats, setStats] = useState({ homes: 0, tenants: 0, rating: 0 });
  const [showSignup, setShowSignup] = useState(false);
  const locationsRef = useRef<HTMLDivElement | null>(null);



  // Stats animation
  useEffect(() => {
    let rafId = 0;
    const start = performance.now();
    const duration = 900;
    const from = { homes: 0, tenants: 0, rating: 0 };
    const to = { homes: 12458, tenants: 5320, rating: 49 };
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const ease = 1 - Math.pow(1 - t, 3);
      setStats({
        homes: Math.round(from.homes + (to.homes - from.homes) * ease),
        tenants: Math.round(from.tenants + (to.tenants - from.tenants) * ease),
        rating: Math.round(from.rating + (to.rating - from.rating) * ease),
      });
      if (t < 1) rafId = requestAnimationFrame(step);
    };
    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, []);

  // Carousel keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
      if (!selected) return;
      if (e.key === "ArrowLeft") setCarouselIndex((i) => (i <= 0 ? selected.images.length - 1 : i - 1));
      if (e.key === "ArrowRight") setCarouselIndex((i) => (i >= selected.images.length - 1 ? 0 : i + 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  useEffect(() => {
    setCarouselIndex(0);
  }, [selected]);

  // Auto-scroll popular locations
  useEffect(() => {
    const el = locationsRef.current;
    if (!el) return;
    let pos = 0;
    let raf = 0;
    const speed = 0.4;
    const step = () => {
      pos += speed;
      if (pos >= el.scrollWidth / 2) pos = 0;
      el.scrollLeft = pos;
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  const prevSlide = () => { if (!selected) return; setCarouselIndex((i) => (i <= 0 ? selected.images.length - 1 : i - 1)); };
  const nextSlide = () => { if (!selected) return; setCarouselIndex((i) => (i >= selected.images.length - 1 ? 0 : i + 1)); };

  return (
    <main className="flex flex-col gap-16 lg:mx-auto lg:max-w-[1440px] pb-20 pt-50 px-4 md:px-14">
      <CookieConsent />

      {/* Hero */}
        <Hero />




      {/* Featured Properties */}
      <section className="flex flex-col gap-8">
        <h2 className="text-3xl md:text-4xl font-semibold text-black ">Featured Properties</h2>
        <p className="text-gray-600 max-w-3xl">Handpicked listings selected for comfort, design, and location.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((p) => (
            <motion.article key={p.id} whileHover={{ y: -6 }} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="h-56 bg-cover bg-center" style={{ backgroundImage: `url(${p.images[0]})` }} />
              <div className="p-5 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{p.name}</h3>
                    <div className="text-sm text-gray-500">{p.shortDesc}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">{p.location}</div>
                    <div className="font-semibold text-gray-900">{p.price}</div>
                  </div>
                </div>
                <p className=" text-gray-600 text-sm leading-relaxed">{p.longDesc.slice(0, 120)}...</p>
                <div className="mt-4 flex items-center justify-between">
                  <button onClick={() => setSelected(p)} className="text-orange-500 font-semibold hover:text-orange-600">View Details →</button>
                  <div className="flex gap-2">
                    {p.verified && <div className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full">Verified</div>}
                    <div className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">{p.bedrooms ?? "-"} bd</div>
                    <div className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">{p.baths ?? "-"} ba</div>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>


      {/* Stats */}
      <section className=" bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex md:flex-row flex-col sm:flex-row gap-6 text-center justify-center items-center">
          <div className="flex flex-col gap-1">
            <div className="text-3xl font-bold text-gray-900">{stats.homes.toLocaleString()}</div>
            <div className="text-sm text-gray-500">Homes Listed</div>
          </div>

          <div className="flex flex-col gap-1">
            <div className="text-3xl font-bold text-gray-900">{stats.tenants.toLocaleString()}</div>
            <div className="text-sm text-gray-500">Happy Tenants</div>
          </div>

          <div className="flex flex-col gap-1">
            <div className="text-3xl font-bold text-gray-900">{(stats.rating / 10).toFixed(1)}/5</div>
            <div className="text-sm text-gray-500">Average Rating</div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="relative w-full rounded-2xl overflow-hidden bg-[#fefcf9] flex flex-col lg:flex-row items-stretch shadow-sm">
        <div className="flex-1 min-h-[300px] bg-center bg-cover lg:rounded-l-2xl" style={{ backgroundImage: "url('/modern-home.jpg')" }} />
        <div className="flex-1 flex flex-col justify-center p-8 md:p-12 bg-white gap-4">
          <h2 className="md:text-3xl text-2xl font-semibold">Why Choose <span className="text-orange-500">HouseMart</span></h2>
          <p className="text-gray-600">We connect you to comfort, trust, and value. Every listing is verified and backed by dedicated support.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-[#fff6ef] rounded-lg border border-orange-100 flex flex-col gap-2">
              <div className="text-2xl">🏠</div>
              <h4 className="font-semibold">Verified Properties</h4>
              <p className="text-sm text-gray-600">Listings are vetted to meet our quality standards.</p>
            </div>
            <div className="p-4 bg-[#fff6ef] rounded-lg border border-orange-100 flex flex-col gap-2">
              <div className="text-2xl">💬</div>
              <h4 className="font-semibold">Dedicated Support</h4>
              <p className="text-sm text-gray-600">Always available to help you from start to finish — anytime, anywhere.</p>
            </div>
            <div className="p-4 bg-[#fff6ef] rounded-lg border border-orange-100 flex flex-col gap-2">
              <div className="text-2xl">🔒</div>
              <h4 className="font-semibold">Safe & Transparent</h4>
              <p className="text-sm text-gray-600">Clear contracts, secure payments, and honest communication — no hidden surprises.</p>
            </div>
            <div className="p-4 bg-[#fff6ef] rounded-lg border border-orange-100 flex flex-col gap-2">
              <div className="text-2xl">🚀</div>
              <h4 className="font-semibold">Quick & Hassle-Free</h4>
              <p className="text-sm text-gray-600">From viewing to moving in, our streamlined process saves you time and effort.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="flex flex-col items-center text-center py-20 overflow-hidden gap-4">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-semibold text-black leading-[140%] tracking-[-0.02em]"
        >
          What Our Clients Say
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-[#444] max-w-2xl leading-[170%] tracking-[-0.02em] pb-6"
        >
          Hear from real people who found their dream homes with us.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full">
          {testimonials.map((review, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-transform duration-300 hover:-translate-y-1 flex flex-col gap-4"
            >
              <div className="flex justify-center flex-row gap-4">
                {[...Array(Math.floor(review.stars))].map((_, i) => (
                  <Star key={i} size={18} className="text-[#f5b100] fill-[#f5b100] mx-[2px]" />
                ))}
                {review.stars % 1 !== 0 && <StarHalf size={18} className="text-[#f5b100] fill-[#f5b100] mx-[2px]" />}
              </div>
              <p className="text-gray-700 italic leading-[170%]">{review.text}</p>
              <div className="flex items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-full bg-cover bg-center" style={{ backgroundImage: `url(${review.img})` }} />
                <div className="text-left">
                  <h4 className="text-sm font-semibold text-gray-900">{review.name}</h4>
                  <p className="text-xs text-gray-500">{review.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Property Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/60" onClick={() => setSelected(null)} />
            <motion.div
              initial={{ y: 20, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative bg-white rounded-2xl max-w-4xl w-full p-6 shadow-2xl overflow-hidden"
            >
              <button onClick={() => setSelected(null)} className="absolute top-3 right-3 text-gray-500 hover:text-gray-900">
                <X size={24} />
              </button>
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1 relative">
                  <div className="h-64 lg:h-96 w-full overflow-hidden rounded-xl">
                    <img src={selected.images[carouselIndex]} alt={selected.name} className="w-full h-full object-cover" />
                  </div>
                  <button onClick={prevSlide} className="absolute top-1/2 left-2 -translate-y-1/2 bg-white rounded-full p-2 shadow">
                    <ChevronLeft size={20} />
                  </button>
                  <button onClick={nextSlide} className="absolute top-1/2 right-2 -translate-y-1/2 bg-white rounded-full p-2 shadow">
                    <ChevronRight size={20} />
                  </button>
                  <div className="flex gap-2 mt-2 justify-center">
                    {selected.images.map((_, idx) => (
                      <span key={idx} className={`w-2 h-2 rounded-full ${carouselIndex === idx ? "bg-orange-500" : "bg-gray-300"}`} />
                    ))}
                  </div>
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-900">{selected.name}</h3>
                    <p className="text-gray-600 mt-2">{selected.longDesc}</p>
                    <div className="mt-4 text-gray-800 font-semibold">{selected.price}</div>
                    <div className="mt-1 text-sm text-gray-500">{selected.location}</div>
                  </div>
                  <div className="mt-6 flex gap-3">
                    <button onClick={() => setShowSignup(true)} className="bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-600">
                      View Full Listing
                    </button>
                    <button onClick={() => setShowSignup(true)} className="border border-gray-300 px-4 py-2 rounded-lg hover:shadow">
                      Contact Agent
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Signup Prompt Modal */}
      <AnimatePresence>{showSignup && <SignupPromptModal onClose={() => setShowSignup(false)} />}</AnimatePresence>
    </main>
  );
}