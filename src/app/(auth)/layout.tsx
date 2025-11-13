export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

      <section
        className={`flex flex-col min-h-screen bg-[#fafafa] text-[#222]`}
      >

        <main className="font-(--font-inter)leading-relaxed tracking-[-0.01em]">
          {children}
        </main>

      </section>
  );
}