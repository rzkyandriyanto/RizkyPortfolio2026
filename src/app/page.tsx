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
          {/* LEFT: Name, Title, Availability, Contact */}
          <div className="flex flex-col gap-6 text-black">
            <div className="flex flex-col gap-2">
              <h2 className="text-4xl font-black uppercase tracking-tighter leading-none">
                RIZKY ANDRIYANTO <span className="text-orange-500">/ 23 Y.O</span>
              </h2>
              <p className="text-2xl font-bold leading-tight max-w-xl opacity-90">
                A FRONT-END DEVELOPER FROM TANGERANG CITY. SPECIALIZING IN MODERN
                WEB EXPERIENCES.
              </p>
            </div>
          </div>

          {/* RIGHT: Location, Experience, Education */}
          <div className="flex flex-col md:items-end justify-between text-left md:text-right text-black gap-6">
            <div className="space-y-1">
              <p className="text-sm font-black uppercase tracking-[0.2em] opacity-40">
                Location
              </p>
              <p className="text-2xl font-black uppercase">
                Tangerang City, Indonesia
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-black uppercase tracking-[0.2em] opacity-40">
                Experience
              </p>
              <p className="text-2xl font-black uppercase">
                2+ Years Professional
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-black uppercase tracking-[0.2em] opacity-40">
                Education
              </p>
              <p className="text-xl font-black uppercase leading-tight">
                Universitas Pamulang
              </p>
              <p className="text-base font-bold opacity-70">
                S1 Teknik Informatika
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

      {/* ===================================================== */}
      {/* === WORK EXPERIENCE SECTION === */}
      {/* ===================================================== */}
      <section className="w-full mt-24 mb-16 px-0">
        <div className="flex items-center gap-4 mb-10">
          <div className="inline-block px-6 py-2 border-2 border-black rounded-full text-sm font-black uppercase tracking-widest bg-orange-500 text-black shadow-[5px_4px_0px_0px_rgba(0,0,0,1)]">
            Work Experience
          </div>
          <div className="flex-1 h-[3px] bg-black"></div>
        </div>
        <div className="flex flex-col gap-8">

          {/* Job 1 */}
          <div className="border-2 border-black p-6 md:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 bg-white">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-4">
              <div>
                <h3 className="text-xl font-black uppercase tracking-tight">PT Bumper Alfariz Trijaya Tbk</h3>
                <p className="text-base font-bold text-orange-500 uppercase">Crew Store &mdash; Pegawai Kontrak</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-black uppercase tracking-widest opacity-50">Jakarta Timur</p>
                <p className="text-sm font-bold opacity-50">November 2021 &ndash; Juli 2023</p>
              </div>
            </div>
            <ul className="list-disc list-inside space-y-1 text-sm font-medium opacity-80">
              <li>Mengembangkan strategi upselling yang berhasil, meningkatkan rata-rata transaksi pelanggan sebesar 25% dan berkontribusi pada peningkatan pencapaian toko.</li>
              <li>Mengelola operasi produk secara lebih efisien (25+ jenis) dari demi menciptakan sistem visual yang baik.</li>
              <li>Ikut dalam menjaga kebersihan dan keindahan toko, menciptakan lingkungan belanja yang nyaman dan meningkatkan kepuasan pelanggan.</li>
              <li>Secara proaktif memberikan rekomendasi produk sesuai kebutuhan dan preferensi pelanggan, meningkatkan kepuasan pelanggan dan penjualan tambahan.</li>
            </ul>
          </div>

          {/* Job 2 */}
          <div className="border-2 border-black p-6 md:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 bg-white">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-4">
              <div>
                <h3 className="text-xl font-black uppercase tracking-tight">Wendy&apos;s | Crew Kitchen</h3>
                <p className="text-base font-bold text-orange-500 uppercase">Pegawai Kontrak</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-black uppercase tracking-widest opacity-50">Jakarta Pusat</p>
                <p className="text-sm font-bold opacity-50">Oktober 2022 &ndash; Mei 2023</p>
              </div>
            </div>
            <ul className="list-disc list-inside space-y-1 text-sm font-medium opacity-80">
              <li>Mempersiapkan bahan makanan dan produk makanan sesuai standar kebijakan brand distributor tanpa keterlambatan.</li>
              <li>Berkolaborasi dengan rekan tim dapur untuk menyelesaikan produksi makanan secara efisien dan berkontribusi pada tercapainya kualitas fixed masak.</li>
              <li>Menjaga kualitas makanan secara teliti terhadap prosedur yang belum bagi bahan pengganti dengan cepat dan mengurangi kualitas fixed masak.</li>
              <li>Menerapkan prinsip first in first out (FIFO) dalam penggunaan bahan baku yang baru untuk mencegah pemborosan bahan bakar/area.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* === INTERNSHIP SECTION === */}
      {/* ===================================================== */}
      <section className="w-full mb-16">
        <div className="flex items-center gap-4 mb-10">
          <div className="inline-block px-6 py-2 border-2 border-black rounded-full text-sm font-black uppercase tracking-widest bg-blue-400 text-black shadow-[5px_4px_0px_0px_rgba(0,0,0,1)]">
            Internship
          </div>
          <div className="flex-1 h-[3px] bg-black"></div>
        </div>
        <div className="border-2 border-black p-6 md:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 bg-white">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-4">
            <div>
              <h3 className="text-xl font-black uppercase tracking-tight">PT Segara Lantera Teknologi</h3>
              <p className="text-base font-bold text-blue-500 uppercase">Web Development &mdash; Magang</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-black uppercase tracking-widest opacity-50">Jakarta Selatan</p>
              <p className="text-sm font-bold opacity-50">Maret 2025 &ndash; Present</p>
            </div>
          </div>
          <ul className="list-disc list-inside space-y-1 text-sm font-medium opacity-80">
            <li>Membangun lebih dari 15+ situs web responsif, meningkatkan kecepatan pemuatan halaman rata-rata sebesar 30% dan meningkatkan pengalaman pengguna (UX).</li>
            <li>Memimpin tim yang beranggotakan lebih dari 4+ anggota, meningkatkan kinerja dan skalabilitas website sebesar 40%.</li>
            <li>Merancang dan mengimplementasikan fitur async/concurrent yang meningkatkan efisiensi pemrosesan backend dan meningkatkan kecepatan 2x lebih performan.</li>
            <li>Mengoptimalkan aksibilitas website untuk memenuhi standar WCAG agar sesuai untuk website yang kompleks.</li>
            <li>Mengintegrasikan AI ke dalam implementasi rancangan sebuah aplikasi web.</li>
          </ul>
        </div>
      </section>

      {/* ===================================================== */}
      {/* === SKILLS SECTION === */}
      {/* ===================================================== */}
      <section className="w-full mb-16">
        <div className="flex items-center gap-4 mb-10">
          <div className="inline-block px-6 py-2 border-2 border-black rounded-full text-sm font-black uppercase tracking-widest bg-black text-white shadow-[5px_4px_0px_0px_rgba(0,0,0,1)]">
            Skills
          </div>
          <div className="flex-1 h-[3px] bg-black"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Soft Skills */}
          <div className="border-2 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-orange-50">
            <p className="text-xs font-black uppercase tracking-[0.2em] opacity-40 mb-4">Soft Skills</p>
            <div className="flex flex-wrap gap-2">
              {["Analytical Thinking","Empathy","Diplomacy","Komunikasi","Open-mindedness","Responsibility","Leadership","Research","Adaptability","Visionary","Critical Thinking","Curiosity","Time Management"].map((s) => (
                <span key={s} className="px-3 py-1 border-2 border-black text-xs font-bold bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-orange-500 hover:text-black transition-colors duration-200">{s}</span>
              ))}
            </div>
          </div>

          {/* Hard Skills */}
          <div className="border-2 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-blue-50">
            <p className="text-xs font-black uppercase tracking-[0.2em] opacity-40 mb-4">Hard Skills</p>
            <div className="flex flex-wrap gap-2">
              {["HTML","CSS","JavaScript","TypeScript","React","Next.js","Vue.js","Node.js","Angular","MySQL","SQLite","UI/UX Design","Mobile Analytics","Website Analytics"].map((s) => (
                <span key={s} className="px-3 py-1 border-2 border-black text-xs font-bold bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-blue-400 hover:text-black transition-colors duration-200">{s}</span>
              ))}
            </div>
          </div>

          {/* Software Skills */}
          <div className="border-2 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-zinc-50">
            <p className="text-xs font-black uppercase tracking-[0.2em] opacity-40 mb-4">Software Skills</p>
            <div className="flex flex-wrap gap-2">
              {["VS Code","Postman","GitHub","Git","Figma","Adobe XD","After Effects","Affinity Designer","Framer","Tableau","Digital Illustration","Color Grading"].map((s) => (
                <span key={s} className="px-3 py-1 border-2 border-black text-xs font-bold bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-black hover:text-white transition-colors duration-200">{s}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* === PROJECTS SECTION (Horizontal Scroll) === */}
      {/* ===================================================== */}
      <section className="w-full mb-16" ref={projectsHeaderRef}>
        <div className="flex items-center gap-4 mb-10">
          <div className="inline-block px-6 py-2 border-2 border-black rounded-full text-sm font-black uppercase tracking-widest bg-orange-500 text-black shadow-[5px_4px_0px_0px_rgba(0,0,0,1)]">
            Project Work
          </div>
          <div className="flex-1 h-[3px] bg-black"></div>
          <p className="text-xs font-black uppercase tracking-[0.15em] opacity-40 hidden md:block">← Scroll →</p>
        </div>

        <div
          className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory"
          style={{ scrollbarWidth: "thin", scrollbarColor: "#000 transparent" }}
        >
          {/* ── Project 1: Social Video Downloader ── */}
          <div
            className="flex-shrink-0 w-[300px] md:w-[380px] snap-start border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 transition-all duration-300 flex flex-col"
          >
            {/* Iframe Preview */}
            <div className="relative w-full h-[220px] border-b-2 border-black overflow-hidden bg-zinc-100">
              <iframe
                src="https://all-social-download-video.vercel.app/"
                title="All Social Video Downloader Preview"
                style={{ width: "133%", height: "133%", transform: "scale(0.75)", transformOrigin: "top left", pointerEvents: "none", border: "none" }}
                loading="lazy"
              />
              <div className="absolute top-2 right-2 flex items-center gap-1.5 px-2 py-1 bg-green-400 border-2 border-black text-[10px] font-black uppercase pointer-events-none">
                <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse"></span>Live
              </div>
            </div>
            {/* Card Body */}
            <div className="p-5 flex flex-col gap-3 flex-1">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-base font-black uppercase tracking-tight leading-tight">All Social Video Downloader</h3>
                <span className="flex-shrink-0 text-xs font-black px-2 py-1 bg-blue-400 border-2 border-black">#01</span>
              </div>
              <p className="text-sm font-medium opacity-70 leading-relaxed flex-1">
                Download video dari semua platform social media — TikTok, Instagram, YouTube & lainnya. Paste link, langsung download.
              </p>
              <div className="flex flex-wrap gap-1.5">
                {["Next.js", "API", "Social Media"].map((t) => (
                  <span key={t} className="text-[10px] font-black uppercase px-2 py-0.5 border-2 border-black bg-zinc-100">{t}</span>
                ))}
              </div>
              <a href="https://all-social-download-video.vercel.app/" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 border-2 border-black bg-black text-white text-xs font-black uppercase tracking-widest hover:bg-blue-400 hover:text-black shadow-[3px_3px_0px_0px_rgba(96,165,250,1)] hover:shadow-none transition-all duration-200">
                Visit Site
              </a>
            </div>
          </div>

          {/* ── Project 2: Tarot App ── */}
          <div
            className="flex-shrink-0 w-[300px] md:w-[380px] snap-start border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 transition-all duration-300 flex flex-col"
          >
            {/* Iframe Preview */}
            <div className="relative w-full h-[220px] border-b-2 border-black overflow-hidden bg-zinc-100">
              <iframe
                src="https://tarot-ten-taupe.vercel.app/"
                title="Tarot App Preview"
                style={{ width: "133%", height: "133%", transform: "scale(0.75)", transformOrigin: "top left", pointerEvents: "none", border: "none" }}
                loading="lazy"
              />
              <div className="absolute top-2 right-2 flex items-center gap-1.5 px-2 py-1 bg-green-400 border-2 border-black text-[10px] font-black uppercase pointer-events-none">
                <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse"></span>Live
              </div>
            </div>
            {/* Card Body */}
            <div className="p-5 flex flex-col gap-3 flex-1">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-base font-black uppercase tracking-tight leading-tight">Tarot Card Reader</h3>
                <span className="flex-shrink-0 text-xs font-black px-2 py-1 bg-blue-400 border-2 border-black">#02</span>
              </div>
              <p className="text-sm font-medium opacity-70 leading-relaxed flex-1">
                Aplikasi tarot interaktif buat meramal nasib — fun, mystical, dan siapa tahu akurat. Cocok buat iseng atau serius.
              </p>
              <div className="flex flex-wrap gap-1.5">
                {["React", "UI/UX", "Fun Project"].map((t) => (
                  <span key={t} className="text-[10px] font-black uppercase px-2 py-0.5 border-2 border-black bg-zinc-100">{t}</span>
                ))}
              </div>
              <a href="https://tarot-ten-taupe.vercel.app/" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 border-2 border-black bg-black text-white text-xs font-black uppercase tracking-widest hover:bg-blue-400 hover:text-black shadow-[3px_3px_0px_0px_rgba(96,165,250,1)] hover:shadow-none transition-all duration-200">
                Visit Site ↗
              </a>
            </div>
          </div>

          {/* ── More Coming Soon ── */}
          <div className="flex-shrink-0 w-[180px] snap-start border-2 border-dashed border-black flex flex-col items-center justify-center gap-3 p-8 text-center opacity-40 hover:opacity-70 transition-opacity duration-300">
            <div className="text-4xl font-black">+</div>
            <p className="text-xs font-black uppercase tracking-widest">More<br/>Coming<br/>Soon</p>
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* === EDUCATION + CERTIFICATIONS === */}
      {/* ===================================================== */}
      <section className="w-full mb-24">
        <div className="flex items-center gap-4 mb-10">
          <div className="inline-block px-6 py-2 border-2 border-black rounded-full text-sm font-black uppercase tracking-widest bg-orange-500 text-black shadow-[5px_4px_0px_0px_rgba(0,0,0,1)]">
            Education &amp; Certifications
          </div>
          <div className="flex-1 h-[3px] bg-black"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Education */}
          <div className="border-2 border-black p-6 md:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-white">
            <p className="text-xs font-black uppercase tracking-[0.2em] opacity-40 mb-3">Education</p>
            <h3 className="text-xl font-black uppercase tracking-tight">Universitas Pamulang</h3>
            <p className="text-base font-bold text-orange-500">S1 Teknik Informatika</p>
            <p className="text-sm opacity-50 mt-1">Tangerang &mdash; Currently Enrolled</p>
          </div>

          {/* Certifications */}
          <div className="border-2 border-black p-6 md:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-white">
            <p className="text-xs font-black uppercase tracking-[0.2em] opacity-40 mb-4">Certifications</p>
            <div className="flex flex-col gap-4">
              <div className="border-l-4 border-orange-500 pl-4">
                <p className="text-sm font-black">Belajar Dasar AI</p>
                <p className="text-xs opacity-60">Dicoding Indonesia &mdash; No. IL2C5B030V025</p>
                <p className="text-xs opacity-40">01 Oktober 2025</p>
                <a
                  href="https://www.dicoding.com/certificates/0LZ056D0NX65"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-1.5 text-[10px] font-black uppercase tracking-widest text-orange-500 hover:underline"
                >
                  Verify Certificate
                </a>
              </div>
              <div className="border-l-4 border-blue-400 pl-4">
                <p className="text-sm font-black">Fundamental of Machine Learning</p>
                <p className="text-xs opacity-60">Digital Talent Scholarship &mdash; No. 1151504945-144</p>
                <a
                  href="https://digitalent.komdigi.go.id/cek-sertifikat?registrasi=19510546840-144"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-1.5 text-[10px] font-black uppercase tracking-widest text-orange-500 hover:underline"
                >
                  Verify Certificate
                </a>
              </div>
              <div className="border-l-4 border-black pl-4">
                <p className="text-sm font-black">Pemrograman (Micro Skill)</p>
                <p className="text-xs opacity-60">Digital Talent Scholarship &mdash; No. 2220702650-7619</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ===================================================== */}
      {/* === CONTACT SECTION === */}
      {/* ===================================================== */}
      <section className="w-full mb-12">
        <div className="flex items-center gap-4 mb-10">
          <div className="inline-block px-6 py-2 border-2 border-black rounded-full text-sm font-black uppercase tracking-widest bg-black text-white shadow-[5px_4px_0px_0px_rgba(255,165,0,1)]">
            Contact Me
          </div>
          <div className="flex-1 h-[3px] bg-black"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Email Card */}
          <a
            href="https://mail.google.com/mail/?view=cm&to=rizkyandriyanto16@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-6 border-2 border-black p-6 md:p-8 bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:bg-orange-500 transition-all duration-300"
          >
            <div className="w-14 h-14 flex-shrink-0 border-2 border-black bg-orange-500 group-hover:bg-white flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-colors duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] opacity-40 group-hover:opacity-70">Gmail</p>
              <p className="text-lg md:text-xl font-black group-hover:text-black transition-colors duration-300">
                rizkyandriyanto16@gmail.com
              </p>
              <p className="text-xs font-bold opacity-50 mt-1 group-hover:opacity-80">Click to open Gmail Compose</p>
            </div>
          </a>

          {/* LinkedIn Card */}
          <a
            href="https://www.linkedin.com/in/rizky-andriyanto-a78370250/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-6 border-2 border-black p-6 md:p-8 bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:bg-blue-400 transition-all duration-300"
          >
            <div className="w-14 h-14 flex-shrink-0 border-2 border-black bg-blue-400 group-hover:bg-white flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-colors duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] opacity-40 group-hover:opacity-70">LinkedIn</p>
              <p className="text-lg md:text-xl font-black group-hover:text-black transition-colors duration-300">
                rizky-andriyanto
              </p>
              <p className="text-xs font-bold opacity-50 mt-1 group-hover:opacity-80">View Profile</p>
            </div>
          </a>
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
