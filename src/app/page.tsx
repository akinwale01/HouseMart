"use client";
import Hero from "./components/Hero";


export default function HomePage() {
  return (
    <main className="flex flex-col gap-24 lg:mx-auto lg:max-w-[1440px] pb-30 pt-50 px-4 md:px-14">
      <Hero />
    </main>
  );
}
