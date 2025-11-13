import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import SessionProviderWrapper from "./SessionProviderWrapper";
import "./globals.css";

// Import modern & elegant fonts
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "House-Mart",
  description: "Your perfect home, one click away.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <main className={`flex flex-col min-h-screen bg-[#fafafa] text-[#222] ${inter.variable} ${playfair.variable} antialiased`}>

          <div className= "font-[var(--font-inter)]">
            <SessionProviderWrapper>
              {children}
            </SessionProviderWrapper>
          </div>

        </main>
      </body>
    </html>
  );
}