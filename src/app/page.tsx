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
import CharacterCustomizerModal from "../components/CharacterCustomizerModal";
import OwnerContentModal, { ModalType } from "../components/OwnerContentModal";
import {
  ProjectItem,
  ExperienceItem,
  EducationData,
  CertificateItem,
  SkillsData,
  DEFAULT_SKILLS,
  getSavedProjects,
  saveProjects,
  getSavedExperiences,
  saveExperiences,
  getSavedEducation,
  saveEducation,
  getSavedCertificates,
  saveCertificates,
  getSavedSkills,
  saveSkills,
  resetAllPortfolioData,
  idbGet,
  idbSet,
  fetchFromSupabase,
} from "../lib/portfolioData";
import { TechIcon } from "../components/TechIcons";
import RotatingBadge from "../components/ui/RotatingBadge";

// Register Plugin GSAP
gsap.registerPlugin(ScrollTrigger);

interface GuestComment {
  id: string;
  name: string;
  instagram?: string;
  avatar_url?: string;
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
        d="M19.998 3.333c-9.204 0-16.665 7.462-16.665 16.667 0 9.204 7.461 16.667 16.665 16.667 9.206 0 16.669-7.463 16.669-16.667 0-9.205-7.463-16.667-16.669-16.667z"
        fill="#0095F6"
      />
      <path
        d="M16.924 26.667l-6.19-6.19 2.357-2.357 3.833 3.833 8.833-8.833 2.357 2.357-11.19 11.19z"
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
  const projectsScrollRef = useRef<HTMLDivElement>(null);
  const workExperienceRef = useRef<HTMLDivElement>(null);
  const skillsSectionRef = useRef<HTMLDivElement>(null);
  const educationSectionRef = useRef<HTMLDivElement>(null);
  const contactSectionRef = useRef<HTMLDivElement>(null);
  const animeBoxRef = useRef<HTMLDivElement>(null);
  const transitionOverlayRef = useRef<HTMLDivElement>(null);

  // State lightbox untuk design graphic
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [lightboxAlt, setLightboxAlt] = useState<string>("");

  // State activeTab untuk Kategori Project Work
  const [activeTab, setActiveTab] = useState<"web" | "graphic" | "uiux" | "motion">("web");

  const scrollProjects = (direction: "left" | "right") => {
    if (projectsScrollRef.current) {
      const container = projectsScrollRef.current;
      const scrollAmount = container.clientWidth < 640 ? 324 : 404;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // State untuk Guestbook / Komentar Pengunjung
  const [comments, setComments] = useState<GuestComment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestInstagram, setGuestInstagram] = useState("");
  const [guestCustomAvatar, setGuestCustomAvatar] = useState<string>("");
  const [isCharacterModalOpen, setIsCharacterModalOpen] = useState(false);
  const [rating, setRating] = useState<number>(10);
  const [guestRole, setGuestRole] = useState<"HRD" | "FRIEND" | "BROTHER" | "GUEST" | "GIRLFRIEND" | "OWNER">("GUEST");

  // State Portfolio Dinamis (Mode Owner Add/Edit)
  const [portfolioProjects, setPortfolioProjects] = useState<ProjectItem[]>([]);
  const [portfolioExperiences, setPortfolioExperiences] = useState<ExperienceItem[]>([]);
  const [portfolioEducation, setPortfolioEducation] = useState<EducationData | null>(null);
  const [portfolioCertificates, setPortfolioCertificates] = useState<CertificateItem[]>([]);
  const [portfolioSkills, setPortfolioSkills] = useState<SkillsData | null>(null);

  // State Modal Mode Owner
  const [isOwnerModalOpen, setIsOwnerModalOpen] = useState(false);
  const [ownerModalType, setOwnerModalType] = useState<ModalType>("project");
  const [ownerModalData, setOwnerModalData] = useState<
    ProjectItem | ExperienceItem | EducationData | CertificateItem | SkillsData | null
  >(null);

  const ratedComments = comments.filter((c) => c.rating !== undefined && c.role !== "OWNER");
  const averageRating = ratedComments.length > 0
    ? ratedComments.reduce((acc, c) => acc + (c.rating || 0), 0) / ratedComments.length
    : null;

  // Load portfolio dynamic content from local storage and IndexedDB
  useEffect(() => {
    setPortfolioProjects(getSavedProjects());
    setPortfolioExperiences(getSavedExperiences());
    setPortfolioEducation(getSavedEducation());
    setPortfolioCertificates(getSavedCertificates());
    setPortfolioSkills(getSavedSkills());

    // 1. Fast local cache hydration (IndexedDB)
    idbGet<ProjectItem[]>("portfolio_custom_projects_v1").then((dbProjects) => {
      if (dbProjects && Array.isArray(dbProjects) && dbProjects.length > 0) {
        setPortfolioProjects(dbProjects);
      }
    });
    idbGet<ExperienceItem[]>("portfolio_custom_experiences_v1").then((dbExp) => {
      if (dbExp && Array.isArray(dbExp) && dbExp.length > 0) {
        setPortfolioExperiences(dbExp);
      }
    });
    idbGet<EducationData>("portfolio_custom_education_v1").then((dbEdu) => {
      if (dbEdu) setPortfolioEducation(dbEdu);
    });
    idbGet<CertificateItem[]>("portfolio_custom_certificates_v1").then((dbCert) => {
      if (dbCert && Array.isArray(dbCert) && dbCert.length > 0) {
        setPortfolioCertificates(dbCert);
      }
    });
    idbGet<SkillsData>("portfolio_custom_skills_v1").then((dbSkills) => {
      if (dbSkills) setPortfolioSkills(dbSkills);
    });

    // 2. Live Supabase Cloud hydration (ensures live cloud data across all devices/visitors)
    fetchFromSupabase<ProjectItem[]>("projects").then((cloudProjects) => {
      if (cloudProjects && Array.isArray(cloudProjects) && cloudProjects.length > 0) {
        setPortfolioProjects(cloudProjects);
        idbSet("portfolio_custom_projects_v1", cloudProjects);
        try { localStorage.setItem("portfolio_custom_projects_v1", JSON.stringify(cloudProjects)); } catch {}
      }
    });
    fetchFromSupabase<ExperienceItem[]>("experiences").then((cloudExp) => {
      if (cloudExp && Array.isArray(cloudExp) && cloudExp.length > 0) {
        setPortfolioExperiences(cloudExp);
        idbSet("portfolio_custom_experiences_v1", cloudExp);
        try { localStorage.setItem("portfolio_custom_experiences_v1", JSON.stringify(cloudExp)); } catch {}
      }
    });
    fetchFromSupabase<EducationData>("education").then((cloudEdu) => {
      if (cloudEdu) {
        setPortfolioEducation(cloudEdu);
        idbSet("portfolio_custom_education_v1", cloudEdu);
        try { localStorage.setItem("portfolio_custom_education_v1", JSON.stringify(cloudEdu)); } catch {}
      }
    });
    fetchFromSupabase<CertificateItem[]>("certificates").then((cloudCert) => {
      if (cloudCert && Array.isArray(cloudCert) && cloudCert.length > 0) {
        setPortfolioCertificates(cloudCert);
        idbSet("portfolio_custom_certificates_v1", cloudCert);
        try { localStorage.setItem("portfolio_custom_certificates_v1", JSON.stringify(cloudCert)); } catch {}
      }
    });
    fetchFromSupabase<SkillsData>("skills").then((cloudSkills) => {
      if (cloudSkills) {
        setPortfolioSkills(cloudSkills);
        idbSet("portfolio_custom_skills_v1", cloudSkills);
        try { localStorage.setItem("portfolio_custom_skills_v1", JSON.stringify(cloudSkills)); } catch {}
      }
    });
  }, []);

  // Membaca identitas visitor & komentar dari Supabase / localStorage pada saat load
  useEffect(() => {
    const syncGuestAuth = (e?: Event) => {
      const detail = e && "detail" in e ? (e as CustomEvent<{ name?: string; instagram?: string; role?: GuestComment["role"] }>).detail : undefined;
      const savedName = detail?.name || localStorage.getItem("guest_name");
      const savedIg = detail?.instagram !== undefined ? detail?.instagram : localStorage.getItem("guest_instagram");
      const savedRole = detail?.role || (localStorage.getItem("guest_role") as GuestComment["role"]);
      const savedCustomAvatar = localStorage.getItem("guest_custom_avatar");
      if (savedName) setGuestName(savedName);
      if (savedIg !== null && savedIg !== undefined) setGuestInstagram(savedIg);
      if (savedRole) setGuestRole(savedRole);
      if (savedCustomAvatar) setGuestCustomAvatar(savedCustomAvatar);
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
              avatar_url?: string;
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
                avatar_url: item.avatar_url && !item.avatar_url.includes("workers.dev") 
                  ? item.avatar_url 
                  : (item.role === "OWNER" || item.name.toLowerCase().includes("rizky")
                    ? "/images/pixel-cat-owner.svg"
                    : (item.name.toLowerCase().includes("lida")
                      ? "https://api.dicebear.com/7.x/pixel-art/svg?hair=long01&hairProbability=100&hatProbability=0&hairColor=090909&accessories=variant03&accessoriesProbability=100&glassesProbability=0&skinColor=e0a38b&backgroundColor=e11d48"
                      : `https://api.dicebear.com/7.x/pixel-art/svg?hair=short02&hairProbability=100&hatProbability=0&hairColor=090909&skinColor=e0a38b&backgroundColor=f97316&seed=${encodeURIComponent(item.instagram || item.name)}`)),
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

  const handleOpenCharacterCustomizer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    // Owner permanen adalah Kucing Pixel 🐱🕶️
    if (guestRole === "OWNER") {
      handleConfirmCommentWithAvatar("/images/pixel-cat-owner.svg");
      return;
    }

    setIsCharacterModalOpen(true);
  };

  const handleConfirmCommentWithAvatar = async (chosenAvatarUrl: string) => {
    setIsCharacterModalOpen(false);
    if (!newComment.trim()) return;

    setGuestCustomAvatar(chosenAvatarUrl);

    const authorName = guestName || "Anonymous Visitor";
    const authorRole = guestRole || "GUEST";
    const cleanIg = guestInstagram ? guestInstagram.replace(/^@/, "").trim() : undefined;
    const isVerifiedAccount = cleanIg ? ["prabowo", "aniesbaswedan", "ganjar_pranowo", "windahbasudara", "bahlillahadalia", "ybrap"].includes(cleanIg.toLowerCase()) : false;
    const tempId = Date.now().toString();

    const avatarUrl = chosenAvatarUrl;

    const newCommentObj: GuestComment = {
      id: tempId,
      name: authorName,
      instagram: cleanIg || undefined,
      avatar_url: avatarUrl,
      isVerified: isVerifiedAccount,
      rating: authorRole === "OWNER" ? undefined : rating,
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
              avatar_url: avatarUrl || null,
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
    if (secret?.trim().toLowerCase() === "guk" || secret?.trim() === "2026" || secret?.trim().toLowerCase() === "owner") {
      setGuestRole("OWNER");
      setGuestName("Rizky (Owner)");
      localStorage.setItem("guest_role", "OWNER");
      localStorage.setItem("guest_name", "Rizky (Owner)");
      alert("✓ OWNER MODE AKTIF! Anda sekarang dapat menambah & mengedit projek, pengalaman, pendidikan, dan sertifikat.");
    } else if (secret) {
      alert("✕ Password salah.");
    }
  };

  // Handler Open Modal Mode Owner
  const openOwnerModal = (
    type: ModalType,
    data: ProjectItem | ExperienceItem | EducationData | CertificateItem | SkillsData | null = null
  ) => {
    setOwnerModalType(type);
    setOwnerModalData(data);
    setIsOwnerModalOpen(true);
  };

  const handleSaveProject = (item: ProjectItem) => {
    setPortfolioProjects((prev) => {
      const exists = prev.some((p) => p.id === item.id);
      const updated = exists ? prev.map((p) => (p.id === item.id ? item : p)) : [item, ...prev];
      saveProjects(updated);
      return updated;
    });
  };

  const handleDeleteProject = (id: string) => {
    setPortfolioProjects((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      saveProjects(updated);
      return updated;
    });
  };

  const handleSaveExperience = (item: ExperienceItem) => {
    setPortfolioExperiences((prev) => {
      const exists = prev.some((e) => e.id === item.id);
      const updated = exists ? prev.map((e) => (e.id === item.id ? item : e)) : [item, ...prev];
      saveExperiences(updated);
      return updated;
    });
  };

  const handleDeleteExperience = (id: string) => {
    setPortfolioExperiences((prev) => {
      const updated = prev.filter((e) => e.id !== id);
      saveExperiences(updated);
      return updated;
    });
  };

  const handleSaveEducation = (data: EducationData) => {
    setPortfolioEducation(data);
    saveEducation(data);
  };

  const handleSaveCertificate = (item: CertificateItem) => {
    setPortfolioCertificates((prev) => {
      const exists = prev.some((c) => c.id === item.id);
      const updated = exists ? prev.map((c) => (c.id === item.id ? item : c)) : [item, ...prev];
      saveCertificates(updated);
      return updated;
    });
  };

  const handleDeleteCertificate = (id: string) => {
    setPortfolioCertificates((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      saveCertificates(updated);
      return updated;
    });
  };

  const handleSaveSkills = (skills: SkillsData) => {
    setPortfolioSkills(skills);
    saveSkills(skills);
  };

  const handleResetAllData = () => {
    if (confirm("Reset semua data projek, pengalaman, pendidikan, sertifikat, dan skills kembali ke default?")) {
      resetAllPortfolioData();
      setPortfolioProjects(getSavedProjects());
      setPortfolioExperiences(getSavedExperiences());
      setPortfolioEducation(getSavedEducation());
      setPortfolioCertificates(getSavedCertificates());
      setPortfolioSkills(getSavedSkills());
      alert("✓ Data berhasil di-reset ke default!");
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

      // === GLITCH TRANSITION: GELAP KE TERANG (CRT POWER-UP & MALFUNCTION SPARK) ===
      // 1. Initial dark overlay with sudden electrical flashes and RGB tear
      tl.to(transitionOverlayRef.current, {
        opacity: 0.25,
        filter: "invert(1) contrast(2) brightness(2.5)",
        duration: 0.09,
        ease: "none",
      })
      .to(transitionOverlayRef.current, {
        opacity: 0.95,
        filter: "drop-shadow(-10px 0 0 #00ffff) drop-shadow(10px 0 0 #ff0055) brightness(1.8)",
        duration: 0.08,
        ease: "none",
      })
      // 2. Micro blackout (sinyal drop sesaat)
      .to(transitionOverlayRef.current, {
        opacity: 1,
        filter: "none",
        duration: 0.15,
        ease: "none",
      })
      // 3. Second powerful phosphor burst
      .to(transitionOverlayRef.current, {
        opacity: 0.15,
        filter: "invert(1) brightness(3.5) contrast(2)",
        duration: 0.12,
        ease: "none",
      })
      .to(transitionOverlayRef.current, {
        opacity: 0.7,
        filter: "drop-shadow(8px 0 0 #00ff66) drop-shadow(-8px 0 0 #ff00ff)",
        duration: 0.09,
      })
      // 4. Final smooth cinematic reveal into the bright portfolio page
      .to(transitionOverlayRef.current, {
        opacity: 0,
        filter: "none",
        duration: 1.8,
        ease: "power2.inOut",
        onComplete: () => {
          if (transitionOverlayRef.current) {
            transitionOverlayRef.current.style.display = "none";
          }
        },
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
      const nyanImg = animeBoxRef.current?.querySelector(".nyan-cat-img");
      if (nyanImg) {
        gsap.from(nyanImg, {
          x: -600,
          opacity: 0,
          duration: 1.6,
          ease: "power4.out",
          scrollTrigger: {
            trigger: animeBoxRef.current,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        });
      }

      // --- 3.1 ANIMASI SCROLL: LETS CRAFT TEXT (Word Highlighter + 3D Kinetic Lift) ---
      const craftContainer = animeBoxRef.current?.querySelector(".lets-craft-text");
      const craftWords = animeBoxRef.current?.querySelectorAll(".craft-word");
      if (craftContainer && craftWords && craftWords.length > 0) {
        gsap.fromTo(
          craftWords,
          {
            opacity: 0.15,
            y: 25,
            scale: 0.9,
            rotateX: -20,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotateX: 0,
            stagger: 0.08,
            ease: "power2.out",
            scrollTrigger: {
              trigger: craftContainer,
              start: "top 90%",
              end: "top 45%",
              scrub: 0.8,
            },
          }
        );
      }

      // --- 4. ANIMASI SCROLL: BIO NARRATIVE (Word Highlighter + Kinetic 3D Lift) ---
      if (bioNarrativeRef.current) {
        const words = bioNarrativeRef.current.querySelectorAll(".philosophy-word");
        if (words.length > 0) {
          gsap.fromTo(
            words,
            {
              opacity: 0.15,
              y: 20,
              scale: 0.93,
              rotateX: -15,
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              rotateX: 0,
              stagger: 0.05,
              ease: "power2.out",
              scrollTrigger: {
                trigger: bioNarrativeRef.current,
                start: "top 80%",
                end: "bottom 45%",
                scrub: 0.75,
              },
            }
          );
        }
      }

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
  }, [language]);

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
            <h1 className="font-bebas-neue text-[clamp(4rem,17vw,14rem)] uppercase leading-[0.85] tracking-tighter text-orange-500 pt-14">
              RIZKY
            </h1>
            <h1 className="font-bebas-neue text-[clamp(3.2rem,11.5vw,9.5rem)] uppercase leading-[0.85] tracking-tighter text-blue-400">
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
          className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 mt-6 w-full pb-6 scroll-mt-24"
        >
          {/* LEFT: Name, Title, Availability, Contact */}
          <div className="flex flex-col gap-6 text-black">
            <div className="flex flex-col gap-4">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter leading-tight">
                CREATIVE DEVELOPER <span className="text-orange-500 whitespace-nowrap">/ 23 Y.O</span>
              </h2>
              <div className="text-xl sm:text-2xl md:text-3xl font-black uppercase leading-snug max-w-2xl text-black">
                <span>{t("bio_title_prefix")}</span>{" "}
                <RotatingBadge
                  items={[
                    { text: t("bio_rotating_word_1"), color: "bg-green-400 text-black" },
                    { text: t("bio_rotating_word_2"), color: "bg-purple-400 text-black" },
                    { text: t("bio_rotating_word_3"), color: "bg-blue-400 text-black" },
                    { text: t("bio_rotating_word_4"), color: "bg-orange-500 text-black" },
                  ]}
                />{" "}
                <span>{t("bio_title_suffix")}</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Location, Experience, Education */}
          <div className="flex flex-col md:items-end justify-between text-left md:text-right text-black gap-6">
            <div className="space-y-1">
              <p className="text-sm font-black uppercase tracking-[0.2em] opacity-70">
                {t("bio_location_label")}
              </p>
              <p className="text-2xl font-black uppercase">
                {t("bio_location_value")}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-black uppercase tracking-[0.2em] opacity-70">
                {t("bio_exp_label")}
              </p>
              <p className="text-2xl font-black uppercase">
                {t("bio_exp_value")}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-black uppercase tracking-[0.2em] opacity-70">
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
            <p className="text-3xl md:text-5xl font-bold leading-[1.25] tracking-tight italic select-none">
              <span className="philosophy-word inline-block mr-[0.25em]">&quot;My</span>
              <span className="philosophy-word inline-block mr-[0.25em]">journey</span>
              <span className="philosophy-word inline-block mr-[0.25em]">in</span>
              <span className="philosophy-word inline-block mr-[0.25em]">tech</span>
              <span className="philosophy-word inline-block mr-[0.25em]">ignited</span>
              <span className="philosophy-word inline-block mr-[0.25em]">in</span>
              <span className="philosophy-word inline-block mr-[0.25em]">2023,</span>
              <span className="philosophy-word inline-block mr-[0.25em]">evolving</span>
              <span className="philosophy-word inline-block mr-[0.25em]">into</span>
              <span className="philosophy-word inline-block mr-[0.25em]">a</span>
              <span className="philosophy-word inline-block mr-[0.25em]">relentless</span>
              <span className="philosophy-word inline-block mr-[0.25em]">mission</span>
              <span className="philosophy-word inline-block mr-[0.25em]">to</span>
              <span className="philosophy-word inline-block mr-[0.25em]">build</span>
              <span className="philosophy-word inline-block mr-[0.25em]">work</span>
              <span className="philosophy-word inline-block mr-[0.25em]">that</span>
              <span className="philosophy-word inline-block mr-[0.25em]">truly</span>
              <span className="philosophy-word inline-block mr-[0.25em]">resonates.</span>
              <span className="philosophy-word inline-block mr-[0.25em]">As</span>
              <span className="philosophy-word inline-block mr-[0.25em]">a</span>
              <span className="philosophy-word inline-block mr-[0.25em]">
                <span className="text-orange-500 not-italic font-black underline decoration-8 underline-offset-4">
                  Creative
                </span>
              </span>
              <span className="philosophy-word inline-block mr-[0.25em]">
                <span className="text-orange-500 not-italic font-black underline decoration-8 underline-offset-4">
                  Developer
                </span>
                ,
              </span>
              <span className="philosophy-word inline-block mr-[0.25em]">I</span>
              <span className="philosophy-word inline-block mr-[0.25em]">breathe</span>
              <span className="philosophy-word inline-block mr-[0.25em]">life</span>
              <span className="philosophy-word inline-block mr-[0.25em]">into</span>
              <span className="philosophy-word inline-block mr-[0.25em]">static</span>
              <span className="philosophy-word inline-block mr-[0.25em]">designs</span>
              <span className="philosophy-word inline-block mr-[0.25em]">through</span>
              <span className="philosophy-word inline-block mr-[0.25em]">fluid</span>
              <span className="philosophy-word inline-block mr-[0.25em]">animations</span>
              <span className="philosophy-word inline-block mr-[0.25em]">and</span>
              <span className="philosophy-word inline-block mr-[0.25em]">immersive</span>
              <span className="philosophy-word inline-block mr-[0.25em]">user</span>
              <span className="philosophy-word inline-block mr-[0.25em]">flows.</span>
              <span className="philosophy-word inline-block mr-[0.25em]">I</span>
              <span className="philosophy-word inline-block mr-[0.25em]">bridge</span>
              <span className="philosophy-word inline-block mr-[0.25em]">the</span>
              <span className="philosophy-word inline-block mr-[0.25em]">gap</span>
              <span className="philosophy-word inline-block mr-[0.25em]">between</span>
              <span className="philosophy-word inline-block mr-[0.25em]">
                <span className="text-blue-400 not-italic font-black">
                  striking
                </span>
              </span>
              <span className="philosophy-word inline-block mr-[0.25em]">
                <span className="text-blue-400 not-italic font-black">
                  aesthetics
                </span>
              </span>
              <span className="philosophy-word inline-block mr-[0.25em]">and</span>
              <span className="philosophy-word inline-block mr-[0.25em]">
                <span className="bg-black text-[#e9e4d9] px-2 not-italic shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  flawless performance
                </span>
                ,
              </span>
              <span className="philosophy-word inline-block mr-[0.25em]">constantly</span>
              <span className="philosophy-word inline-block mr-[0.25em]">pushing</span>
              <span className="philosophy-word inline-block mr-[0.25em]">the</span>
              <span className="philosophy-word inline-block mr-[0.25em]">limits</span>
              <span className="philosophy-word inline-block mr-[0.25em]">of</span>
              <span className="philosophy-word inline-block mr-[0.25em]">what&apos;s</span>
              <span className="philosophy-word inline-block mr-[0.25em]">possible</span>
              <span className="philosophy-word inline-block mr-[0.25em]">on</span>
              <span className="philosophy-word inline-block mr-[0.25em]">the</span>
              <span className="philosophy-word inline-block mr-[0.25em]">web.&quot;</span>
            </p>
          ) : (
            <p className="text-3xl md:text-5xl font-bold leading-[1.25] tracking-tight italic select-none">
              <span className="philosophy-word inline-block mr-[0.25em]">&quot;Perjalanan</span>
              <span className="philosophy-word inline-block mr-[0.25em]">saya</span>
              <span className="philosophy-word inline-block mr-[0.25em]">di</span>
              <span className="philosophy-word inline-block mr-[0.25em]">dunia</span>
              <span className="philosophy-word inline-block mr-[0.25em]">teknologi</span>
              <span className="philosophy-word inline-block mr-[0.25em]">dimulai</span>
              <span className="philosophy-word inline-block mr-[0.25em]">pada</span>
              <span className="philosophy-word inline-block mr-[0.25em]">tahun</span>
              <span className="philosophy-word inline-block mr-[0.25em]">2023,</span>
              <span className="philosophy-word inline-block mr-[0.25em]">berkembang</span>
              <span className="philosophy-word inline-block mr-[0.25em]">menjadi</span>
              <span className="philosophy-word inline-block mr-[0.25em]">misi</span>
              <span className="philosophy-word inline-block mr-[0.25em]">tanpa</span>
              <span className="philosophy-word inline-block mr-[0.25em]">henti</span>
              <span className="philosophy-word inline-block mr-[0.25em]">untuk</span>
              <span className="philosophy-word inline-block mr-[0.25em]">membangun</span>
              <span className="philosophy-word inline-block mr-[0.25em]">karya</span>
              <span className="philosophy-word inline-block mr-[0.25em]">yang</span>
              <span className="philosophy-word inline-block mr-[0.25em]">benar-benar</span>
              <span className="philosophy-word inline-block mr-[0.25em]">berkesan.</span>
              <span className="philosophy-word inline-block mr-[0.25em]">Sebagai</span>
              <span className="philosophy-word inline-block mr-[0.25em]">
                <span className="text-orange-500 not-italic font-black underline decoration-8 underline-offset-4">
                  Developer
                </span>
              </span>
              <span className="philosophy-word inline-block mr-[0.25em]">
                <span className="text-orange-500 not-italic font-black underline decoration-8 underline-offset-4">
                  Kreatif
                </span>
                ,
              </span>
              <span className="philosophy-word inline-block mr-[0.25em]">saya</span>
              <span className="philosophy-word inline-block mr-[0.25em]">menghidupkan</span>
              <span className="philosophy-word inline-block mr-[0.25em]">desain</span>
              <span className="philosophy-word inline-block mr-[0.25em]">statis</span>
              <span className="philosophy-word inline-block mr-[0.25em]">melalui</span>
              <span className="philosophy-word inline-block mr-[0.25em]">animasi</span>
              <span className="philosophy-word inline-block mr-[0.25em]">yang</span>
              <span className="philosophy-word inline-block mr-[0.25em]">mengalir</span>
              <span className="philosophy-word inline-block mr-[0.25em]">dan</span>
              <span className="philosophy-word inline-block mr-[0.25em]">alur</span>
              <span className="philosophy-word inline-block mr-[0.25em]">pengguna</span>
              <span className="philosophy-word inline-block mr-[0.25em]">yang</span>
              <span className="philosophy-word inline-block mr-[0.25em]">imersif.</span>
              <span className="philosophy-word inline-block mr-[0.25em]">Saya</span>
              <span className="philosophy-word inline-block mr-[0.25em]">menjembatani</span>
              <span className="philosophy-word inline-block mr-[0.25em]">celah</span>
              <span className="philosophy-word inline-block mr-[0.25em]">antara</span>
              <span className="philosophy-word inline-block mr-[0.25em]">
                <span className="text-blue-400 not-italic font-black">
                  estetika
                </span>
              </span>
              <span className="philosophy-word inline-block mr-[0.25em]">
                <span className="text-blue-400 not-italic font-black">
                  yang memukau
                </span>
              </span>
              <span className="philosophy-word inline-block mr-[0.25em]">dan</span>
              <span className="philosophy-word inline-block mr-[0.25em]">
                <span className="bg-black text-[#e9e4d9] px-2 not-italic shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  performa yang sempurna
                </span>
                ,
              </span>
              <span className="philosophy-word inline-block mr-[0.25em]">terus</span>
              <span className="philosophy-word inline-block mr-[0.25em]">mendobrak</span>
              <span className="philosophy-word inline-block mr-[0.25em]">batas</span>
              <span className="philosophy-word inline-block mr-[0.25em]">dari</span>
              <span className="philosophy-word inline-block mr-[0.25em]">apa</span>
              <span className="philosophy-word inline-block mr-[0.25em]">yang</span>
              <span className="philosophy-word inline-block mr-[0.25em]">mungkin</span>
              <span className="philosophy-word inline-block mr-[0.25em]">dilakukan</span>
              <span className="philosophy-word inline-block mr-[0.25em]">di</span>
              <span className="philosophy-word inline-block mr-[0.25em]">web.&quot;</span>
            </p>
          )}
        </div>
      </section>

      {/* ===================================================== */}
      {/* ===================================================== */}
      {/* ===================================================== */}
      {/* === WORK EXPERIENCE SECTION === */}
      {/* ===================================================== */}
      <section id="work" ref={workExperienceRef} className="w-full mt-24 mb-16 px-0 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div className="flex items-center gap-4 flex-1">
            <div className="inline-block px-6 py-2 border-2 border-black rounded-full text-sm font-black uppercase tracking-widest bg-orange-500 text-black shadow-[5px_4px_0px_0px_rgba(0,0,0,1)]">
              {t("exp_header")}
            </div>
            <div className="flex-1 h-[3px] bg-black"></div>
          </div>
          {guestRole === "OWNER" && (
            <button
              onClick={() => openOwnerModal("experience", null)}
              className="inline-flex items-center gap-2 px-4 py-2 border-2 border-black bg-yellow-300 hover:bg-yellow-400 text-black text-xs font-black uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all self-start sm:self-auto cursor-pointer"
            >
              <span>+</span> Tambah Pengalaman
            </button>
          )}
        </div>
        <div className="flex flex-col gap-8">
          {portfolioExperiences.map((exp) => (
            <div
              key={exp.id}
              className="scroll-card-reveal border-2 border-black p-6 md:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 bg-white relative group"
            >
              {guestRole === "OWNER" && (
                <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                  <button
                    onClick={() => openOwnerModal("experience", exp)}
                    className="px-2.5 py-1 bg-yellow-300 hover:bg-yellow-400 text-black border-2 border-black text-[10px] font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
                    title="Edit Pengalaman"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Hapus pengalaman ${exp.title}?`)) {
                        handleDeleteExperience(exp.id);
                      }
                    }}
                    className="px-2.5 py-1 bg-red-500 hover:bg-red-600 text-white border-2 border-black text-[10px] font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
                    title="Hapus Pengalaman"
                  >
                    🗑️
                  </button>
                </div>
              )}
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-4">
                <div>
                  {exp.tag && (
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black uppercase tracking-widest bg-orange-500 text-black px-2 py-0.5 border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                        {exp.tag}
                      </span>
                    </div>
                  )}
                  <h3 className="text-xl font-black uppercase tracking-tight">{exp.title}</h3>
                  <p className={`text-base font-bold uppercase ${exp.type === "intern" ? "text-blue-500" : "text-blue-400"}`}>
                    {exp.role}
                  </p>
                </div>
                <div className="text-left md:text-right mt-1 md:mt-0">
                  <p className="text-sm font-black uppercase tracking-widest opacity-50">{exp.location}</p>
                  <p className="text-sm font-bold opacity-50">{exp.date}</p>
                </div>
              </div>
              <div className="flex flex-col gap-3 text-sm font-medium opacity-90">
                {exp.bullets.map((bullet, bIdx) => (
                  <div key={bIdx} className="border-l-4 border-blue-400 pl-4">
                    <span>{bullet} </span>
                    {bIdx === 0 && exp.proofUrl && (
                      <a
                        href={exp.proofUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-xs font-black uppercase text-blue-500 hover:text-blue-600 hover:underline ml-1"
                      >
                        ({t("exp_proof_link")})
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===================================================== */}
      {/* === SKILLS SECTION === */}
      {/* ===================================================== */}
      <section id="skills" ref={skillsSectionRef} className="w-full mb-16 scroll-mt-24">
        <div className="flex items-center justify-between gap-4 mb-10">
          <div className="flex items-center gap-4 flex-1">
            <div className="inline-block px-6 py-2 border-2 border-black rounded-full text-sm font-black uppercase tracking-widest bg-black text-white shadow-[5px_4px_0px_0px_rgba(0,0,0,1)]">
              {t("skills_header")}
            </div>
            <div className="flex-1 h-[3px] bg-black"></div>
          </div>
          {guestRole === "OWNER" && (
            <button
              onClick={() => openOwnerModal("skills", portfolioSkills || DEFAULT_SKILLS)}
              className="px-3.5 py-1.5 bg-yellow-300 hover:bg-yellow-400 text-black border-2 border-black text-xs font-black uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer flex-shrink-0"
              title="Edit Soft, Hard & Software Skills"
            >
              ✏️ Edit Skills & Logo
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Soft Skills */}
          <div className="border-2 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-orange-50 flex flex-col justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] opacity-70 mb-4">Soft Skills</p>
              <div className="flex flex-wrap gap-2">
                {(portfolioSkills?.softSkills || DEFAULT_SKILLS.softSkills).map((s) => (
                  <span
                    key={s}
                    className="scroll-badge-reveal px-3 py-1.5 border-2 border-black text-xs font-bold bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-orange-500 hover:text-black hover:-translate-y-0.5 transition-all duration-150 select-none cursor-default"
                  >
                    {s === "Komunikasi" ? t("skills_comm") : s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Hard Skills */}
          <div className="border-2 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-blue-50 flex flex-col justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] opacity-70 mb-4">Hard Skills</p>
              <div className="flex flex-wrap gap-2">
                {(portfolioSkills?.hardSkills || DEFAULT_SKILLS.hardSkills).map((s) => (
                  <span
                    key={s}
                    className="scroll-badge-reveal inline-flex items-center gap-1.5 px-3 py-1.5 border-2 border-black text-xs font-bold bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-blue-400 hover:text-black hover:-translate-y-0.5 transition-all duration-150 select-none cursor-default"
                  >
                    <TechIcon name={s} className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{s}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Software Skills */}
          <div className="border-2 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-zinc-50 flex flex-col justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] opacity-70 mb-4">Software Skills</p>
              <div className="flex flex-wrap gap-2">
                {(portfolioSkills?.softwareSkills || DEFAULT_SKILLS.softwareSkills).map((s) => (
                  <span
                    key={s}
                    className="scroll-badge-reveal inline-flex items-center gap-1.5 px-3 py-1.5 border-2 border-black text-xs font-bold bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-amber-300 hover:text-black hover:-translate-y-0.5 transition-all duration-150 select-none cursor-default"
                  >
                    <TechIcon name={s} className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{s}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================== */}
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

          {/* Neobrutalist Tabs Navigation + Owner Add Button */}
          <div className="flex flex-wrap items-center gap-2.5">
            {guestRole === "OWNER" && (
              <button
                onClick={() => openOwnerModal("project", null)}
                className="px-3.5 py-2 border-2 border-black text-xs font-black uppercase tracking-wider bg-yellow-300 hover:bg-yellow-400 text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
              >
                + Tambah Projek
              </button>
            )}
            <button
              onClick={() => {
                setActiveTab("web");
                if (projectsScrollRef.current) projectsScrollRef.current.scrollLeft = 0;
              }}
              className={`px-4 py-2 border-2 border-black text-xs font-black uppercase tracking-wider transition-all duration-150 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] cursor-pointer ${activeTab === "web" ? "bg-orange-500 text-black" : "bg-white text-black hover:bg-zinc-100"
                }`}
            >
              Web Dev
            </button>
            <button
              onClick={() => {
                setActiveTab("graphic");
                if (projectsScrollRef.current) projectsScrollRef.current.scrollLeft = 0;
              }}
              className={`px-4 py-2 border-2 border-black text-xs font-black uppercase tracking-wider transition-all duration-150 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] cursor-pointer ${activeTab === "graphic" ? "bg-blue-400 text-black" : "bg-white text-black hover:bg-zinc-100"
                }`}
            >
              Graphic Design
            </button>
            <button
              onClick={() => {
                setActiveTab("motion");
                if (projectsScrollRef.current) projectsScrollRef.current.scrollLeft = 0;
              }}
              className={`px-4 py-2 border-2 border-black text-xs font-black uppercase tracking-wider transition-all duration-150 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] cursor-pointer ${activeTab === "motion" ? "bg-purple-400 text-black" : "bg-white text-black hover:bg-zinc-100"
                }`}
            >
              Motion Graphic
            </button>
            <button
              onClick={() => {
                setActiveTab("uiux");
                if (projectsScrollRef.current) projectsScrollRef.current.scrollLeft = 0;
              }}
              className={`px-4 py-2 border-2 border-black text-xs font-black uppercase tracking-wider transition-all duration-150 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] cursor-pointer ${activeTab === "uiux" ? "bg-green-400 text-black" : "bg-white text-black hover:bg-zinc-100"
                }`}
            >
              UI/UX
            </button>
          </div>
        </div>

        <div
          ref={projectsScrollRef}
          className="overflow-x-auto pb-4 scroll-smooth"
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
              {portfolioProjects.filter((p) => p.tab === activeTab).length === 0 ? (
                <div className="flex-shrink-0 w-[300px] md:w-[380px] snap-start border-2 border-dashed border-black bg-white p-12 flex flex-col justify-center items-center gap-2 text-center my-2">
                  <h3 className="text-xl font-black uppercase tracking-widest">{t("proj_coming_soon")}</h3>
                  <p className="text-xs font-bold uppercase tracking-wider opacity-50">{activeTab.toUpperCase()} Projects</p>
                </div>
              ) : (
                portfolioProjects
                  .filter((p) => p.tab === activeTab)
                  .map((proj, pIdx) => {
                    const dynamicNumber = `#${String(pIdx + 1).padStart(2, "0")}`;
                    const badgeLabel = proj.badge && !proj.badge.startsWith("#") ? proj.badge : dynamicNumber;

                    return (
                    <div
                      key={proj.id}
                      onClick={() => {
                        if (proj.imageUrl && !proj.isIframe) {
                          setLightboxSrc(proj.imageUrl);
                          setLightboxAlt(proj.title);
                        }
                      }}
                      className={`flex-shrink-0 w-[300px] md:w-[380px] snap-start border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 transition-all duration-300 flex flex-col relative ${proj.imageUrl && !proj.isIframe ? "cursor-zoom-in" : ""
                        }`}
                    >
                      {/* Owner Edit / Delete Button */}
                      {guestRole === "OWNER" && (
                        <div
                          className="absolute top-2 left-2 z-20 flex items-center gap-1.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => openOwnerModal("project", proj)}
                            className="px-2 py-0.5 bg-yellow-300 hover:bg-yellow-400 text-black border-2 border-black text-[10px] font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
                            title="Edit Projek"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Hapus projek ${proj.title}?`)) {
                                handleDeleteProject(proj.id);
                              }
                            }}
                            className="px-2 py-0.5 bg-red-500 hover:bg-red-600 text-white border-2 border-black text-[10px] font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
                            title="Hapus Projek"
                          >
                            🗑️
                          </button>
                        </div>
                      )}

                      {/* Preview Media (Iframe vs Image) */}
                      {proj.isIframe && proj.liveUrl ? (
                        <div className="relative w-full h-[220px] border-b-2 border-black overflow-hidden bg-zinc-100">
                          <iframe
                            src={proj.liveUrl}
                            title={`${proj.title} Preview`}
                            style={{
                              width: "133%",
                              height: "133%",
                              transform: "scale(0.75)",
                              transformOrigin: "top left",
                              pointerEvents: "none",
                              border: "none",
                            }}
                            loading="lazy"
                          />
                          <div className="absolute top-2 right-2 flex items-center gap-1.5 px-2 py-1 bg-green-400 border-2 border-black text-[10px] font-black uppercase pointer-events-none">
                            <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse"></span>Live
                          </div>
                        </div>
                      ) : proj.imageUrl ? (
                        <div className={`relative w-full h-[220px] border-b-2 border-black overflow-hidden ${proj.tab === "motion" ? "bg-zinc-950 flex items-center justify-center p-4" : "bg-zinc-100 group"}`}>
                          <Image
                            src={proj.imageUrl}
                            alt={proj.title}
                            fill
                            className={proj.tab === "motion" ? "object-contain p-2" : "object-cover transition-transform duration-500 group-hover:scale-105"}
                            unoptimized={true}
                          />
                          <div className={`absolute top-2 right-2 flex items-center gap-1.5 px-2 py-1 border-2 border-black text-[10px] font-black uppercase pointer-events-none ${proj.tab === "graphic" ? "bg-orange-500 text-black" : proj.tab === "motion" ? "bg-purple-400 text-black" : proj.tab === "uiux" ? "bg-pink-400 text-black" : "bg-blue-400 text-black"}`}>
                            {proj.tab === "graphic" ? "Design" : proj.tab === "motion" ? "Motion" : proj.tab === "uiux" ? "UI/UX" : "Work"}
                          </div>
                        </div>
                      ) : (
                        <div className="relative w-full h-[180px] border-b-2 border-black bg-zinc-100 flex items-center justify-center font-black uppercase text-xs opacity-50">
                          No Preview Available
                        </div>
                      )}

                      {/* Card Body */}
                      <div className="p-5 flex flex-col gap-3 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-base font-black uppercase tracking-tight leading-tight">{proj.title}</h3>
                          <span className="flex-shrink-0 text-xs font-black px-2 py-1 bg-blue-400 border-2 border-black">
                            {badgeLabel}
                          </span>
                        </div>
                        <p className="text-sm font-medium opacity-70 leading-relaxed flex-1">
                          {proj.description}
                        </p>
                        {proj.tags && proj.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {proj.tags.map((t) => (
                              <span key={t} className="text-[10px] font-black uppercase px-2 py-0.5 border-2 border-black bg-zinc-100">
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center gap-2 mt-1">
                          {proj.liveUrl && (
                            <a
                              href={proj.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 border-2 border-black bg-black text-white text-xs font-black uppercase tracking-widest hover:bg-blue-400 hover:text-black shadow-[3px_3px_0px_0px_rgba(96,165,250,1)] hover:shadow-none transition-all duration-200"
                            >
                              {t("proj_view_site")}
                            </a>
                          )}
                          {proj.proofUrl && (
                            <a
                              href={proj.proofUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center justify-center gap-1 px-3 py-2 border-2 border-black bg-yellow-300 hover:bg-yellow-400 text-black text-xs font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                              title="Lihat Bukti"
                            >
                              {t("exp_proof_link")}
                            </a>
                          )}
                          {!proj.liveUrl && proj.imageUrl && (
                            <button
                              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 border-2 border-black bg-black text-white text-xs font-black uppercase tracking-widest hover:bg-blue-400 hover:text-black shadow-[3px_3px_0px_0px_rgba(96,165,250,1)] hover:shadow-none transition-all duration-200"
                            >
                              {t("proj_view_artwork")}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                    );
                  })
              )}

              {/* More Coming Soon */}
              <div className="flex-shrink-0 w-[180px] snap-start border-2 border-dashed border-black flex flex-col items-center justify-center gap-3 p-8 text-center opacity-40 hover:opacity-70 transition-opacity duration-300">
                <div className="text-4xl font-black">+</div>
                <p className="text-xs font-black uppercase tracking-widest">{t("proj_more_coming")}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel Navigation Buttons (Di Bawah Project Cards / Di Atas Education) */}
        <div className="flex items-center justify-center sm:justify-end gap-3 mt-6">
          <button
            onClick={() => scrollProjects("left")}
            title="Scroll Left"
            aria-label="Scroll Left"
            className="w-10 h-10 flex items-center justify-center border-2 border-black bg-white hover:bg-zinc-100 text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer font-black text-sm select-none"
          >
            ◀
          </button>
          <button
            onClick={() => scrollProjects("right")}
            title="Scroll Right"
            aria-label="Scroll Right"
            className="w-10 h-10 flex items-center justify-center border-2 border-black bg-white hover:bg-zinc-100 text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer font-black text-sm select-none"
          >
            ▶
          </button>
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

          {/* Education & Achievements Card */}
          <div className="scroll-card-reveal border-2 border-black p-6 md:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-white relative">
            {guestRole === "OWNER" && (
              <button
                onClick={() => openOwnerModal("education", portfolioEducation)}
                className="absolute top-4 right-4 px-3 py-1 bg-yellow-300 hover:bg-yellow-400 text-black border-2 border-black text-xs font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
                title="Edit Pendidikan & Tambah Prestasi"
              >
                ✏️ Edit & Tambah Prestasi
              </button>
            )}
            <p className="text-xs font-black uppercase tracking-[0.2em] opacity-70 mb-3">{t("bio_edu_label")}</p>
            <h3 className="text-xl font-black uppercase tracking-tight">{portfolioEducation?.school || t("edu_school")}</h3>
            <p className="text-base font-bold text-blue-400">{portfolioEducation?.major || t("edu_major")}</p>
            <p className="text-sm opacity-50 mt-1">{portfolioEducation?.locationStatus || t("edu_loc")}</p>
            {portfolioEducation?.verifyUrl && (
              <a
                href={portfolioEducation.verifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-2 text-[10px] font-black uppercase tracking-widest text-blue-500 hover:text-blue-600 hover:underline"
              >
                {t("edu_verify_status")}
              </a>
            )}

            {/* Achievements */}
            {portfolioEducation?.achievements && portfolioEducation.achievements.length > 0 && (
              <div className="mt-5 border-t-2 border-black/10 pt-4 flex flex-col gap-3.5">
                {portfolioEducation.achievements.map((ach) => (
                  <div key={ach.id} className="border-l-4 border-orange-500 pl-3">
                    <p className="text-[11px] font-black uppercase tracking-[0.15em] text-orange-600 mb-0.5">
                      {ach.label || t("edu_achievements_label")}
                    </p>
                    <p className="text-sm font-bold leading-snug">
                      {ach.text}{" "}
                      {ach.proofUrl && (
                        <a
                          href={ach.proofUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-xs font-black uppercase text-blue-500 hover:text-blue-600 hover:underline ml-1"
                        >
                          ({t("exp_proof_link")})
                        </a>
                      )}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Certifications Card */}
          <div className="scroll-card-reveal border-2 border-black p-6 md:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-white relative">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-black uppercase tracking-[0.2em] opacity-70">Certifications</p>
              {guestRole === "OWNER" && (
                <button
                  onClick={() => openOwnerModal("certificate", null)}
                  className="px-2.5 py-1 bg-yellow-300 hover:bg-yellow-400 text-black border-2 border-black text-[10px] font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
                >
                  + Tambah Sertifikat
                </button>
              )}
            </div>
            <div className="flex flex-col gap-4">
              {portfolioCertificates.map((cert) => (
                <div key={cert.id} className={`border-l-4 ${cert.borderColor || "border-orange-500"} pl-4 relative group`}>
                  {guestRole === "OWNER" && (
                    <div className="absolute top-0 right-0 flex items-center gap-1 opacity-80 group-hover:opacity-100">
                      <button
                        onClick={() => openOwnerModal("certificate", cert)}
                        className="px-1.5 py-0.5 bg-yellow-300 hover:bg-yellow-400 text-black border border-black text-[9px] font-black uppercase cursor-pointer"
                        title="Edit Sertifikat"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Hapus sertifikat ${cert.title}?`)) {
                            handleDeleteCertificate(cert.id);
                          }
                        }}
                        className="px-1.5 py-0.5 bg-red-500 hover:bg-red-600 text-white border border-black text-[9px] font-black uppercase cursor-pointer"
                        title="Hapus Sertifikat"
                      >
                        🗑️
                      </button>
                    </div>
                  )}
                  <p className="text-sm font-black">{cert.title}</p>
                  <p className="text-xs opacity-60">
                    {cert.org} {cert.credentialNo ? `— ${cert.credentialNo}` : ""}
                  </p>
                  {cert.date && <p className="text-xs opacity-70">{cert.date}</p>}
                  {cert.verifyUrl && (
                    <a
                      href={cert.verifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-1.5 text-[10px] font-black uppercase tracking-widest text-blue-500 hover:text-blue-600 hover:underline"
                    >
                      {t("cert_verify")}
                    </a>
                  )}
                </div>
              ))}
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
              <p className="text-xs font-black uppercase tracking-[0.2em] opacity-70 group-hover:opacity-100">Gmail</p>
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
              <p className="text-xs font-black uppercase tracking-[0.2em] opacity-70 group-hover:opacity-100">LinkedIn</p>
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
              <p className="text-xs font-black uppercase tracking-[0.2em] opacity-70 group-hover:opacity-100">Instagram</p>
              <p className="text-base md:text-lg font-black group-hover:text-black transition-colors duration-300">
                @rzkyandriyanto
              </p>
              <p className="text-xs font-bold opacity-50 mt-1 group-hover:opacity-80">{t("contact_ig_sub")}</p>
            </div>
          </a>
        </div>
      </section>

      {/* === KOTAK ANIME (NYAN CAT + CALL TO ACTION) === */}
      <div
        ref={animeBoxRef}
        className="mt-2 mb-20 w-full max-w-3xl mx-auto flex flex-col justify-center items-center gap-6"
      >
        <div className="nyan-cat-img relative w-full h-[280px] md:h-[420px]">
          <Image
            src="/Animations.gif"
            alt="Nyan Cat"
            fill
            className="object-contain"
            unoptimized
          />
        </div>
        <div className="lets-craft-text font-bebas-neue text-4xl md:text-6xl text-orange-500 tracking-wider uppercase text-center select-none flex flex-wrap justify-center items-center gap-x-3 gap-y-1 px-4">
          <span className="craft-word inline-block">Let&apos;s</span>
          <span className="craft-word inline-block">craft</span>
          <span className="craft-word inline-block">something</span>
          <span className="craft-word inline-block text-black bg-amber-300 px-3 py-0.5 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            unforgettable
          </span>
          <span className="craft-word inline-block">together.</span>
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
            <p className="text-xs font-black uppercase tracking-[0.2em] opacity-70 mb-3">{t("guest_post_title")}</p>

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
                  {guestRole === "OWNER" ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src="/images/pixel-cat-owner.svg"
                      alt="Owner Avatar"
                      className="w-full h-full object-cover bg-zinc-950"
                    />
                  ) : guestCustomAvatar || guestInstagram || guestName ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={guestCustomAvatar || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(guestInstagram || guestName)}`}
                      alt="Avatar"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover bg-zinc-950"
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
              <div className="flex items-center justify-between">
                <p>{t("guest_role")}: {guestRole} {guestRole === "OWNER" && t("guest_owner_desc")}</p>
                {guestRole === "OWNER" && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleResetAllData();
                    }}
                    className="text-[9px] font-black uppercase text-red-400 hover:text-red-300 underline"
                  >
                    Reset Data Default
                  </button>
                )}
              </div>
            </div>

            <form onSubmit={handleOpenCharacterCustomizer} className="flex flex-col gap-3">
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
                      {comment.role === "OWNER" || comment.name.toLowerCase().includes("owner") ? (
                        <a
                          href={`https://instagram.com/${comment.instagram || "rzkyandriyanto"}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 border-2 border-black rounded-full overflow-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-orange-500 flex-shrink-0 flex items-center justify-center font-black text-sm text-black hover:scale-105 transition-transform duration-150 cursor-pointer"
                          title="Buka profil Owner @rzkyandriyanto"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src="/images/pixel-cat-owner.svg"
                            alt="Owner Cat Avatar"
                            className="w-full h-full object-cover bg-zinc-950"
                          />
                        </a>
                      ) : comment.instagram ? (
                        <a
                          href={`https://instagram.com/${comment.instagram}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 border-2 border-black rounded-full overflow-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-orange-400 flex-shrink-0 flex items-center justify-center font-black text-sm text-black hover:scale-105 transition-transform duration-150 cursor-pointer"
                          title={`Buka profil @${comment.instagram}`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={comment.avatar_url || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(comment.instagram)}`}
                            alt={comment.name}
                            className="w-full h-full object-cover bg-zinc-950"
                          />
                        </a>
                      ) : (
                        <div className="w-10 h-10 border-2 border-black rounded-full overflow-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-orange-400 flex-shrink-0 flex items-center justify-center font-black text-sm text-black">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={comment.avatar_url || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(comment.name)}`}
                            alt={comment.name}
                            className="w-full h-full object-cover bg-zinc-950"
                          />
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

      {/* Modal Karakter Pixel Art saat Submit Komentar */}
      <CharacterCustomizerModal
        isOpen={isCharacterModalOpen}
        onClose={() => setIsCharacterModalOpen(false)}
        onConfirm={handleConfirmCommentWithAvatar}
        initialName={guestName}
        initialInstagram={guestInstagram}
      />

      {/* Modal Mode Owner: Add & Edit Projects, Experiences, Education, Certificates */}
      <OwnerContentModal
        isOpen={isOwnerModalOpen}
        onClose={() => setIsOwnerModalOpen(false)}
        modalType={ownerModalType}
        initialData={ownerModalData}
        onSaveProject={handleSaveProject}
        onDeleteProject={handleDeleteProject}
        onSaveExperience={handleSaveExperience}
        onDeleteExperience={handleDeleteExperience}
        onSaveEducation={handleSaveEducation}
        onSaveCertificate={handleSaveCertificate}
        onDeleteCertificate={handleDeleteCertificate}
        onSaveSkills={handleSaveSkills}
      />
    </main>
  );
}
