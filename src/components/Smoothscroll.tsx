"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import ScrollSmoother from "gsap/ScrollSmoother";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const main = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Inisialisasi Smoother
      ScrollSmoother.create({
        wrapper: "#smooth-wrapper",
        content: "#smooth-content",
        smooth: 1.9, // Coba naikin dikit biar lebih terasa smooth-nya
        effects: true,
        normalizeScroll: {
          allowNestedScroll: true,
        },
      });
    }, main);

    return () => ctx.revert(); // Cleanup saat unmount
  }, []);

  return (
    <div id="smooth-wrapper" ref={main}>
      <div id="smooth-content">{children}</div>
    </div>
  );
}
