"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  const cursorRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    gsap.set(cursor, { xPercent: -50, yPercent: -50, opacity: 0 }); // Sembunyi di awal

    const xTo = gsap.quickTo(cursor, "x", { duration: 0.4, ease: "power3" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.4, ease: "power3" });

    const moveCursor = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, []);

  return (
    <div
      id="custom-cursor"
      ref={cursorRef}
      className="fixed top-0 left-0 w-10 h-10 border-2 border-orange-500 rounded-full pointer-events-none z-[9999] opacity-0 mix-blend-difference"
    />
  );
}
