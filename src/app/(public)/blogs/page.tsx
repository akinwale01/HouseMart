"use client";

import blogs from "../../data/blogs.json";
import { useState, useEffect } from "react";

export default function BlogsPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Auto-slide logic for featured section
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) {
        // prefer server message, fallback to generic
        throw new Error(data?.error || data?.message || "Something went wrong");
      }

      setSuccess(true);
      setEmail("");
    } catch (err) {
      // type-safe error handling (no use of `any`)
      const message =
        err instanceof Error ? err.message : typeof err === "string" ? err : "An unknown error occurred";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const featured = blogs.slice(0, 3);

  return (
    <main className="flex flex-col lg:mx-auto lg:max-w-[1440px] pb-24 pt-50 px-4 md:px-14 bg-[#fffefc] text-gray-900">

      {/* ===== HERO ===== */}
      <section className="relative w-full h-[70vh] rounded-2xl overflow-hidden mb-24">
        <div
          className="absolute inset-0 bg-cover bg-center scale-105 hover:scale-110 transition-transform duration-[4s]"
          style={{ backgroundImage: 'url("/blogs-hero.jpg")' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20 flex flex-col justify-center items-start px-10 md:px-16">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-[120%] tracking-tight mb-4 drop-shadow-lg">
            Discover, Dream & Design Better Living
          </h1>
          <p className="text-white/90 text-lg md:text-xl max-w-2xl leading-[165%]">
            Dive into stories that redefine homes, inspire creativity, and celebrate the art of living beautifully.
          </p>
        </div>
      </section>

      {/* ===== FEATURED SLIDER ===== */}
      <section className="mb-24">
        <h2 className="text-3xl md:text-4xl font-semibold text-black text-center mb-10">
          Featured Stories
        </h2>
        <div className="relative w-full h-[480px] rounded-2xl overflow-hidden">
          {featured.map((post, index) => (
            <a
              key={post.id}
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`absolute inset-0 transition-opacity duration-1000 ${
                currentSlide === index ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${post.image})` }}
              />
              <div className="absolute inset-0 bg-black/50 flex flex-col justify-end p-10 md:p-16">
                <p className="text-orange-400 text-sm font-semibold uppercase tracking-[0.15em] mb-2">
                  {post.category}
                </p>
                <h3 className="text-3xl md:text-4xl font-bold text-white max-w-2xl leading-[130%] mb-3">
                  {post.title}
                </h3>
                <p className="text-white/90 max-w-xl leading-[160%] text-[17px] mb-4">
                  {post.desc}
                </p>
                <p className="text-white/70 text-sm">
                  {post.author} — {post.date}
                </p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ===== QUOTE BLOCK ===== */}
      <section className="bg-[#fff7ef] border border-orange-100 rounded-2xl p-10 md:p-14 text-center mb-24 shadow-sm">
        <p className="text-2xl md:text-3xl font-medium text-black leading-[150%] max-w-3xl mx-auto italic">
          “Every home tells a story. Some whisper, others roar — but all reveal who we truly are.”
        </p>
        <p className="mt-4 text-orange-500 uppercase text-sm tracking-[0.2em] font-semibold">
          – Modern Habitat Journal
        </p>
      </section>

      {/* ===== LATEST BLOGS GRID ===== */}
      <section className="w-full mb-24">
        <h2 className="text-3xl md:text-4xl font-semibold text-black text-center mb-14">
          Latest Articles
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {blogs.map((blog) => (
            <a
              key={blog.id}
              href={blog.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-500"
            >
              <div
                className="h-[240px] bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
                style={{ backgroundImage: `url("${blog.image}")` }}
              ></div>
              <div className="p-6 flex flex-col">
                <p className="text-orange-500 uppercase text-xs font-semibold mb-2 tracking-[0.15em]">
                  {blog.category}
                </p>
                <h3 className="text-lg font-semibold text-gray-900 leading-[140%] mb-2 group-hover:text-orange-600 transition-colors">
                  {blog.title}
                </h3>
                <p className="text-gray-600 text-[15px] leading-[165%] mb-4 line-clamp-3">
                  {blog.desc}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{blog.author}</span>
                  <span>{blog.date}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ===== EDITOR’S PICKS ===== */}
      <section className="relative mb-28">
        <h2 className="text-3xl md:text-4xl font-semibold text-black text-center mb-12">
          Editor’s Picks
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Feature */}
          <a
            href="https://www.archdaily.com/1012340/the-rise-of-biophilic-design"
            target="_blank"
            rel="noopener noreferrer"
            className="relative col-span-2 h-[500px] rounded-3xl overflow-hidden group shadow-lg"
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: "url('/editors-pick.jpg')" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
            <div className="absolute bottom-10 left-10 text-white z-10 max-w-xl">
              <span className="text-orange-400 uppercase text-sm font-semibold tracking-widest">
                Design & Lifestyle
              </span>
              <h3 className="text-3xl md:text-4xl font-bold leading-[130%] mb-3">
                The Rise of Biophilic Design in Urban Living
              </h3>
              <p className="text-white/85 mb-5 leading-[160%]">
                Discover how architects are bringing nature into the heart of the city, transforming apartments into living ecosystems.
              </p>
              <button className="bg-orange-600 px-6 py-2 rounded-full text-sm font-semibold hover:bg-orange-700 transition">
                Read Feature →
              </button>
            </div>
          </a>

          {/* Side Picks */}
          <div className="flex flex-col gap-6">
            {[
              {
                title: "Sustainable Homes That Power Themselves",
                desc: "From solar roofing to AI energy monitoring, see how modern homes are becoming self-reliant.",
                image: "/eco-home.jpg",
                url: "https://www.dezeen.com/2024/11/21/self-powering-homes/",
              },
              {
                title: "How Minimalism is Shaping Family Spaces",
                desc: "Simplicity meets connection — explore how less design can lead to more meaningful living.",
                image: "/minimal-home.jpg",
                url: "https://www.architecturaldigest.com/story/minimalism-family-living",
              },
            ].map((pick, i) => (
              <a
                key={i}
                href={pick.url}
                target="_blank"
                rel="noopener noreferrer"
                className="relative h-[240px] rounded-2xl overflow-hidden group shadow-md hover:shadow-xl transition"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${pick.image})` }}
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition"></div>
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <h4 className="text-lg font-semibold mb-2 leading-[130%]">{pick.title}</h4>
                  <p className="text-white/85 text-sm line-clamp-2">{pick.desc}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TRENDING TAGS ===== */}
      <section className="text-center mb-24">
        <h2 className="text-3xl md:text-4xl font-semibold text-black mb-8">
          Trending Topics
        </h2>
        <div className="flex flex-wrap justify-center gap-3">
          {[
            { name: "Tiny Homes", slug: "tiny-homes" },
            { name: "Minimalism", slug: "minimalism" },
            { name: "Home Interior", slug: "design-trends" },
            { name: "Smart Homes", slug: "smart-homes" },
          ].map((tag, i) => (
            <a
              key={i}
              href={`/blogs/topics/${tag.slug}`}
              className="px-5 py-2 border border-orange-300 bg-orange-50 rounded-full text-sm text-orange-700 hover:bg-orange-600 hover:text-white transition"
            >
              #{tag.name}
            </a>
          ))}
        </div>
      </section>

      {/* ===== REAL SUBSCRIPTION FORM ===== */}
      <section className="bg-[#fff3e6] border border-orange-100 rounded-2xl p-10 md:p-14 text-center mb-24">
        <h2 className="text-3xl font-semibold text-black mb-4">
          Join 20,000+ Readers Who Love Home Inspiration
        </h2>
        <p className="text-[#555] mb-6">
          Get design stories, renovation tips, and property insights delivered to your inbox every week.
        </p>

        <form
          onSubmit={handleSubscribe}
          className="flex flex-col sm:flex-row justify-center items-center gap-3 max-w-xl mx-auto"
        >
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full sm:flex-1 px-5 py-3 border border-gray-300 rounded-full text-gray-700 focus:outline-none focus:border-orange-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-orange-600 text-white px-8 py-3 rounded-full text-[16px] font-semibold hover:bg-orange-700 transition disabled:opacity-60"
          >
            {loading ? "Subscribing..." : "Subscribe"}
          </button>
        </form>

        {success && (
          <p className="text-green-600 mt-4 font-medium">
            ✅ You’re subscribed! Check your email for confirmation.
          </p>
        )}
        {error && (
          <p className="text-red-600 mt-4 font-medium">⚠️ {error}</p>
        )}
      </section>

      {/* ===== CTA ===== */}
      <section className="mt-10 w-full text-center bg-[#fff6ef] rounded-2xl border border-orange-100 p-14 shadow-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-5 bg-repeat" />
        <h2 className="text-3xl md:text-4xl font-semibold text-black leading-[135%] mb-4 relative z-10">
          Share Your Home Story
        </h2>
        <p className="text-[#444] text-[17px] leading-[170%] max-w-2xl mx-auto mb-8 relative z-10">
          Do you have a renovation journey, a design idea, or a space that tells your story?
          Join our community and inspire others.
        </p>
        <a
          href="#"
          className="bg-orange-600 text-white px-8 py-3 rounded-full text-[16px] font-semibold hover:bg-orange-700 transition relative z-10"
        >
          Submit Your Story
        </a>
      </section>
    </main>
  );
}