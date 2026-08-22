"use client";

import Link from "next/link";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
  AnimatePresence,
} from "framer-motion";
import gsap from "gsap";
import ScrollSmoother from "gsap/ScrollSmoother";
import { useRef, useCallback, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

const navItems = [
  { nameKey: "nav_about", href: "#about" },
  { nameKey: "nav_experience", href: "#work" },
  { nameKey: "nav_skills", href: "#skills" },
  { nameKey: "nav_projects", href: "#projects" },
  { nameKey: "nav_education", href: "#education" },
  { nameKey: "nav_contact", href: "#contact" },
];

function Header() {
  const pillRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  // Raw mouse position (normalised -0.5 to 0.5)
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  // Spring-smoothed versions
  const springX = useSpring(rawX, { damping: 25, stiffness: 200 });
  const springY = useSpring(rawY, { damping: 25, stiffness: 200 });

  // 3D tilt
  const rotateX = useTransform(springY, [-0.5, 0.5], ["-10deg", "10deg"]);
  const rotateY = useTransform(springX, [-0.5, 0.5], ["12deg", "-12deg"]);

  // Subtle float / translate
  const translateX = useTransform(springX, [-0.5, 0.5], ["-6px", "6px"]);
  const translateY = useTransform(springY, [-0.5, 0.5], ["4px", "-4px"]);

  // Glare position (0-100%)
  const glareX = useTransform(springX, [-0.5, 0.5], [0, 100]);
  const glareY = useTransform(springY, [-0.5, 0.5], [0, 100]);
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.28) 0%, rgba(255,200,80,0.12) 35%, rgba(255,255,255,0) 70%)`;

  const handleScroll = (e, href) => {
    e.preventDefault();
    setMenuOpen(false);
    const target = document.querySelector(href);
    if (!target) return;
    try {
      const smoother = ScrollSmoother.get();
      if (smoother) { smoother.scrollTo(href, true, "top 100px"); return; }
    } catch {}
    target.scrollIntoView({ behavior: "smooth" });
  };

  const handleMouseMove = useCallback((e) => {
    const el = pillRef.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    rawX.set((e.clientX - left) / width - 0.5);
    rawY.set((e.clientY - top) / height - 0.5);
  }, [rawX, rawY]);

  const handleMouseLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
  }, [rawX, rawY]);

  // Hamburger bar variants
  const topBar = { open: { rotate: 45, y: 7 },  closed: { rotate: 0, y: 0 } };
  const midBar = { open: { opacity: 0, x: -8 }, closed: { opacity: 1, x: 0 } };
  const botBar = { open: { rotate: -45, y: -7 }, closed: { rotate: 0, y: 0 } };

  return (
    <>
      <header
        className="fixed z-[9980] px-3 md:px-8"
        style={{ top: "20px", left: 0, right: 0 }}
        data-speed="fixed"
      >
        <div className="mx-auto max-w-6xl relative" style={{ height: "54px" }}>

          {/* ── DESKTOP NAVBAR (hidden on mobile) ── */}
          <div
            className="hidden md:flex absolute items-center gap-2"
            style={{ top: 0, bottom: 0, left: "85px", right: 0, perspective: "800px" }}
          >
            {/* CometCard-style pill */}
            <motion.div
              ref={pillRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                rotateX,
                rotateY,
                translateX,
                translateY,
                transformStyle: "preserve-3d",
              }}
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              className="relative flex-1 h-full bg-orange-500 border-2 border-black rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center overflow-hidden"
            >
              {/* Glare overlay */}
              <motion.div
                className="pointer-events-none absolute inset-0 z-20 rounded-full mix-blend-overlay"
                style={{ background: glare }}
              />

              <nav className="relative z-30 h-full w-full flex items-center pl-24 pr-8 overflow-x-auto no-scrollbar">
                {navItems.map((item, idx, arr) => (
                  <a
                    key={item.nameKey}
                    href={item.href}
                    onClick={(e) => handleScroll(e, item.href)}
                    className={`flex-1 text-center flex items-center justify-center group ${
                      idx < arr.length - 1 ? "border-r border-black/20" : ""
                    }`}
                  >
                    <motion.span
                      whileHover={{ y: -1, scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      className="relative inline-block text-xs lg:text-sm font-black uppercase tracking-widest text-black group-hover:text-white transition-colors duration-150 cursor-pointer whitespace-nowrap px-1"
                    >
                      {t(item.nameKey)}
                      <span className="absolute -bottom-0.5 left-0 w-0 h-[2px] bg-white group-hover:w-full transition-all duration-200" />
                    </motion.span>
                  </a>
                ))}
              </nav>
            </motion.div>

            {/* RATING pill */}
            <a href="#comments" onClick={(e) => handleScroll(e, "#comments")} className="flex-shrink-0">
              <motion.span
                whileHover={{ y: -2, scale: 1.06 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="inline-flex items-center text-xs lg:text-sm font-black uppercase tracking-widest bg-black text-amber-300 hover:bg-amber-300 hover:text-black border-2 border-black px-4 py-1.5 rounded-full shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-all duration-150 cursor-pointer whitespace-nowrap"
              >
                {t("nav_rating")}
              </motion.span>
            </a>
          </div>

          {/* ── MOBILE HAMBURGER BUTTON (hidden on desktop) ── */}
          <motion.button
            onClick={() => setMenuOpen(v => !v)}
            animate={menuOpen ? "open" : "closed"}
            className="md:hidden absolute left-3 top-1/2 -translate-y-1/2 z-[9999] w-11 h-11 bg-orange-500 border-2 border-black rounded-full shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center justify-center gap-[5px] px-2.5"
            aria-label="Toggle menu"
          >
            <motion.span variants={topBar} transition={{ type: "spring", stiffness: 300, damping: 20 }} className="block w-full h-[2.5px] bg-black rounded-full origin-center" />
            <motion.span variants={midBar} transition={{ duration: 0.15 }} className="block w-full h-[2.5px] bg-black rounded-full" />
            <motion.span variants={botBar} transition={{ type: "spring", stiffness: 300, damping: 20 }} className="block w-full h-[2.5px] bg-black rounded-full origin-center" />
          </motion.button>

          {/* WM Logo Desktop */}
          <Link
            href="/"
            className="hidden md:block absolute z-20"
            style={{
              left: "40px",
              top: "27px",
              transform: "translateY(-50%)",
              width: "120px",
              height: "120px",
            }}
          >
            <motion.div
              whileHover={{ scale: 1.12, rotate: -6 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 260, damping: 15 }}
              className="relative w-full h-full"
              style={{
                filter: "drop-shadow(4px 4px 0px rgba(0,0,0,1))",
              }}
            >
              <Image src="/WM.png" alt="RA Logo" fill className="object-contain" priority />
            </motion.div>
          </Link>

          {/* WM Logo Mobile — kanan, seukuran hamburger */}
          <Link
            href="/"
            className="md:hidden absolute z-20"
            style={{
              right: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              width: "44px",
              height: "44px",
            }}
          >
            <motion.div
              whileHover={{ scale: 1.1, rotate: -5 }}
              whileTap={{ scale: 0.92 }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
              className="relative w-full h-full"
              style={{
                filter: "drop-shadow(2px 2px 0px rgba(0,0,0,1))",
              }}
            >
              <Image src="/WM.png" alt="RA Logo" fill className="object-contain" priority />
            </motion.div>
          </Link>

        </div>
      </header>

      {/* ── MOBILE FULLSCREEN MENU ── */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMenuOpen(false)}
              className="md:hidden fixed inset-0 z-[9985] bg-black/60 backdrop-blur-sm"
            />

            {/* Slide-in panel from top */}
            <motion.div
              key="mobile-menu"
              initial={{ y: "-100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "-100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="md:hidden fixed top-0 left-0 right-0 z-[9990] bg-orange-500 border-b-4 border-black shadow-[0_6px_0px_0px_rgba(0,0,0,1)]"
            >
              {/* Glare shimmer in mobile panel */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-20 -left-20 w-60 h-60 rounded-full bg-white/10 blur-2xl" />
                <div className="absolute -bottom-10 right-10 w-40 h-40 rounded-full bg-yellow-200/10 blur-2xl" />
              </div>

              <div className="relative pt-24 pb-8 px-6 flex flex-col gap-1">
                {navItems.map((item, idx) => (
                  <motion.a
                    key={item.nameKey}
                    href={item.href}
                    onClick={(e) => handleScroll(e, item.href)}
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.06, type: "spring", stiffness: 300, damping: 25 }}
                    className="group flex items-center justify-between px-4 py-3.5 rounded-xl border-2 border-transparent hover:border-black hover:bg-black transition-all duration-150 bg-orange-400/40"
                  >
                    <span className="font-black uppercase tracking-widest text-base text-black group-hover:text-white transition-colors duration-150">
                      {t(item.nameKey)}
                    </span>
                    <span className="text-lg font-black text-black/40 group-hover:text-white/60 transition-colors duration-150">
                      &rarr;
                    </span>
                  </motion.a>
                ))}

                {/* Rating Item */}
                <motion.a
                  href="#comments"
                  onClick={(e) => handleScroll(e, "#comments")}
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: navItems.length * 0.06, type: "spring", stiffness: 300, damping: 25 }}
                  className="group flex items-center justify-between px-4 py-3.5 rounded-xl border-2 border-transparent hover:border-black bg-black transition-all duration-150 mt-3"
                >
                  <span className="font-black uppercase tracking-widest text-base text-amber-300 transition-colors duration-150">
                    {t("nav_rating")}
                  </span>
                  <span className="text-lg font-black text-amber-300 transition-colors duration-150">
                    &rarr;
                  </span>
                </motion.a>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating Language Switcher in bottom-right corner */}
      <div className="fixed bottom-6 right-6 z-[9990]">
        <button
          onClick={() => setLanguage(language === "en" ? "id" : "en")}
          className="cursor-pointer"
        >
          <motion.span
            whileHover={{ y: -2, scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="inline-flex items-center text-xs md:text-sm font-black uppercase tracking-widest bg-white text-black border-2 border-black px-4 py-2.5 rounded-full shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-all duration-150"
          >
            🌐 {language === "en" ? "EN" : "ID"}
          </motion.span>
        </button>
      </div>
    </>
  );
}

export default Header;
