"use client";

import { notFound } from "next/navigation";
import Image from "next/image";
import { use } from "react"; // ✅ Needed for Next.js 15 param unwrapping

type Topic = {
  title: string;
  desc: string;
  content: string;
  image: string;
};

const topicStories: Record<string, Topic> = {
  "tiny-homes": {
    title: "The Tiny Homes Revolution",
    desc: "How small-space living is changing modern housing and inspiring a new wave of minimalist lifestyles.",
    content: `
      Tiny homes have become a worldwide phenomenon — blending sustainability,
      simplicity, and affordability. Homeowners are now choosing smaller,
      smarter spaces that encourage mindful living and financial freedom.
      From off-grid cabins to urban micro-apartments, the movement continues
      to inspire new forms of design and minimalism.

      These homes aren't just about size — they’re about freedom.
      People are embracing a lifestyle with fewer possessions, less debt,
      and more mobility. The tiny home movement has sparked innovation in
      modular architecture, eco-friendly building materials, and community-oriented living spaces.

      It’s not about having less, but about making room for what truly matters.
    `,
    image: "/blogs/tiny-homes.jpg",
  },

  "minimalism": {
    title: "The Rise of Minimalism in Modern Homes",
    desc: "Declutter your space, declutter your life — discover how minimal design creates mental clarity.",
    content: `
      Minimalism isn’t just about less furniture — it’s a mindset.
      People around the world are embracing clean lines, open layouts, and
      intentional living. By focusing on what truly matters, minimalists
      are creating homes that bring peace, purpose, and clarity.

      The movement has also transformed interior design: natural light,
      functional layouts, and subtle tones are now leading the way in creating
      peaceful, timeless spaces.

      In 2025, minimalism continues to grow not as a trend but as a lifestyle philosophy.
    `,
    image: "/blogs/minimalism.jpg",
  },

  "smart-homes": {
    title: "Smart Homes: The Future of Living",
    desc: "From AI assistants to self-adjusting lighting, the home of the future is here — and it’s intelligent.",
    content: `
      The rise of smart technology is transforming everyday life. With devices
      that learn habits, optimize energy, and enhance comfort, homes are becoming
      more connected than ever. But convenience comes with new questions about
      privacy, control, and data security.

      AI-driven thermostats, automated lighting, and smart appliances are reshaping
      how we experience comfort, safety, and personalization at home.
      In the coming years, the line between technology and lifestyle will blur even further.
    `,
    image: "/blogs/smart-living.jpg",
  },



"design-trends": {
    title: "2025 Home Design Trends You Should Know",
    desc: "Discover what’s shaping homes this year — from biophilic design to hybrid living spaces.",
    content: `
      2025 brings an exciting mix of creativity and practicality in home design.
      Expect to see natural textures, smart modular layouts, and more flexible
      spaces that adapt to work, relaxation, and wellness.
      spaces that adapt to work, relaxation, and wellness.

      Designers are blending function with emotion — creating spaces that feel
      alive, soothing, and meaningful. Whether it’s handcrafted decor or
      eco-innovation, this year’s trends celebrate comfort and individuality.
    `,
    image: "/blogs/design-trends.jpg",
  },
};

interface TopicPageProps {
  params: Promise<{ slug: string }>; // ✅ Future-safe type for Next.js 15
}

export default function TopicPage({ params }: TopicPageProps) {
  const { slug } = use(params); // ✅ unwrap params
  const topic = topicStories[slug];

  if (!topic) return notFound();

  return (
    <main className="flex flex-col items-center justify-start lg:mx-auto lg:max-w-[1440px] px-4 md:px-14 pt-50 pb-32 text-gray-900 leading-relaxed tracking-[0.02em]">
      {/* ====== Cover Image ====== */}
      <div className="w-full h-[350px] md:h-[450px] relative rounded-2xl overflow-hidden shadow-md mb-12">
        <Image
          src={topic.image}
          alt={topic.title}
          fill
          className="object-cover transition-transform duration-700 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/60 to-black/70 flex items-end p-8 md:p-12">
          <h1 className="text-3xl md:text-5xl font-bold text-white leading-[130%] tracking-tight drop-shadow-lg">
            {topic.title}
          </h1>
        </div>
      </div>

      {/* ====== Content ====== */}
      <article className="max-w-3xl text-[17px] text-[#444] leading-[185%] tracking-[0.01em]">
        <p className="text-xl text-gray-700 mb-6 italic">{topic.desc}</p>
        <div className="whitespace-pre-line">{topic.content}</div>
      </article>

      {/* ====== Related Topics ====== */}
      <section className="mt-20 w-full">
        <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-gray-900 text-left">
          Related Reads You Might Enjoy
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(topicStories)
            .filter(([key]) => key !== slug)
            .slice(0, 3)
            .map(([relatedSlug, related]) => (
              <a
                key={relatedSlug}
                href={`/blogs/topics/${relatedSlug}`}
                className="group flex flex-col rounded-xl border border-gray-200 hover:shadow-xl transition-all duration-300 bg-white overflow-hidden"
              >
                <div
                  className="w-full h-[200px] bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url(${related.image})` }}
                ></div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 leading-[140%] group-hover:text-[#169b4c] transition-colors">
                    {related.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-[165%]">
                    {related.desc}
                  </p>
                </div>
              </a>
            ))}
        </div>
      </section>
    </main>
  );
}