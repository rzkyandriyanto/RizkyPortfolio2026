"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register Plugin GSAP
gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const profileImageRef = useRef<HTMLDivElement>(null);
  const nameContainerRef = useRef<HTMLDivElement>(null);
  const bioSectionRef = useRef<HTMLDivElement>(null);
  const bioNarrativeRef = useRef<HTMLDivElement>(null);
  const projectsHeaderRef = useRef<HTMLDivElement>(null);
  const projectCardsRef = useRef<HTMLDivElement[]>([]);
  const animeBoxRef = useRef(null);

  useLayoutEffect(() => {
    // Ubah let jadi const di sini
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true });
      const photo = profileImageRef.current;

      // --- 1. SETUP ANIMASI HERO ---
      if (photo) {
        gsap.set(photo, { transformOrigin: "bottom center" });
      }

      tl.from(nameContainerRef.current, {
        y: 100,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      })
        .fromTo(
          photo,
          { x: 200, rotation: -5, opacity: 0, scale: 0.9 },
          {
            x: 0,
            rotation: -25,
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: "power4.out",
          },
          "-=0.6",
        )
        .to(photo, {
          rotation: -12,
          duration: 1.2,
          ease: "elastic.out(1, 0.4)",
        });

      const startAllAnimations = () => tl.play();
      window.addEventListener("loaderFinished", startAllAnimations);

      // --- 2. ANIMASI SCROLL: BIO SECTION ---
      gsap.from(bioSectionRef.current, {
        y: 80,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: bioSectionRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });

      // --- 3. ANIMASI NYAN CAT (Meluncur dari Kiri ke Tengah) ---
      gsap.from(animeBoxRef.current, {
        x: -800, // Mulai dari luar layar kiri
        opacity: 0,
        duration: 2, // Durasi meluncur
        ease: "power4.out",
        scrollTrigger: {
          trigger: animeBoxRef.current,
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
      });

      // --- 4. ANIMASI SCROLL: BIO NARRATIVE ---
      gsap.from(bioNarrativeRef.current, {
        y: 60,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out",
        scrollTrigger: {
          trigger: bioNarrativeRef.current,
          start: "top 80%",
        },
      });

      // --- 5. ANIMASI SCROLL: PROJECTS ---
      gsap.from(projectsHeaderRef.current, {
        scale: 0.9,
        opacity: 0,
        duration: 0.8,
        ease: "back.out(1.7)",
        scrollTrigger: { trigger: projectsHeaderRef.current, start: "top 90%" },
      });

      gsap.from(projectCardsRef.current, {
        y: 100,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out",
        scrollTrigger: { trigger: projectsHeaderRef.current, start: "top 70%" },
      });

      // --- 6. HOVER FOTO ---
      const onMouseEnterPhoto = () =>
        gsap.to(photo, {
          scale: 0.92,
          rotation: -15,
          duration: 0.4,
          ease: "power2.out",
        });
      const onMouseLeavePhoto = () =>
        gsap.to(photo, {
          scale: 1,
          rotation: -12,
          duration: 0.7,
          ease: "elastic.out(1, 0.6)",
        });

      if (photo) {
        photo.addEventListener("mouseenter", onMouseEnterPhoto);
        photo.addEventListener("mouseleave", onMouseLeavePhoto);
      }

      // CLEANUP: Menghapus listener saat komponen unmount
      return () => {
        window.removeEventListener("loaderFinished", startAllAnimations);
        if (photo) {
          photo.removeEventListener("mouseenter", onMouseEnterPhoto);
          photo.removeEventListener("mouseleave", onMouseLeavePhoto);
        }
      };
    });

    return () => ctx.revert();
  }, []);

  return (
    <main className="min-h-screen px-6 md:px-16 pt-40 md:pt-42 pb-20 overflow-hidden bg-grid font-space-grotesk text-black">
      <section className="flex flex-col items-center justify-center">
        {/* === HERO SECTION === */}
        <div className="relative w-full flex flex-col-reverse md:flex-row items-center justify-between gap-10 border-b-4 border-black pb-24">
          <div
            ref={nameContainerRef}
            className="w-full md:w-auto flex flex-col"
          >
            <h1 className="font-bebas-neue text-[15vw] md:text-[20vw] uppercase leading-[0.85] tracking-tighter text-orange-500 pt-14">
              RIZKY
            </h1>
            <h1 className="font-bebas-neue text-[15vw] md:text-[12vw] uppercase leading-[0.85] tracking-tighter text-blue-400">
              ANDRIYANTO
            </h1>
          </div>

          <div
            ref={profileImageRef}
            className="relative ml-12 w-87 h-100 md:w-[28rem] md:h-[28rem] flex-shrink-10"
          >
            <div className="w-full h-full rounded-[3rem] overflow-hidden border-4 border-black shadow-2xl bg-zinc-900 relative group">
              <Image
                src="/rizky.jpeg"
                alt="rizky"
                fill
                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                priority
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-blue-400 rounded-full flex items-center justify-center text-black font-black text-xl rotate-12 border-4 border-black">
              2026
            </div>
          </div>
        </div>

        {/* === BIO SECTION (TOP) === */}
        <div
          ref={bioSectionRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-16 mt-12 w-full pb-6"
        >
          <div className="flex flex-col gap-6 text-black">
            <h2 className="text-4xl font-black uppercase tracking-tighter leading-none">
              RIZKY ANDRIYANTO <span className="text-orange-500">/ 23 Y.O</span>
            </h2>
            <p className="text-2xl font-bold leading-tight max-w-xl opacity-90">
              A FRONT-END DEVELOPER FROM TANGERANG CITY. SPECIALIZING IN MODERN
              WEB EXPERIENCES.
            </p>
          </div>
          <div className="flex flex-col md:items-end justify-between text-left md:text-right text-black">
            <div className="space-y-1">
              <p className="text-sm font-black uppercase tracking-[0.2em] opacity-40">
                Location
              </p>
              <p className="text-2xl font-black uppercase">
                Tangerang City, Indonesia
              </p>
            </div>
            <div className="space-y-1 mt-8 md:mt-0">
              <p className="text-sm font-black uppercase tracking-[0.2em] opacity-40">
                Experience
              </p>
              <p className="text-2xl font-black uppercase">
                2+ Years Professional
              </p>
            </div>
          </div>
        </div>

        {/* === BIO NARATIF === */}
        <div
          ref={bioNarrativeRef}
          className="mt-20 mb-8 max-w-5xl mx-auto text-center px-4 text-black"
        >
          <div className="inline-block px-8 py-2 border-2 border-black rounded-full mb-8 text-sm font-black uppercase tracking-widest bg-orange-500 text-black shadow-[6px_4px_0px_0px_rgba(0,0,0,1)]">
            My Philosophy
          </div>
          <p className="text-3xl md:text-5xl font-bold leading-[1.1] tracking-tight italic">
            &quot;My journey in tech ignited in 2023, evolving into a relentless
            mission to build work that truly resonates. As a{" "}
            <span className="text-orange-500 not-italic font-black underline decoration-8 underline-offset-4">
              Creative Developer
            </span>
            , I breathe life into static designs through fluid animations and
            immersive user flows. I bridge the gap between{" "}
            <span className="text-blue-400 not-italic font-black">
              striking aesthetics
            </span>{" "}
            and{" "}
            <span className="bg-black text-[#e9e4d9] px-2 not-italic">
              flawless performance
            </span>
            , constantly pushing the limits of what’s possible on the web.&quot;
          </p>
          <div className="mt-12 font-bebas-neue text-4xl text-orange-500 tracking-wider uppercase">
            Let&apos;s craft something unforgettable together.
          </div>
        </div>
      </section>

      {/* === KOTAK ANIME (NYAN CAT) === */}
      <div
        ref={animeBoxRef}
        className="mt-2 mb-20 w-full max-w-2xl mx-auto flex justify-center items-center"
      >
        <div className="relative w-full h-[300px] md:h-[450px]">
          <Image
            src="/Animations.gif"
            alt="Nyan Cat"
            fill
            className="object-contain"
            unoptimized
          />
        </div>
      </div>
    </main>
  );
}
