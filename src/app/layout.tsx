import "./globals.css";
import { Space_Grotesk, Bebas_Neue } from "next/font/google";
import Header from "@/components/Header";
import SmoothScroll from "@/components/Smoothscroll";
import Preloader from "@/components/Preloader"; // 1. Import preloader-nya
import Cursor from "@/components/Cursor";
import { LanguageProvider } from "@/context/LanguageContext";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rizky Andriyanto | portfolio",
  description: "Rizky Andriyanto's personal portfolio website specializing in Front-End Web Development.",
};

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
});

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-bebas-neue",
});

export default function RootLayout({
  children,
  }: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} ${bebasNeue.variable} font-sans antialiased bg-[#e9e4d9]`}
      >
        <LanguageProvider>
          <Preloader />

          <Header />

          <SmoothScroll>
            <Cursor />
            {children}
          </SmoothScroll>
        </LanguageProvider>
      </body>
    </html>
  );
}
