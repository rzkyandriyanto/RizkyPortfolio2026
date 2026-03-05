"use client";
import { useEffect, useState, useRef } from "react";
import gsap from "gsap";

// Tambahkan prop 'color' di sini
const Ghost = ({ color = "red" }) => (
  <div
    className="ghost"
    style={{ "--ghost-color": color } as React.CSSProperties}
  >
    <div className="ghost-body">
      <div className="pupil"></div>
      <div className="pupil1"></div>
      <div className="eye"></div>
      <div className="eye1"></div>
      <div className="top0"></div>
      <div className="top1"></div>
      <div className="top2"></div>
      <div className="top3"></div>
      <div className="top4"></div>
      <div className="st0"></div>
      <div className="st1"></div>
      <div className="st2"></div>
      <div className="st3"></div>
      <div className="st4"></div>
      <div className="st5"></div>
      <div className="an1"></div>
      <div className="an2"></div>
      <div className="an3"></div>
      <div className="an4"></div>
      <div className="an6"></div>
      <div className="an7"></div>
      <div className="an8"></div>
      <div className="an9"></div>
      <div className="an10"></div>
      <div className="an11"></div>
      <div className="an12"></div>
      <div className="an13"></div>
      <div className="an15"></div>
      <div className="an16"></div>
      <div className="an17"></div>
      <div className="an18"></div>
    </div>
    <div className="ghost-shadow"></div>
  </div>
);

export default function Preloader() {
  const [loading, setLoading] = useState(true);
  const loaderRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      gsap.to(loaderRef.current, {
        opacity: 0,
        y: -100,
        duration: 1,
        ease: "power3.inOut",
        onComplete: () => {
          setLoading(false);
          window.dispatchEvent(new Event("loaderFinished"));
        },
      });
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#e9e4d9]"
    >
      <div className="ghost-container">
        {/* Panggil 4 hantu dengan warna berbeda */}
        <Ghost color="#ff0000" /> {/* Merah - Blinky */}
        <Ghost color="#ffb8ff" /> {/* Pink - Pinky */}
        <Ghost color="#00ffff" /> {/* Biru - Inky */}
        <Ghost color="#ffb847" /> {/* Orange - Clyde */}
      </div>
      <p className="mt-10 font-bebas-neue text-2xl tracking-[0.5em] text-orange-600 animate-pulse">
        LOADING PORTFOLIO...
      </p>
    </div>
  );
}
