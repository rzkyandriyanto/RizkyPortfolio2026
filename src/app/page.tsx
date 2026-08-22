"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CometCard from "../components/ui/CometCard";
import { AnimatePresence, motion } from "framer-motion";
import { supabase } from "../lib/supabase";
import { useLanguage } from "../context/LanguageContext";

// Register Plugin GSAP
gsap.registerPlugin(ScrollTrigger);

interface GuestComment {
  id: string;
  name: string;
  instagram?: string;
  isVerified?: boolean;
  isPinned?: boolean;
  rating?: number;
  role: "HRD" | "FRIEND" | "BROTHER" | "GUEST" | "GIRLFRIEND" | "OWNER";
  text: string;
  timestamp: string;
}

function InstagramVerifiedBadge() {
  return (
    <svg
      viewBox="0 0 40 40"
      className="w-4 h-4 inline-block align-middle flex-shrink-0"
      fill="none"
      aria-label="Verified Instagram Account"
    >
      <title>Verified Instagram Account</title>
      <path
        d="M19.998 3.333c1.472 0 2.855.702 3.725 1.89l.865 1.18c.55.751 1.408 1.222 2.336 1.284l1.46.096c1.468.098 2.76.992 3.42 2.368l.654 1.365c.414.865 1.18 1.496 2.083 1.716l1.423.348c1.433.35 2.518 1.542 2.871 2.997l.35 1.444c.221.912.834 1.674 1.69 2.072l1.35.626c1.361.63 2.22 1.954 2.272 3.454l.051 1.487c.032.937.478 1.808 1.214 2.378l1.162.902c1.173.91 1.677 2.457 1.302 3.89l-.37 1.417c-.234.899-.066 1.863.456 2.624l.824 1.202c.83 1.21 .862 2.805.083 4.047l-.771 1.23c-.49.782-.619 1.734-.351 2.613l.422 1.385c.427 1.404.015 2.923-1.077 3.918l-1.08 1.002c-.686.637-.998 1.564-.852 2.484l.23 1.45c.234 1.475-.544 2.907-1.957 3.597l-1.399.684c-.886.434-1.472 1.265-1.597 2.234l-.197 1.528c-.198 1.536-1.378 2.73-2.964 2.997l-1.569.263c-.994.167-1.785.836-2.146 1.815l-.57 1.548c-.563 1.532-2.007 2.463-3.626 2.336l-1.601-.125c-1.015-.079-1.97.35-2.593 1.164l-.984 1.285c-.974 1.272-2.618 1.79-4.128 1.298l-1.493-.487c-.947-.309-1.978-.141-2.793.456l-1.289.94c-1.276.932-2.98.922-4.246-.025l-1.252-.937c-.792-.593-1.823-.761-2.77-.452l-1.493.487c-1.51.492-3.154-.026-4.128-1.298l-.984-1.285c-.623-.814-1.578-1.243-2.593-1.164l-1.601.125c-1.619.127-3.063-.804-3.626-2.336l-.57-1.548c-.361-.979-1.152-1.648-2.146-1.815l-1.569-.263c-1.586-.267-2.766-1.461-2.964-2.997l-.197-1.528c-.125-.969-.711-1.8-1.597-2.234l-1.399-.684c-1.413-.69-2.191-2.122-1.957-3.597l.23-1.45c.146-.92-.166-1.847-.852-2.484l-1.08-1.002c-1.092-.995-1.504-2.514-1.077-3.918l.422-1.385c.268-.879.139-1.831-.351-2.613l-.771-1.23c-.779-1.242-.747-2.837.083-4.047l.824-1.202c.522-.761.69-1.725.456-2.624l-.37-1.417c-.375-1.433.129-2.98 1.302-3.89l1.162-.902c.736-.57 1.182-1.441 1.214-2.378l.051-1.487c.052-1.5.911-2.824 2.272-3.454l1.35-.626c.856-.398 1.469-1.16 1.69-2.072l.35-1.444c.353-1.455 1.438-2.647 2.871-2.997l1.423-.348c.903-.22 1.669-.851 2.083-1.716l.654-1.365c.66-1.376 1.952-2.27 3.42-2.368l1.46-.096c.928-.062 1.786-.533 2.336-1.284l.865-1.18c.87-1.188 2.253-1.89 3.725-1.89z"
        fill="#0095F6"
      />
      <path
        d="M17.435 27.654l-6.089-6.09 2.122-2.121 3.967 3.967 8.967-8.967 2.121 2.121-11.088 11.09z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

export default function Home() {
  const { language, t } = useLanguage();
  const profileImageRef = useRef<HTMLDivElement>(null);
  const nameContainerRef = useRef<HTMLDivElement>(null);
  const bioSectionRef = useRef<HTMLDivElement>(null);
  const bioNarrativeRef = useRef<HTMLDivElement>(null);
  const projectsHeaderRef = useRef<HTMLDivElement>(null);
  const projectCardsRef = useRef<HTMLDivElement[]>([]);
  const workExperienceRef = useRef<HTMLDivElement>(null);
  const internshipRef = useRef<HTMLDivElement>(null);
  const skillsSectionRef = useRef<HTMLDivElement>(null);
  const educationSectionRef = useRef<HTMLDivElement>(null);
  const contactSectionRef = useRef<HTMLDivElement>(null);
  const animeBoxRef = useRef(null);
  const transitionOverlayRef = useRef<HTMLDivElement>(null);

  // State lightbox untuk design graphic
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [lightboxAlt, setLightboxAlt] = useState<string>("");

  // State activeTab untuk Kategori Project Work
  const [activeTab, setActiveTab] = useState<"web" | "graphic" | "uiux">("web");

  // State untuk Guestbook / Komentar Pengunjung
  const [comments, setComments] = useState<GuestComment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestInstagram, setGuestInstagram] = useState("");
  const [rating, setRating] = useState<number>(10);
  const [guestRole, setGuestRole] = useState<"HRD" | "FRIEND" | "BROTHER" | "GUEST" | "GIRLFRIEND" | "OWNER">("GUEST");

  const ratedComments = comments.filter((c) => c.rating !== undefined && c.role !== "OWNER");
  const averageRating = ratedComments.length > 0
    ? ratedComments.reduce((acc, c) => acc + (c.rating || 0), 0) / ratedComments.length
    : null;

  // Membaca identitas visitor & komentar dari Supabase / localStorage pada saat load
  useEffect(() => {
    const syncGuestAuth = (e?: Event) => {
      const detail = e && "detail" in e ? (e as CustomEvent<{ name?: string; instagram?: string; role?: GuestComment["role"] }>).detail : undefined;
      const savedName = detail?.name || localStorage.getItem("guest_name");
      const savedIg = detail?.instagram !== undefined ? detail?.instagram : localStorage.getItem("guest_instagram");
      const savedRole = detail?.role || (localStorage.getItem("guest_role") as GuestComment["role"]);
      if (savedName) setGuestName(savedName);
      if (savedIg !== null && savedIg !== undefined) setGuestInstagram(savedIg);
      if (savedRole) setGuestRole(savedRole);
    };

    syncGuestAuth();

    window.addEventListener("guest_auth_updated", syncGuestAuth);
    window.addEventListener("storage", syncGuestAuth);

    const loadComments = async () => {
      if (supabase) {
        try {
          const { data, error } = await supabase
            .from("comments")
            .select("*")
            .order("created_at", { ascending: false });

          if (!error && data) {
            const formatted: GuestComment[] = (data as Array<{
              id: string | number;
              name: string;
              instagram?: string;
              is_verified?: boolean;
              isVerified?: boolean;
              is_pinned?: boolean;
              isPinned?: boolean;
              rating?: number | null;
              role?: GuestComment["role"];
              text: string;
              created_at: string;
            }>)
              .map((item) => ({
                id: item.id.toString(),
                name: item.name,
                instagram: item.instagram || undefined,
                isVerified: !!item.is_verified || !!item.isVerified,
                isPinned: !!item.is_pinned || !!item.isPinned,
                rating: item.rating !== null && item.rating !== undefined ? Number(item.rating) : undefined,
                role: item.role || "GUEST",
                text: item.text,
                timestamp: item.created_at || new Date().toISOString(),
              }))
              .sort((a: GuestComment, b: GuestComment) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));

            setComments(formatted);
            localStorage.setItem("guest_comments_v2", JSON.stringify(formatted));
            return;
          }
        } catch (e) {
          console.warn("Supabase fetch fallback:", e);
        }
      }

      // Fallback ke localStorage
      const savedComments = localStorage.getItem("guest_comments_v2");
      if (savedComments) {
        try {
          const parsed = JSON.parse(savedComments);
          const sorted = parsed.sort((a: GuestComment, b: GuestComment) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));
          setComments(sorted);
        } catch {
          setComments([]);
        }
      }
    };

    loadComments();

    return () => {
      window.removeEventListener("guest_auth_updated", syncGuestAuth);
      window.removeEventListener("storage", syncGuestAuth);
    };
  }, []);

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const authorName = guestName.trim() || "Anonymous Guest";
    const authorRole = guestRole || "GUEST";
    const cleanIg = guestInstagram.replace(/^@/, "").trim();

    // Check if account is verified on Instagram
    let isVerifiedAccount = false;
    if (cleanIg) {
      try {
        const verifyRes = await fetch(`/api/instagram-info?username=${encodeURIComponent(cleanIg)}`);
        if (verifyRes.ok) {
          const vData = await verifyRes.json();
          isVerifiedAccount = !!vData.isVerified;
        }
      } catch {
        // ignore
      }
    }

    const tempId = Date.now().toString();
    const finalRating = authorRole === "OWNER" ? undefined : rating;

    const newCommentObj: GuestComment = {
      id: tempId,
      name: authorName,
      instagram: cleanIg || undefined,
      isVerified: isVerifiedAccount,
      rating: finalRating,
      role: authorRole,
      text: newComment.trim(),
      timestamp: new Date().toISOString(),
    };

    const updatedComments = [newCommentObj, ...comments].sort(
      (a: GuestComment, b: GuestComment) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0)
    );
    setComments(updatedComments);
    localStorage.setItem("guest_comments_v2", JSON.stringify(updatedComments));
    setNewComment("");

    // Simpan ke Supabase jika terhubung
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("comments")
          .insert([
            {
              name: authorName,
              instagram: cleanIg || null,
              is_verified: isVerifiedAccount,
              rating: authorRole === "OWNER" ? null : rating,
              role: authorRole,
              text: newCommentObj.text,
            },
          ])
          .select();

        if (!error && data && data[0]) {
          setComments((prev) =>
            prev.map((c) => (c.id === tempId ? { ...c, id: data[0].id.toString() } : c))
          );
        }
      } catch (err) {
        console.error("Supabase insert error:", err);
      }
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (window.confirm("Hapus komentar ini secara permanen?")) {
      const updatedComments = comments.filter((c) => c.id !== commentId);
      setComments(updatedComments);
      localStorage.setItem("guest_comments_v2", JSON.stringify(updatedComments));

      // Hapus dari Supabase jika terhubung
      if (supabase) {
        try {
          await supabase.from("comments").delete().eq("id", commentId);
        } catch (err) {
          console.error("Supabase delete error:", err);
        }
      }
    }
  };

  const handleTogglePinComment = async (commentId: string) => {
    const target = comments.find((c) => c.id === commentId);
    if (!target) return;
    const nextPinned = !target.isPinned;

    const updatedComments = comments
      .map((c) => (c.id === commentId ? { ...c, isPinned: nextPinned } : c))
      .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));

    setComments(updatedComments);
    localStorage.setItem("guest_comments_v2", JSON.stringify(updatedComments));

    if (supabase) {
      try {
        await supabase
          .from("comments")
          .update({ is_pinned: nextPinned })
          .eq("id", commentId);
      } catch (err) {
        console.error("Supabase pin update error:", err);
      }
    }
  };

  const handleSecretOwnerUnlock = () => {
    const secret = prompt("Masukkan Password Owner:");
    if (secret?.trim().toLowerCase() === "guk") {
      setGuestRole("OWNER");
      setGuestName("Rizky (Owner)");
      localStorage.setItem("guest_role", "OWNER");
      localStorage.setItem("guest_name", "Rizky (Owner)");
      alert("✓ OWNER MODE AKTIF! Anda sekarang dapat menghapus komentar apapun.");
    } else if (secret) {
      alert("✕ Password salah.");
    }
  };

  useLayoutEffect(() => {
    // Ubah let jadi const di sini
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true });
      const photo = profileImageRef.current;

      // --- 1. SETUP ANIMASI HERO ---
      if (photo) {
        gsap.set(photo, { transformOrigin: "center center" });
      }

      // Mulai timeline dengan memudarkan overlay transisi hitam (Gelap -> Terang)
      tl.to(transitionOverlayRef.current, {
        opacity: 0,
        duration: 1.2,
        ease: "power2.inOut",
        onComplete: () => {
          if (transitionOverlayRef.current) {
            transitionOverlayRef.current.style.display = "none";
          }
        }
      })
        .from(nameContainerRef.current, {
          y: 100,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
        }, "-=0.8")
        .fromTo(
          photo,
          { x: 200, rotation: 10, opacity: 0, scale: 0.9 },
          {
            x: 0,
            rotation: 0,
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: "power4.out",
          },
          "-=0.6",
        )
        .to(photo, {
          rotation: 0,
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

      // --- 6. ANIMASI SCROLL: WORK EXPERIENCE ---
      gsap.from(workExperienceRef.current, {
        scale: 0.9,
        opacity: 0,
        duration: 0.8,
        ease: "back.out(1.7)",
        scrollTrigger: { trigger: workExperienceRef.current, start: "top 85%" },
      });

      // --- 7. ANIMASI SCROLL: INTERNSHIP ---
      gsap.from(internshipRef.current, {
        scale: 0.9,
        opacity: 0,
        duration: 0.8,
        ease: "back.out(1.7)",
        scrollTrigger: { trigger: internshipRef.current, start: "top 85%" },
      });

      // --- 8. ANIMASI SCROLL: SKILLS ---
      gsap.from(skillsSectionRef.current, {
        scale: 0.9,
        opacity: 0,
        duration: 0.8,
        ease: "back.out(1.7)",
        scrollTrigger: { trigger: skillsSectionRef.current, start: "top 85%" },
      });

      // --- 9. ANIMASI SCROLL: EDUCATION ---
      gsap.from(educationSectionRef.current, {
        scale: 0.9,
        opacity: 0,
        duration: 0.8,
        ease: "back.out(1.7)",
        scrollTrigger: { trigger: educationSectionRef.current, start: "top 85%" },
      });

      // --- 10. ANIMASI SCROLL: CONTACT ---
      gsap.from(contactSectionRef.current, {
        scale: 0.9,
        opacity: 0,
        duration: 0.8,
        ease: "back.out(1.7)",
        scrollTrigger: { trigger: contactSectionRef.current, start: "top 85%" },
      });

      // CLEANUP: Menghapus listener saat komponen unmount
      return () => {
        window.removeEventListener("loaderFinished", startAllAnimations);
      };
    });

    return () => ctx.revert();
  }, []);

  return (
    <main className="min-h-screen px-6 md:px-16 pt-40 md:pt-42 pb-20 overflow-hidden bg-grid font-space-grotesk text-black">

      {/* ── 1. TOP SCROLL PROGRESS BAR (CSS Scroll-Driven) ── */}
      <div className="fixed top-0 left-0 right-0 z-[9999] h-2.5 bg-zinc-200 border-b-2 border-black pointer-events-none">
        <div className="scroll-progress-bar h-full bg-orange-500 border-r-2 border-black" />
      </div>



      {/* Overlay Transisi Gelap ke Terang */}
      <div
        ref={transitionOverlayRef}
        className="fixed inset-0 bg-black z-[9990] pointer-events-none"
      />
      <section className="flex flex-col items-center justify-center">
        {/* === HERO SECTION === */}
        <div className="relative w-full flex flex-col-reverse md:flex-row items-center justify-between gap-10 border-b-4 border-black pb-10">
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
            className="relative ml-12 w-87 h-100 md:w-[28rem] md:h-[28rem] flex-shrink-0"
          >
            <CometCard className="w-full h-full">
              <div className="w-full h-full rounded-[3rem] overflow-hidden border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-zinc-900 relative group">
                <Image
                  src="/rizky.jpeg"
                  alt="rizky"
                  fill
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  priority
                />
              </div>
            </CometCard>

          </div>
        </div>

        {/* === BIO SECTION (TOP) === */}
        <div
          id="about"
          ref={bioSectionRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-16 mt-6 w-full pb-6 scroll-mt-24"
        >
          {/* LEFT: Name, Title, Availability, Contact */}
          <div className="flex flex-col gap-6 text-black">
            <div className="flex flex-col gap-2">
              <h2 className="text-4xl font-black uppercase tracking-tighter leading-none">
                RIZKY ANDRIYANTO <span className="text-orange-500">/ 23 Y.O</span>
              </h2>
              <p className="text-2xl font-bold leading-tight max-w-xl opacity-90">
                {t("bio_title")}
              </p>
            </div>
          </div>

          {/* RIGHT: Location, Experience, Education */}
          <div className="flex flex-col md:items-end justify-between text-left md:text-right text-black gap-6">
            <div className="space-y-1">
              <p className="text-sm font-black uppercase tracking-[0.2em] opacity-40">
                {t("bio_location_label")}
              </p>
              <p className="text-2xl font-black uppercase">
                {t("bio_location_value")}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-black uppercase tracking-[0.2em] opacity-40">
                {t("bio_exp_label")}
              </p>
              <p className="text-2xl font-black uppercase">
                {t("bio_exp_value")}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-black uppercase tracking-[0.2em] opacity-40">
                {t("bio_edu_label")}
              </p>
              <p className="text-xl font-black uppercase leading-tight">
                {t("bio_edu_value_1")}
              </p>
              <p className="text-base font-bold text-blue-400">
                {t("bio_edu_value_2")}
              </p>
            </div>
          </div>
        </div>

        {/* === BIO NARATIF (with scroll text reveal) === */}
        <div
          ref={bioNarrativeRef}
          className="mt-20 mb-8 max-w-5xl mx-auto text-center px-4 text-black scroll-text-reveal"
        >
          <div className="inline-block px-8 py-2 border-2 border-black rounded-full mb-8 text-sm font-black uppercase tracking-widest bg-orange-500 text-black shadow-[6px_4px_0px_0px_rgba(0,0,0,1)]">
            {t("bio_philosophy_label")}
          </div>
          {language === "en" ? (
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
              , constantly pushing the limits of what&apos;s possible on the web.&quot;
            </p>
          ) : (
            <p className="text-3xl md:text-5xl font-bold leading-[1.1] tracking-tight italic">
              &quot;Perjalanan saya di dunia teknologi dimulai pada tahun 2023, berkembang
              menjadi misi tanpa henti untuk membangun karya yang benar-benar berkesan. Sebagai{" "}
              <span className="text-orange-500 not-italic font-black underline decoration-8 underline-offset-4">
                Developer Kreatif
              </span>
              , saya menghidupkan desain statis melalui animasi yang mengalir dan
              alur pengguna yang imersif. Saya menjembatani celah antara{" "}
              <span className="text-blue-400 not-italic font-black">
                estetika yang memukau
              </span>{" "}
              dan{" "}
              <span className="bg-black text-[#e9e4d9] px-2 not-italic">
                performa yang sempurna
              </span>
              , terus mendobrak batas dari apa yang mungkin dilakukan di web.&quot;
            </p>
          )}
        </div>
      </section>

      {/* ===================================================== */}
      {/* === WORK EXPERIENCE SECTION === */}
      {/* ===================================================== */}
      <section id="work" ref={workExperienceRef} className="w-full mt-24 mb-16 px-0 scroll-mt-24">
        <div className="flex items-center gap-4 mb-10">
          <div className="inline-block px-6 py-2 border-2 border-black rounded-full text-sm font-black uppercase tracking-widest bg-orange-500 text-black shadow-[5px_4px_0px_0px_rgba(0,0,0,1)]">
            {t("exp_header")}
          </div>
          <div className="flex-1 h-[3px] bg-black"></div>
        </div>
        <div className="flex flex-col gap-8">

          {/* Job 1 */}
          <div className="scroll-card-reveal border-2 border-black p-6 md:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 bg-white">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-4">
              <div>
                <h3 className="text-xl font-black uppercase tracking-tight">{t("job1_title")}</h3>
                <p className="text-base font-bold text-blue-400 uppercase">{t("job1_role")}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-black uppercase tracking-widest opacity-50">{t("job1_loc")}</p>
                <p className="text-sm font-bold opacity-50">{t("job1_date")}</p>
              </div>
            </div>
            <div className="flex flex-col gap-3 text-sm font-medium opacity-90">
              <div className="border-l-4 border-blue-400 pl-4">
                <span>{t("job1_bullet1")} </span>
                <a
                  href="https://www.instagram.com/p/CY6Jm0dBf8s/?hl=id&img_index=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-xs font-black uppercase text-blue-500 hover:text-blue-600 hover:underline"
                >
                  ({t("exp_proof_link")})
                </a>
              </div>
              <div className="border-l-4 border-blue-400 pl-4">
                {t("job1_bullet2")}
              </div>
              <div className="border-l-4 border-blue-400 pl-4">
                {t("job1_bullet3")}
              </div>
              <div className="border-l-4 border-blue-400 pl-4">
                {t("job1_bullet4")}
              </div>
              <div className="border-l-4 border-blue-400 pl-4">
                {t("job1_bullet5")}
              </div>
              <div className="border-l-4 border-blue-400 pl-4">
                {t("job1_bullet6")}
              </div>
              <div className="border-l-4 border-blue-400 pl-4">
                {t("job1_bullet7")}
              </div>
            </div>
          </div>

          {/* Job 2 */}
          <div className="scroll-card-reveal border-2 border-black p-6 md:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 bg-white">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-4">
              <div>
                <h3 className="text-xl font-black uppercase tracking-tight">{t("job2_title")}</h3>
                <p className="text-base font-bold text-blue-400 uppercase">{t("job2_role")}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-black uppercase tracking-widest opacity-50">{t("job2_loc")}</p>
                <p className="text-sm font-bold opacity-50">{t("job2_date")}</p>
              </div>
            </div>
            <div className="flex flex-col gap-3 text-sm font-medium opacity-90">
              <div className="border-l-4 border-blue-400 pl-4">
                {t("job2_bullet1")}
              </div>
              <div className="border-l-4 border-blue-400 pl-4">
                {t("job2_bullet2")}
              </div>
              <div className="border-l-4 border-blue-400 pl-4">
                {t("job2_bullet3")}
              </div>
              <div className="border-l-4 border-blue-400 pl-4">
                {t("job2_bullet4")}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* === INTERNSHIP SECTION === */}
      {/* ===================================================== */}
      <section id="internship" ref={internshipRef} className="w-full mb-16 scroll-mt-24">
        <div className="flex items-center gap-4 mb-10">
          <div className="inline-block px-6 py-2 border-2 border-black rounded-full text-sm font-black uppercase tracking-widest bg-orange-500 text-black shadow-[5px_4px_0px_0px_rgba(0,0,0,1)]">
            {t("intern_header")}
          </div>
          <div className="flex-1 h-[3px] bg-black"></div>
        </div>
        <div className="scroll-card-reveal border-2 border-black p-6 md:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 bg-white">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-4">
            <div>
              <h3 className="text-xl font-black uppercase tracking-tight">{t("intern1_title")}</h3>
              <p className="text-base font-bold text-blue-500 uppercase">{t("intern1_role")}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-black uppercase tracking-widest opacity-50">{t("intern1_loc")}</p>
              <p className="text-sm font-bold opacity-50">{t("intern1_date")}</p>
            </div>
          </div>
          <div className="flex flex-col gap-3 text-sm font-medium opacity-90">
            <div className="border-l-4 border-blue-400 pl-4">
              {t("intern1_bullet1")}
            </div>
            <div className="border-l-4 border-blue-400 pl-4">
              {t("intern1_bullet2")}
            </div>
            <div className="border-l-4 border-blue-400 pl-4">
              {t("intern1_bullet3")}
            </div>
            <div className="border-l-4 border-blue-400 pl-4">
              {t("intern1_bullet4")}
            </div>
            <div className="border-l-4 border-blue-400 pl-4">
              {t("intern1_bullet5")}
            </div>
            <div className="border-l-4 border-blue-400 pl-4">
              {t("intern1_bullet6")}
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* === SKILLS SECTION === */}
      {/* ===================================================== */}
      <section id="skills" ref={skillsSectionRef} className="w-full mb-16 scroll-mt-24">
        <div className="flex items-center gap-4 mb-10">
          <div className="inline-block px-6 py-2 border-2 border-black rounded-full text-sm font-black uppercase tracking-widest bg-black text-white shadow-[5px_4px_0px_0px_rgba(0,0,0,1)]">
            {t("skills_header")}
          </div>
          <div className="flex-1 h-[3px] bg-black"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Soft Skills */}
          <div className="border-2 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-orange-50">
            <p className="text-xs font-black uppercase tracking-[0.2em] opacity-40 mb-4">Soft Skills</p>
            <div className="flex flex-wrap gap-2">
              {["Analytical Thinking", "Empathy", "Diplomacy", "Komunikasi", "Open-mindedness", "Responsibility", "Leadership", "Research", "Adaptability", "Visionary", "Critical Thinking", "Curiosity", "Time Management"].map((s) => (
                <span key={s} className="scroll-badge-reveal px-3 py-1 border-2 border-black text-xs font-bold bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-orange-500 hover:text-black transition-colors duration-200">
                  {s === "Komunikasi" ? t("skills_comm") : s}
                </span>
              ))}
            </div>
          </div>

          {/* Hard Skills */}
          <div className="border-2 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-blue-50">
            <p className="text-xs font-black uppercase tracking-[0.2em] opacity-40 mb-4">Hard Skills</p>
            <div className="flex flex-wrap gap-2">
              {["HTML", "CSS", "JavaScript", "TypeScript", "React", "Next.js", "Vue.js", "Node.js", "Angular", "MySQL", "SQLite", "UI/UX Design", "Mobile Analytics", "Website Analytics"].map((s) => (
                <span key={s} className="scroll-badge-reveal px-3 py-1 border-2 border-black text-xs font-bold bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-blue-400 hover:text-black transition-colors duration-200">{s}</span>
              ))}
            </div>
          </div>

          {/* Software Skills */}
          <div className="border-2 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-zinc-50">
            <p className="text-xs font-black uppercase tracking-[0.2em] opacity-40 mb-4">Software Skills</p>
            <div className="flex flex-wrap gap-2">
              {["VS Code", "Postman", "GitHub", "Git", "Figma", "Adobe XD", "After Effects", "Affinity Designer", "Framer", "Tableau", "Digital Illustration", "Color Grading"].map((s) => (
                <span key={s} className="scroll-badge-reveal px-3 py-1 border-2 border-black text-xs font-bold bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-black hover:text-white transition-colors duration-200">{s}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* === PROJECTS SECTION (Tabs & Horizontal Scroll) === */}
      {/* ===================================================== */}
      <section id="projects" className="w-full mb-16 scroll-mt-24" ref={projectsHeaderRef}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4 flex-1">
            <div className="inline-block px-6 py-2 border-2 border-black rounded-full text-sm font-black uppercase tracking-widest bg-orange-500 text-black shadow-[5px_4px_0px_0px_rgba(0,0,0,1)] flex-shrink-0">
              {t("projects_header")}
            </div>
            <div className="flex-1 h-[3px] bg-black mr-2 md:mr-6"></div>
          </div>

          {/* Neobrutalist Tabs Navigation */}
          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => setActiveTab("web")}
              className={`px-4 py-2 border-2 border-black text-xs font-black uppercase tracking-wider transition-all duration-150 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] cursor-pointer ${activeTab === "web" ? "bg-orange-500 text-black" : "bg-white text-black hover:bg-zinc-100"
                }`}
            >
              Web Dev
            </button>
            <button
              onClick={() => setActiveTab("graphic")}
              className={`px-4 py-2 border-2 border-black text-xs font-black uppercase tracking-wider transition-all duration-150 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] cursor-pointer ${activeTab === "graphic" ? "bg-blue-400 text-black" : "bg-white text-black hover:bg-zinc-100"
                }`}
            >
              Graphic Design
            </button>
            <button
              onClick={() => setActiveTab("uiux")}
              className={`px-4 py-2 border-2 border-black text-xs font-black uppercase tracking-wider transition-all duration-150 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] cursor-pointer ${activeTab === "uiux" ? "bg-green-400 text-black" : "bg-white text-black hover:bg-zinc-100"
                }`}
            >
              UI/UX
            </button>
          </div>
        </div>

        <div
          className="overflow-x-auto pb-4"
          style={{ scrollbarWidth: "thin", scrollbarColor: "#000 transparent" }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: -10 }}
              transition={{
                duration: 0.45,
                ease: [0.34, 1.56, 0.64, 1], // exact back.out(1.7) overshoot curve
              }}
              className="flex gap-6 snap-x snap-mandatory"
            >
              {/* ── WEB DEVELOPMENT TAB CONTENT ── */}
              {activeTab === "web" && (
            <>
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
                    {t("proj1_desc")}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {["Next.js", "API", "Social Media"].map((t) => (
                      <span key={t} className="text-[10px] font-black uppercase px-2 py-0.5 border-2 border-black bg-zinc-100">{t}</span>
                    ))}
                  </div>
                  <a href="https://all-social-download-video.vercel.app/" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 border-2 border-black bg-black text-white text-xs font-black uppercase tracking-widest hover:bg-blue-400 hover:text-black shadow-[3px_3px_0px_0px_rgba(96,165,250,1)] hover:shadow-none transition-all duration-200">
                    {t("proj_view_site")}
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
                    {t("proj2_desc")}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {["React", "UI/UX", "Fun Project"].map((t) => (
                      <span key={t} className="text-[10px] font-black uppercase px-2 py-0.5 border-2 border-black bg-zinc-100">{t}</span>
                    ))}
                  </div>
                  <a href="https://tarot-ten-taupe.vercel.app/" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 border-2 border-black bg-black text-white text-xs font-black uppercase tracking-widest hover:bg-blue-400 hover:text-black shadow-[3px_3px_0px_0px_rgba(96,165,250,1)] hover:shadow-none transition-all duration-200">
                    {t("proj_view_site")}
                  </a>
                </div>
              </div>
            </>
          )}

          {/* ── GRAPHIC DESIGN TAB CONTENT ── */}
          {activeTab === "graphic" && (
            <>
              {/* Graphic Project 1: Dudul Anak Baik */}
              <div
                onClick={() => {
                  setLightboxSrc("/Dudul Anak Baik.jpg");
                  setLightboxAlt("Dudul Anak Baik");
                }}
                className="flex-shrink-0 w-[300px] md:w-[380px] snap-start border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 transition-all duration-300 flex flex-col cursor-zoom-in"
              >
                <div className="relative w-full h-[220px] border-b-2 border-black overflow-hidden bg-zinc-100 group">
                  <Image
                    src="/Dudul Anak Baik.jpg"
                    alt="Dudul Anak Baik"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-2 right-2 flex items-center gap-1.5 px-2 py-1 bg-orange-500 border-2 border-black text-[10px] font-black uppercase pointer-events-none">
                    Design
                  </div>
                </div>
                <div className="p-5 flex flex-col gap-3 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base font-black uppercase tracking-tight leading-tight">Dudul Anak Baik</h3>
                    <span className="flex-shrink-0 text-xs font-black px-2 py-1 bg-blue-400 border-2 border-black">#01</span>
                  </div>
                  <p className="text-sm font-medium opacity-70 leading-relaxed flex-1">
                    {t("graphic_proj1_desc")}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {["Illustration", "Graphic", "Art"].map((t) => (
                      <span key={t} className="text-[10px] font-black uppercase px-2 py-0.5 border-2 border-black bg-zinc-100">{t}</span>
                    ))}
                  </div>
                  <button className="inline-flex items-center justify-center gap-2 px-4 py-2 border-2 border-black bg-black text-white text-xs font-black uppercase tracking-widest hover:bg-blue-400 hover:text-black shadow-[3px_3px_0px_0px_rgba(96,165,250,1)] hover:shadow-none transition-all duration-200">
                    {t("proj_view_artwork")}
                  </button>
                </div>
              </div>

              {/* Graphic Project 2: Visual Photo */}
              <div
                onClick={() => {
                  setLightboxSrc("/PhotoVisual.jpg");
                  setLightboxAlt("Visual Photo");
                }}
                className="flex-shrink-0 w-[300px] md:w-[380px] snap-start border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 transition-all duration-300 flex flex-col cursor-zoom-in"
              >
                <div className="relative w-full h-[220px] border-b-2 border-black overflow-hidden bg-zinc-100 group">
                  <Image
                    src="/PhotoVisual.jpg"
                    alt="Photo Visual"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-2 right-2 flex items-center gap-1.5 px-2 py-1 bg-orange-500 border-2 border-black text-[10px] font-black uppercase pointer-events-none">
                    Design
                  </div>
                </div>
                <div className="p-5 flex flex-col gap-3 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base font-black uppercase tracking-tight leading-tight">Visual Photo</h3>
                    <span className="flex-shrink-0 text-xs font-black px-2 py-1 bg-blue-400 border-2 border-black">#02</span>
                  </div>
                  <p className="text-sm font-medium opacity-70 leading-relaxed flex-1">
                    {t("graphic_proj2_desc")}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {["Creative", "Design", "Grading"].map((t) => (
                      <span key={t} className="text-[10px] font-black uppercase px-2 py-0.5 border-2 border-black bg-zinc-100">{t}</span>
                    ))}
                  </div>
                  <button className="inline-flex items-center justify-center gap-2 px-4 py-2 border-2 border-black bg-black text-white text-xs font-black uppercase tracking-widest hover:bg-blue-400 hover:text-black shadow-[3px_3px_0px_0px_rgba(96,165,250,1)] hover:shadow-none transition-all duration-200">
                    {t("proj_view_artwork")}
                  </button>
                </div>
              </div>
            </>
          )}

          {/* ── UI/UX TAB CONTENT ── */}
          {activeTab === "uiux" && (
            <div className="flex-shrink-0 w-[300px] md:w-[380px] snap-start border-2 border-dashed border-black bg-white p-12 flex flex-col justify-center items-center gap-2 text-center my-2">
              <h3 className="text-xl font-black uppercase tracking-widest">{t("proj_coming_soon")}</h3>
              <p className="text-xs font-bold uppercase tracking-wider opacity-50">UI/UX Projects</p>
            </div>
          )}

              {/* ── More Coming Soon (Always visible for multi-item tabs) ── */}
              {activeTab !== "uiux" && (
                <div className="flex-shrink-0 w-[180px] snap-start border-2 border-dashed border-black flex flex-col items-center justify-center gap-3 p-8 text-center opacity-40 hover:opacity-70 transition-opacity duration-300">
                  <div className="text-4xl font-black">+</div>
                  <p className="text-xs font-black uppercase tracking-widest">{t("proj_more_coming")}</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ===================================================== */}
      {/* === EDUCATION + CERTIFICATIONS === */}
      {/* ===================================================== */}
      <section id="education" ref={educationSectionRef} className="w-full mb-24 scroll-mt-24">
        <div className="flex items-center gap-4 mb-10">
          <div className="inline-block px-6 py-2 border-2 border-black rounded-full text-sm font-black uppercase tracking-widest bg-orange-500 text-black shadow-[5px_4px_0px_0px_rgba(0,0,0,1)]">
            {t("edu_header")}
          </div>
          <div className="flex-1 h-[3px] bg-black"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Education */}
          <div className="scroll-card-reveal border-2 border-black p-6 md:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-white">
            <p className="text-xs font-black uppercase tracking-[0.2em] opacity-40 mb-3">{t("bio_edu_label")}</p>
            <h3 className="text-xl font-black uppercase tracking-tight">{t("edu_school")}</h3>
            <p className="text-base font-bold text-blue-400">{t("edu_major")}</p>
            <p className="text-sm opacity-50 mt-1">{t("edu_loc")}</p>
            <a
              href="https://pddikti.kemdiktisaintek.go.id/detail-mahasiswa/yTRHeSUMXwTVL5h1p4Jtsz-1y1ySDhzuM_dCtC_15sYwSWeSoGQikxT6PQHK4ghn1mHZtQ=="
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-2 text-[10px] font-black uppercase tracking-widest text-blue-500 hover:text-blue-600 hover:underline"
            >
              {t("edu_verify_status")}
            </a>

            {/* SINTA 5 Achievement */}
            <div className="mt-4 border-t border-black/10 pt-4">
              <p className="text-xs font-black uppercase tracking-[0.15em] opacity-40 mb-1">{t("edu_achievements_label")}</p>
              <p className="text-sm font-bold leading-snug">
                {t("edu_achievement_sinta")}{" "}
                <a
                  href="https://garuda.kemdiktisaintek.go.id/documents/detail/6586037"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-xs font-black uppercase text-blue-500 hover:text-blue-600 hover:underline"
                >
                  ({t("exp_proof_link")})
                </a>
              </p>
            </div>
          </div>

          {/* Certifications */}
          <div className="scroll-card-reveal border-2 border-black p-6 md:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-white">
            <p className="text-xs font-black uppercase tracking-[0.2em] opacity-40 mb-4">Certifications</p>
            <div className="flex flex-col gap-4">
              <div className="border-l-4 border-orange-500 pl-4">
                <p className="text-sm font-black">{t("cert1_title")}</p>
                <p className="text-xs opacity-60">{t("cert1_org")} &mdash; No. IL2C5B030V025</p>
                <p className="text-xs opacity-40">{t("cert1_date")}</p>
                <a
                  href="https://www.dicoding.com/certificates/0LZ056D0NX65"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-1.5 text-[10px] font-black uppercase tracking-widest text-blue-500 hover:text-blue-600 hover:underline"
                >
                  {t("cert_verify")}
                </a>
              </div>
              <div className="border-l-4 border-blue-400 pl-4">
                <p className="text-sm font-black">{t("cert2_title")}</p>
                <p className="text-xs opacity-60">{t("cert2_org")} &mdash; No. 1151504945-144</p>
                <a
                  href="https://digitalent.komdigi.go.id/cek-sertifikat?registrasi=19510546840-144"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-1.5 text-[10px] font-black uppercase tracking-widest text-blue-500 hover:text-blue-600 hover:underline"
                >
                  {t("cert_verify")}
                </a>
              </div>
              <div className="border-l-4 border-black pl-4">
                <p className="text-sm font-black">{t("cert3_title")}</p>
                <p className="text-xs opacity-60">{t("cert3_org")} &mdash; No. 2220702650-7619</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ===================================================== */}
      {/* === CONTACT SECTION === */}
      {/* ===================================================== */}
      <section id="contact" ref={contactSectionRef} className="w-full mb-12 scroll-mt-24">
        <div className="flex items-center gap-4 mb-10">
          <div className="inline-block px-6 py-2 border-2 border-black rounded-full text-sm font-black uppercase tracking-widest bg-black text-white shadow-[5px_4px_0px_0px_rgba(255,165,0,1)]">
            {t("contact_header")}
          </div>
          <div className="flex-1 h-[3px] bg-black"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Email Card */}
          <a
            href="https://mail.google.com/mail/?view=cm&to=rizkyandriyanto16@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-6 border-2 border-black p-6 bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:bg-orange-500 transition-all duration-300"
          >
            <div className="w-14 h-14 flex-shrink-0 border-2 border-black bg-orange-500 group-hover:bg-white flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-colors duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] opacity-40 group-hover:opacity-70">Gmail</p>
              <p className="text-base md:text-lg font-black group-hover:text-black transition-colors duration-300 break-all">
                rizkyandriyanto16@gmail.com
              </p>
              <p className="text-xs font-bold opacity-50 mt-1 group-hover:opacity-80">{t("contact_gmail_sub")}</p>
            </div>
          </a>

          {/* LinkedIn Card */}
          <a
            href="https://www.linkedin.com/in/rizky-andriyanto-a78370250/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-6 border-2 border-black p-6 bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:bg-blue-400 transition-all duration-300"
          >
            <div className="w-14 h-14 flex-shrink-0 border-2 border-black bg-blue-400 group-hover:bg-white flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-colors duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] opacity-40 group-hover:opacity-70">LinkedIn</p>
              <p className="text-base md:text-lg font-black group-hover:text-black transition-colors duration-300">
                rizky-andriyanto
              </p>
              <p className="text-xs font-bold opacity-50 mt-1 group-hover:opacity-80">{t("contact_li_sub")}</p>
            </div>
          </a>

          {/* Instagram Card */}
          <a
            href="https://www.instagram.com/rzkyandriyanto/?hl=id"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-6 border-2 border-black p-6 bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:bg-[#ff6fa4] transition-all duration-300"
          >
            <div className="w-14 h-14 flex-shrink-0 border-2 border-black bg-[#ff6fa4] group-hover:bg-white flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-colors duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] opacity-40 group-hover:opacity-70">Instagram</p>
              <p className="text-base md:text-lg font-black group-hover:text-black transition-colors duration-300">
                @rzkyandriyanto
              </p>
              <p className="text-xs font-bold opacity-50 mt-1 group-hover:opacity-80">{t("contact_ig_sub")}</p>
            </div>
          </a>
        </div>
      </section>

      {/* === KOTAK ANIME (NYAN CAT) === */}
      <div
        ref={animeBoxRef}
        className="mt-2 mb-20 w-full max-w-2xl mx-auto flex flex-col justify-center items-center gap-6"
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
        <div className="lets-craft-text font-bebas-neue text-4xl text-orange-500 tracking-wider uppercase text-center">
          Let&apos;s craft something unforgettable together.
        </div>
      </div>

      {/* === SECTION GUEST COMMENTS (GUESTBOOK) === */}
      <section id="comments" className="w-full max-w-4xl mx-auto mb-24 px-4 scroll-mt-28">
        <div className="flex flex-wrap items-center gap-4 mb-10">
          <div className="inline-block px-6 py-2 border-2 border-black rounded-full text-sm font-black uppercase tracking-widest bg-orange-500 text-black shadow-[5px_4px_0px_0px_rgba(0,0,0,1)]">
            {t("guest_header")}
          </div>
          {averageRating !== null && (
            <div className="inline-block px-4 py-2 border-2 border-black rounded-full text-sm font-black bg-amber-300 text-black shadow-[5px_4px_0px_0px_rgba(0,0,0,1)] select-none">
              <span>⭐ {averageRating.toFixed(1)}/10</span>
              <span className="opacity-60 text-xs ml-1.5 font-bold">
                ({ratedComments.length} {ratedComments.length > 1 ? t("guest_reviews") : t("guest_review")})
              </span>
            </div>
          )}
          <div className="flex-1 min-w-[20px] h-[3px] bg-black"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Form Kirim Komentar */}
          <div className="md:col-span-1 border-2 border-black p-6 bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] self-start order-2 md:order-1">
            <p className="text-xs font-black uppercase tracking-[0.2em] opacity-40 mb-3">{t("guest_post_title")}</p>

            <div
              onClick={handleSecretOwnerUnlock}
              className={`mb-4 p-3 border font-mono text-[11px] rounded flex flex-col gap-1.5 cursor-pointer transition-colors ${
                guestRole === "OWNER"
                  ? "border-yellow-500 bg-black text-yellow-400"
                  : "border-green-800 bg-black text-green-400 hover:border-green-500"
              }`}
              title="Klik untuk membuka/mengunci Mode Owner"
            >
              <div className="flex items-center justify-between">
                <span>{t("guest_session_active")}</span>
                {guestRole === "OWNER" ? (
                  <span className="bg-yellow-400 text-black px-1.5 py-0.5 text-[9px] font-black uppercase rounded">
                    {t("guest_owner_mode")}
                  </span>
                ) : (
                  <span className="text-[9px] opacity-40 hover:opacity-100 uppercase">
                    {t("guest_click_auth")}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full border border-green-700 overflow-hidden bg-zinc-900 flex-shrink-0 flex items-center justify-center text-[10px]">
                  {guestInstagram ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={`/api/instagram-avatar?username=${encodeURIComponent(guestInstagram)}`}
                      alt="Avatar"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(guestName || "guest")}`;
                      }}
                    />
                  ) : (
                    <span>{(guestName || "G").charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <div>
                  <p>{t("guest_visitor")}: {guestName || "Anonymous"}</p>
                  {guestInstagram && <p className="text-pink-400">IG: @{guestInstagram}</p>}
                </div>
              </div>
              <p>{t("guest_role")}: {guestRole} {guestRole === "OWNER" && t("guest_owner_desc")}</p>
            </div>

            <form onSubmit={handlePostComment} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black uppercase tracking-wider">{t("guest_message_label")}</label>
                <textarea
                  required
                  rows={4}
                  placeholder={t("guest_message_placeholder")}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="border-2 border-black p-2.5 text-sm font-medium focus:outline-none focus:ring-0 focus:border-orange-500 rounded-none bg-zinc-50"
                  maxLength={150}
                />
              </div>

              {/* Neobrutalist Slider Rating — hanya tampil jika bukan OWNER */}
              {guestRole !== "OWNER" ? (
                <div className="flex flex-col gap-2 p-3 bg-zinc-50 border-2 border-black">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                      <span>⭐ {t("guest_rate_label")}</span>
                    </label>
                    <span className="bg-black text-amber-300 font-mono font-black text-xs px-2 py-0.5 border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                      {rating.toFixed(1)} / 10
                    </span>
                  </div>

                  <div className="relative flex items-center py-1">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      step="0.5"
                      value={rating}
                      onChange={(e) => setRating(parseFloat(e.target.value))}
                      className="w-full h-2.5 bg-zinc-200 border border-black appearance-none cursor-pointer accent-orange-500"
                    />
                  </div>

                  <div className="flex justify-between text-[9px] font-black font-mono text-zinc-500 px-0.5 select-none">
                    <span>1.0</span>
                    <span>2.5</span>
                    <span>5.0</span>
                    <span>7.5</span>
                    <span>10.0</span>
                  </div>

                  {/* Submit di dalam blok rating */}
                  <button
                    type="submit"
                    className="w-full mt-1 py-2.5 border-2 border-black bg-orange-500 text-black text-xs font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all duration-200 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
                  >
                    {t("guest_submit_btn")}
                  </button>
                </div>
              ) : (
                <button
                  type="submit"
                  className="w-full py-2.5 border-2 border-black bg-orange-500 text-black text-xs font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all duration-200 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
                >
                  {t("guest_submit_btn")}
                </button>
              )}
            </form>
          </div>

          {/* Daftar Komentar */}
          <div className="md:col-span-2 flex flex-col gap-4 order-1 md:order-2">
            {/* Rating Keseluruhan Banner */}
            {averageRating !== null && (
              <div className="border-2 border-black bg-amber-300 text-black p-3.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between select-none">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-black uppercase tracking-wider opacity-60">{t("guest_overall_rating")}</span>
                  <span className="text-xl font-black font-mono">⭐ {averageRating.toFixed(1)} / 10</span>
                </div>
                <span className="text-xs font-black uppercase opacity-75">
                  {language === "en" ? `From ${ratedComments.length} reviews` : `Dari ${ratedComments.length} review`}
                </span>
              </div>
            )}

            {/* Scrollable list container */}
            <div className="flex flex-col gap-4 max-h-[440px] overflow-y-auto pr-2" style={{ scrollbarWidth: "thin" }}>
              {comments.length === 0 ? (
                <div className="border-2 border-dashed border-black p-12 text-center text-zinc-500 font-bold uppercase tracking-wider bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  {t("guest_first_comment")}
                </div>
              ) : (
                comments
                  .slice()
                  .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0))
                  .map((comment) => (
                  <div
                    key={comment.id}
                    className={`border-2 border-black transition-all duration-200 flex flex-col gap-2.5 relative ${
                      comment.role === "GIRLFRIEND"
                        ? "bg-[#fff5f8] shadow-[4px_4px_0px_0px_rgba(255,111,164,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(255,111,164,1)]"
                        : "bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                    } p-4 ${comment.rating !== undefined && comment.role !== "OWNER" ? "pb-9 md:pb-7" : ""}`}
                  >
                    {/* Pinned Badge Header (Sleek Dark Theme) */}
                    {comment.isPinned && (
                      <div className="flex items-center gap-1.5 text-[9px] font-black uppercase text-amber-300 bg-black border border-black px-2 py-0.5 self-start shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] tracking-wider">
                        <span>📌 {t("guest_pinned")}</span>
                      </div>
                    )}

                    <div className="flex items-start gap-3">
                      {/* Instagram Avatar (Clickable to profile) */}
                      {comment.instagram ? (
                        <a
                          href={`https://instagram.com/${comment.instagram}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 border-2 border-black rounded-full overflow-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-orange-400 flex-shrink-0 flex items-center justify-center font-black text-sm text-black hover:scale-105 transition-transform duration-150 cursor-pointer"
                          title={`Buka profil @${comment.instagram}`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={`/api/instagram-avatar?username=${encodeURIComponent(comment.instagram)}`}
                            alt={comment.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(comment.name)}`;
                            }}
                          />
                        </a>
                      ) : (
                        <div className="w-10 h-10 border-2 border-black rounded-full overflow-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-orange-400 flex-shrink-0 flex items-center justify-center font-black text-sm text-black">
                          <span>{comment.name.charAt(0).toUpperCase()}</span>
                        </div>
                      )}

                      {/* Header Info & Text */}
                      <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          {comment.instagram ? (
                            <a
                              href={`https://instagram.com/${comment.instagram}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-black text-sm md:text-base leading-none hover:text-pink-600 hover:underline transition-colors cursor-pointer"
                              title={`Kunjungi Instagram @${comment.instagram}`}
                            >
                              {comment.name}
                            </a>
                          ) : (
                            <span className="font-black text-sm md:text-base leading-none">{comment.name}</span>
                          )}

                          {comment.instagram && (
                            <a
                              href={`https://instagram.com/${comment.instagram}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] font-bold text-pink-600 hover:text-pink-700 hover:underline flex items-center gap-1"
                              title={`Buka @${comment.instagram} di Instagram`}
                            >
                              <span>@{comment.instagram}</span>
                              {comment.isVerified && <InstagramVerifiedBadge />}
                            </a>
                          )}

                          <span
                            className={`text-[9px] md:text-[10px] font-black px-2 py-0.5 border border-black leading-none flex items-center gap-1.5 ${
                              comment.role === "HRD"
                                ? "bg-purple-400 text-black"
                                : comment.role === "FRIEND"
                                ? "bg-green-400 text-black"
                                : comment.role === "BROTHER"
                                ? "bg-blue-400 text-black"
                                : comment.role === "GIRLFRIEND"
                                ? "bg-[#ff6fa4] text-white"
                                : comment.role === "OWNER"
                                ? "bg-orange-500 text-black"
                                : "bg-zinc-200 text-black"
                            }`}
                          >
                            {comment.role}
                            {comment.role === "OWNER" && " 👑"}
                            {comment.role === "GIRLFRIEND" && (
                              <svg viewBox="0 0 8 8" className="w-2.5 h-2.5 inline-block align-middle text-white animate-pulse" fill="currentColor">
                                <path d="M1,1h2v1h-2z M5,1h2v1h-2z M0,2h8v2h-8z M1,4h6v1h-6z M2,5h4v1h-4z M3,6h2v1h-2z" />
                              </svg>
                            )}
                          </span>

                          <span className="text-[10px] md:text-xs font-medium opacity-40 ml-auto">
                            {(() => {
                              try {
                                return new Date(comment.timestamp).toLocaleDateString(language === "en" ? "en-US" : "id-ID", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                });
                              } catch {
                                return comment.timestamp;
                              }
                            })()}
                          </span>

                          {/* Tombol Aksi Khusus OWNER: Pin & Hapus */}
                          {guestRole === "OWNER" && (
                            <div className="flex items-center gap-1.5 ml-2">
                              <button
                                onClick={() => handleTogglePinComment(comment.id)}
                                className={`text-[10px] font-black uppercase px-2 py-0.5 border border-black transition-colors cursor-pointer shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 ${
                                  comment.isPinned
                                    ? "bg-zinc-900 text-amber-300 hover:bg-black"
                                    : "bg-zinc-100 text-zinc-800 hover:bg-black hover:text-white"
                                }`}
                                title={comment.isPinned ? "Lepas Pin Komentar Ini" : "Sematkan / Pin Komentar Ini ke Paling Atas"}
                              >
                                {comment.isPinned ? t("guest_btn_unpin") : "📌 Pin"}
                              </button>

                              <button
                                onClick={() => handleDeleteComment(comment.id)}
                                className="text-[10px] font-black uppercase px-2 py-0.5 border border-red-700 bg-red-500 text-white hover:bg-black hover:text-red-400 transition-colors cursor-pointer shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5"
                                title="Hapus Komentar Ini"
                              >
                                ✕ {t("guest_btn_delete")}
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Isi Komentar (Lebih besar, tegas, dan gap rapat pas di bawah nama) */}
                        <p className="text-base md:text-lg font-bold text-zinc-900 leading-snug break-words pt-0.5 pr-14">
                          {comment.text}
                        </p>
                      </div>
                    </div>

                    {/* Rating Badge - Absolute positioned at bottom-right corner (Excludes OWNER) */}
                    {comment.rating !== undefined && comment.role !== "OWNER" && (
                      <span className="absolute bottom-2.5 right-2.5 text-[10px] font-black px-1.5 py-0.5 border border-black bg-amber-300 text-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] flex items-center gap-0.5 select-none z-10">
                        <span>⭐</span>
                        <span>{Number(comment.rating).toFixed(1)}/10</span>
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Lightbox Modal (Portal ke body agar keluar dari ScrollSmoother transform) ── */}
      {lightboxSrc && typeof document !== "undefined" && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.85)", backdropFilter: "blur(6px)", cursor: "zoom-out" }}
          onClick={() => setLightboxSrc(null)}
        >
          <div
            className="relative"
            style={{ cursor: "default" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setLightboxSrc(null)}
              className="absolute -top-5 -right-5 z-10 w-10 h-10 bg-orange-500 border-2 border-black text-black font-black text-lg flex items-center justify-center hover:bg-black hover:text-white transition-colors duration-200 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
            >
              ✕
            </button>
            {/* Image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lightboxSrc || undefined}
              alt={lightboxAlt}
              style={{
                display: "block",
                maxWidth: "90vw",
                maxHeight: "85vh",
                width: "auto",
                height: "auto",
                border: "4px solid white",
                boxShadow: "12px 12px 0px 0px rgba(249,115,22,1)",
              }}
            />
            {/* Caption */}
            <div
              style={{
                position: "absolute",
                bottom: 4,
                left: 4,
                right: 4,
                background: "rgba(0,0,0,0.7)",
                padding: "6px 12px",
                color: "white",
                fontSize: "10px",
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                textAlign: "center",
              }}
            >
              {lightboxAlt}
            </div>
          </div>
        </div>,
        document.body
      )}
    </main>
  );
}
