import Navbar from "../components/NavbarPublic";
import Footer from "../components/Footer";
import ScrollingBanner from "../components/ScrollingBanner";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
        <section className={`flex flex-col min-h-screen bg-[#fafafa] text-[#222]`}
      >
        <ScrollingBanner />
        <Navbar />
        <main className="font-[var(--font-inter)] leading-relaxed tracking-[-0.01em]">
          {children}
        </main>
        <Footer />
      </section>

  );
}