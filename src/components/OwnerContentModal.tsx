"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import {
  ProjectItem,
  ExperienceItem,
  EducationData,
  CertificateItem,
  ProjectTab,
  SkillsData,
} from "../lib/portfolioData";
import { TechIcon } from "./TechIcons";

export type ModalType = "project" | "experience" | "education" | "certificate" | "skills";

interface OwnerContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  modalType: ModalType;
  initialData?: ProjectItem | ExperienceItem | EducationData | CertificateItem | SkillsData | null;
  onSaveProject?: (data: ProjectItem) => void;
  onDeleteProject?: (id: string) => void;
  onSaveExperience?: (data: ExperienceItem) => void;
  onDeleteExperience?: (id: string) => void;
  onSaveEducation?: (data: EducationData) => void;
  onSaveCertificate?: (data: CertificateItem) => void;
  onDeleteCertificate?: (id: string) => void;
  onSaveSkills?: (data: SkillsData) => void;
}

export default function OwnerContentModal({
  isOpen,
  onClose,
  modalType,
  initialData,
  onSaveProject,
  onDeleteProject,
  onSaveExperience,
  onDeleteExperience,
  onSaveEducation,
  onSaveCertificate,
  onDeleteCertificate,
  onSaveSkills,
}: OwnerContentModalProps) {
  // Project Form State
  const [projTab, setProjTab] = useState<ProjectTab>("web");
  const [projTitle, setProjTitle] = useState("");
  const [projDesc, setProjDesc] = useState("");
  const [projTags, setProjTags] = useState("");
  const [projLiveUrl, setProjLiveUrl] = useState("");
  const [projImageUrl, setProjImageUrl] = useState("");
  const [projIsIframe, setProjIsIframe] = useState(false);
  const [projProofUrl, setProjProofUrl] = useState("");
  const [projBadge, setProjBadge] = useState("");
  const [isConvertingImage, setIsConvertingImage] = useState(false);
  const [imageSizeInfo, setImageSizeInfo] = useState<string>("");

  // Helper untuk convert file gambar apapun ke WebP secara otomatis
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsConvertingImage(true);
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;

        // Skala proporsional jika resolusi sangat besar (max 1600px) agar ukuran efisien dan jernih
        const maxDim = 1600;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");

        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          // Konversi ke format image/webp dengan kualitas tinggi 0.90
          const webpDataUrl = canvas.toDataURL("image/webp", 0.9);
          setProjImageUrl(webpDataUrl);

          // Hitung estimasi ukuran WebP
          const sizeKb = Math.round((webpDataUrl.length * 3) / 4 / 1024);
          setImageSizeInfo(`${width}x${height}px &bull; ~${sizeKb} KB (WebP)`);
        }
        setIsConvertingImage(false);
      };

      img.onerror = () => {
        alert("Gagal membaca file gambar.");
        setIsConvertingImage(false);
      };

      if (event.target?.result) {
        img.src = event.target.result as string;
      }
    };

    reader.readAsDataURL(file);
  };

  // Experience Form State
  const [expType, setExpType] = useState<"intern" | "job">("job");
  const [expTitle, setExpTitle] = useState("");
  const [expRole, setExpRole] = useState("");
  const [expLocation, setExpLocation] = useState("");
  const [expDate, setExpDate] = useState("");
  const [expTag, setExpTag] = useState("");
  const [expProofUrl, setExpProofUrl] = useState("");
  const [expBullets, setExpBullets] = useState<string[]>([""]);

  // Education Form State
  const [eduSchool, setEduSchool] = useState("");
  const [eduMajor, setEduMajor] = useState("");
  const [eduLocStatus, setEduLocStatus] = useState("");
  const [eduVerifyUrl, setEduVerifyUrl] = useState("");
  const [eduAchievements, setEduAchievements] = useState<
    Array<{ id: string; label: string; text: string; proofUrl?: string }>
  >([]);

  // Certificate Form State
  const [certTitle, setCertTitle] = useState("");
  const [certOrg, setCertOrg] = useState("");
  const [certCredNo, setCertCredNo] = useState("");
  const [certDate, setCertDate] = useState("");
  const [certVerifyUrl, setCertVerifyUrl] = useState("");
  const [certBorderColor, setCertBorderColor] = useState("border-orange-500");

  // Skills Form State
  const [skillsSoft, setSkillsSoft] = useState("");
  const [skillsHard, setSkillsHard] = useState("");
  const [skillsSoftware, setSkillsSoftware] = useState("");

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    if (modalType === "project") {
      const p = initialData as ProjectItem | undefined;
      setProjTab(p?.tab || "web");
      setProjTitle(p?.title || "");
      setProjDesc(p?.description || "");
      setProjTags(p?.tags ? p.tags.join(", ") : "React, Next.js");
      setProjLiveUrl(p?.liveUrl || "");
      setProjImageUrl(p?.imageUrl || "");
      setProjIsIframe(!!p?.isIframe);
      setProjProofUrl(p?.proofUrl || "");
      setProjBadge(p?.badge || "");
    } else if (modalType === "experience") {
      const e = initialData as ExperienceItem | undefined;
      setExpType(e?.type || "job");
      setExpTitle(e?.title || "");
      setExpRole(e?.role || "");
      setExpLocation(e?.location || "");
      setExpDate(e?.date || "");
      setExpTag(e?.tag || "");
      setExpProofUrl(e?.proofUrl || "");
      setExpBullets(e?.bullets && e.bullets.length > 0 ? [...e.bullets] : [""]);
    } else if (modalType === "education") {
      const ed = initialData as EducationData | undefined;
      setEduSchool(ed?.school || "");
      setEduMajor(ed?.major || "");
      setEduLocStatus(ed?.locationStatus || "");
      setEduVerifyUrl(ed?.verifyUrl || "");
      setEduAchievements(
        ed?.achievements && ed.achievements.length > 0
          ? ed.achievements.map((a) => ({ ...a }))
          : [{ id: "achieve-" + Date.now(), label: "Achievements", text: "", proofUrl: "" }]
      );
    } else if (modalType === "certificate") {
      const c = initialData as CertificateItem | undefined;
      setCertTitle(c?.title || "");
      setCertOrg(c?.org || "");
      setCertCredNo(c?.credentialNo || "");
      setCertDate(c?.date || "");
      setCertVerifyUrl(c?.verifyUrl || "");
      setCertBorderColor(c?.borderColor || "border-orange-500");
    } else if (modalType === "skills") {
      const sk = initialData as SkillsData | undefined;
      setSkillsSoft(sk?.softSkills ? sk.softSkills.join(", ") : "");
      setSkillsHard(sk?.hardSkills ? sk.hardSkills.join(", ") : "");
      setSkillsSoftware(sk?.softwareSkills ? sk.softwareSkills.join(", ") : "");
    }
  }, [isOpen, modalType, initialData]);

  if (!isOpen || !mounted || typeof document === "undefined") return null;

  const isEditing = !!initialData && "id" in initialData;

  // Handlers
  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projTitle.trim()) return alert("Judul projek wajib diisi!");
    const item: ProjectItem = {
      id: isEditing ? (initialData as ProjectItem).id : "proj-" + Date.now(),
      tab: projTab,
      title: projTitle.trim(),
      description: projDesc.trim(),
      tags: projTags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      liveUrl: projLiveUrl.trim() || undefined,
      imageUrl: projImageUrl.trim() || undefined,
      isIframe: projIsIframe,
      proofUrl: projProofUrl.trim() || undefined,
      badge: projBadge.trim() || undefined,
    };
    onSaveProject?.(item);
    onClose();
  };

  const handleSaveExperience = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expTitle.trim()) return alert("Nama perusahaan / tempat kerja wajib diisi!");
    const cleanBullets = expBullets.map((b) => b.trim()).filter(Boolean);
    const item: ExperienceItem = {
      id: isEditing ? (initialData as ExperienceItem).id : "exp-" + Date.now(),
      type: expType,
      title: expTitle.trim(),
      role: expRole.trim(),
      location: expLocation.trim(),
      date: expDate.trim(),
      tag: expTag.trim() || undefined,
      bullets: cleanBullets.length > 0 ? cleanBullets : ["Deskripsi tugas & pencapaian"],
      proofUrl: expProofUrl.trim() || undefined,
    };
    onSaveExperience?.(item);
    onClose();
  };

  const handleSaveEducation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eduSchool.trim()) return alert("Nama universitas/sekolah wajib diisi!");
    const data: EducationData = {
      school: eduSchool.trim(),
      major: eduMajor.trim(),
      locationStatus: eduLocStatus.trim(),
      verifyUrl: eduVerifyUrl.trim() || undefined,
      achievements: eduAchievements
        .filter((a) => a.text.trim())
        .map((a) => ({
          id: a.id || "achieve-" + Date.now(),
          label: a.label.trim() || "Achievements",
          text: a.text.trim(),
          proofUrl: a.proofUrl?.trim() || undefined,
        })),
    };
    onSaveEducation?.(data);
    onClose();
  };

  const handleSaveCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certTitle.trim()) return alert("Nama sertifikat wajib diisi!");
    const item: CertificateItem = {
      id: isEditing ? (initialData as CertificateItem).id : "cert-" + Date.now(),
      title: certTitle.trim(),
      org: certOrg.trim(),
      credentialNo: certCredNo.trim() || undefined,
      date: certDate.trim() || undefined,
      verifyUrl: certVerifyUrl.trim() || undefined,
      borderColor: certBorderColor,
    };
    onSaveCertificate?.(item);
    onClose();
  };

  const handleSaveSkills = (e: React.FormEvent) => {
    e.preventDefault();
    const data: SkillsData = {
      softSkills: skillsSoft
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      hardSkills: skillsHard
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      softwareSkills: skillsSoftware
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };
    onSaveSkills?.(data);
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto" onClick={onClose}>
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 15 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-white border-3 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] my-auto overflow-hidden"
      >
          {/* Top Bar Header */}
          <div className="bg-black text-white px-5 py-3.5 flex items-center justify-between border-b-2 border-black">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500 border border-white inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-yellow-400 border border-white inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-green-500 border border-white inline-block"></span>
              <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider ml-2 text-yellow-400">
                👑 MODE OWNER &mdash;{" "}
                {modalType === "project" && (isEditing ? "EDIT PROJEK WORK" : "TAMBAH PROJEK WORK")}
                {modalType === "experience" && (isEditing ? "EDIT PENGALAMAN KERJA" : "TAMBAH PENGALAMAN KERJA")}
                {modalType === "education" && "EDIT PENDIDIKAN & PRESTASI"}
                {modalType === "certificate" && (isEditing ? "EDIT SERTIFIKAT" : "TAMBAH SERTIFIKAT")}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white font-black border border-white text-xs transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Form Content Area */}
          <div className="p-5 sm:p-7 max-h-[80vh] overflow-y-auto">
            {/* 1. PROJECT WORK FORM */}
            {modalType === "project" && (
              <form onSubmit={handleSaveProject} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider mb-1.5">
                      Kategori Tab
                    </label>
                    <select
                      value={projTab}
                      onChange={(e) => setProjTab(e.target.value as ProjectTab)}
                      className="w-full border-2 border-black p-2.5 text-xs font-bold bg-white focus:outline-none focus:bg-yellow-50 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                    >
                      <option value="web">Web Development</option>
                      <option value="graphic">Graphic Design</option>
                      <option value="motion">Motion Graphic</option>
                      <option value="uiux">UI/UX Design</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider mb-1.5">
                      Badge Nomor / Label (Opsional)
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: #01, Live, New"
                      value={projBadge}
                      onChange={(e) => setProjBadge(e.target.value)}
                      className="w-full border-2 border-black p-2.5 text-xs font-bold bg-white focus:outline-none focus:bg-yellow-50 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider mb-1.5">
                    Judul Projek <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: All Social Video Downloader"
                    value={projTitle}
                    onChange={(e) => setProjTitle(e.target.value)}
                    className="w-full border-2 border-black p-2.5 text-xs font-bold bg-white focus:outline-none focus:bg-yellow-50 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider mb-1.5">
                    Deskripsi / Keterangan Projek
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tuliskan keterangan projek secara ringkas..."
                    value={projDesc}
                    onChange={(e) => setProjDesc(e.target.value)}
                    className="w-full border-2 border-black p-2.5 text-xs font-medium bg-white focus:outline-none focus:bg-yellow-50 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider mb-1.5">
                    Tech Stack / Tags (Pisahkan dengan koma)
                  </label>
                  <input
                    type="text"
                    placeholder="Next.js, Tailwind, API, TypeScript"
                    value={projTags}
                    onChange={(e) => setProjTags(e.target.value)}
                    className="w-full border-2 border-black p-2.5 text-xs font-bold bg-white focus:outline-none focus:bg-yellow-50 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider mb-1.5">
                      Live URL / Demo Link (Opsional)
                    </label>
                    <input
                      type="url"
                      placeholder="https://my-awesome-project.com"
                      value={projLiveUrl}
                      onChange={(e) => setProjLiveUrl(e.target.value)}
                      className="w-full border-2 border-black p-2.5 text-xs font-bold bg-white focus:outline-none focus:bg-yellow-50 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider mb-1.5">
                      Link Bukti / Repositori / Dokumentasi (Opsional)
                    </label>
                    <input
                      type="url"
                      placeholder="https://github.com/... atau https://instagram.com/..."
                      value={projProofUrl}
                      onChange={(e) => setProjProofUrl(e.target.value)}
                      className="w-full border-2 border-black p-2.5 text-xs font-bold bg-white focus:outline-none focus:bg-yellow-50 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                    />
                  </div>
                </div>

                <div className="border-2 border-black p-3.5 bg-orange-50/50 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                      <span>🖼️</span>
                      <span>Foto / Artwork (Otomatis Convert ke WebP)</span>
                    </label>
                    <span className="text-[10px] font-bold bg-green-400 border border-black px-1.5 py-0.5 text-black uppercase shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                      Auto WebP ⚡
                    </span>
                  </div>

                  {/* File Upload Input & Button */}
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <label className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-yellow-200 border-2 border-black font-black text-xs uppercase tracking-wider cursor-pointer shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all select-none">
                      <span>📁</span>
                      <span>{isConvertingImage ? "Mengonversi ke WebP..." : "Pilih Foto (JPG, PNG, WebP)"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                    {projImageUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          setProjImageUrl("");
                          setImageSizeInfo("");
                        }}
                        className="w-full sm:w-auto px-3 py-2 bg-zinc-200 hover:bg-red-200 text-black border-2 border-black text-xs font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
                      >
                        Hapus Foto
                      </button>
                    )}
                  </div>

                  {/* Preview of Converted WebP */}
                  {projImageUrl && (
                    <div className="flex items-center gap-3 p-2 bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      <div className="w-16 h-16 border border-black bg-zinc-100 relative overflow-hidden flex-shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={projImageUrl}
                          alt="Preview WebP"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="text-xs font-black text-green-600 flex items-center gap-1">
                          <span>✓</span> Format: WebP Siap Tampil
                        </p>
                        {imageSizeInfo && (
                          <p className="text-[10px] font-bold text-zinc-500 truncate" dangerouslySetInnerHTML={{ __html: imageSizeInfo }} />
                        )}
                        <p className="text-[10px] text-zinc-400 truncate mt-0.5">
                          {projImageUrl.startsWith("data:") ? "Base64 WebP Data URL" : projImageUrl}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Atau Input URL Manual */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-600 mb-1">
                      Atau ketik URL / Path Gambar Manual:
                    </label>
                    <input
                      type="text"
                      placeholder="/dudul-artwork.webp atau URL gambar eksternal"
                      value={projImageUrl.startsWith("data:") ? "(Foto WebP Terupload)" : projImageUrl}
                      onChange={(e) => {
                        setProjImageUrl(e.target.value);
                        setImageSizeInfo("");
                      }}
                      className="w-full border-2 border-black p-2 text-xs font-bold bg-white focus:outline-none focus:bg-yellow-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="checkbox"
                    id="projIframeCheck"
                    checked={projIsIframe}
                    onChange={(e) => setProjIsIframe(e.target.checked)}
                    className="w-4 h-4 accent-orange-500 cursor-pointer border-2 border-black"
                  />
                  <label htmlFor="projIframeCheck" className="text-xs font-bold cursor-pointer select-none">
                    Gunakan Live Interactive Iframe Preview (untuk Web Demo URL di atas)
                  </label>
                </div>

                {/* Footer Action Buttons */}
                <div className="flex items-center justify-between gap-3 mt-4 pt-4 border-t-2 border-black">
                  {isEditing ? (
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm("Hapus projek ini?")) {
                          onDeleteProject?.((initialData as ProjectItem).id);
                          onClose();
                        }
                      }}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5"
                    >
                      🗑️ Hapus Projek
                    </button>
                  ) : (
                    <div></div>
                  )}
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 bg-zinc-200 hover:bg-zinc-300 font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-black font-black text-xs uppercase tracking-wider border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5"
                    >
                      💾 Simpan Projek
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* 2. WORK EXPERIENCE FORM */}
            {modalType === "experience" && (
              <form onSubmit={handleSaveExperience} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider mb-1.5">
                      Tipe Pengalaman
                    </label>
                    <select
                      value={expType}
                      onChange={(e) => setExpType(e.target.value as "intern" | "job")}
                      className="w-full border-2 border-black p-2.5 text-xs font-bold bg-white focus:outline-none focus:bg-yellow-50 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                    >
                      <option value="job">Pengalaman Kerja (Job Experience)</option>
                      <option value="intern">Magang / Internship</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider mb-1.5">
                      Tag / Badge (Opsional)
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: TECH / WEB DEV"
                      value={expTag}
                      onChange={(e) => setExpTag(e.target.value)}
                      className="w-full border-2 border-black p-2.5 text-xs font-bold bg-white focus:outline-none focus:bg-yellow-50 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider mb-1.5">
                      Nama Perusahaan / Organisasi <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: PT Sumber Alfaria Trijaya Tbk"
                      value={expTitle}
                      onChange={(e) => setExpTitle(e.target.value)}
                      className="w-full border-2 border-black p-2.5 text-xs font-bold bg-white focus:outline-none focus:bg-yellow-50 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider mb-1.5">
                      Jabatan / Role <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Store Crew — Contract Employee"
                      value={expRole}
                      onChange={(e) => setExpRole(e.target.value)}
                      className="w-full border-2 border-black p-2.5 text-xs font-bold bg-white focus:outline-none focus:bg-yellow-50 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider mb-1.5">
                      Lokasi (Kota)
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Tangerang / Jakarta Selatan"
                      value={expLocation}
                      onChange={(e) => setExpLocation(e.target.value)}
                      className="w-full border-2 border-black p-2.5 text-xs font-bold bg-white focus:outline-none focus:bg-yellow-50 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider mb-1.5">
                      Periode Waktu
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: November 2021 – July 2022"
                      value={expDate}
                      onChange={(e) => setExpDate(e.target.value)}
                      className="w-full border-2 border-black p-2.5 text-xs font-bold bg-white focus:outline-none focus:bg-yellow-50 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider mb-1.5">
                    Link Bukti / Sertifikat Paklaring / Post Instagram (Opsional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://www.instagram.com/p/... atau link bukti lainnya"
                    value={expProofUrl}
                    onChange={(e) => setExpProofUrl(e.target.value)}
                    className="w-full border-2 border-black p-2.5 text-xs font-bold bg-white focus:outline-none focus:bg-yellow-50 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                  />
                </div>

                {/* Bullet Points List */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-black uppercase tracking-wider">
                      Poin Tanggung Jawab & Pencapaian (Keterangan)
                    </label>
                    <button
                      type="button"
                      onClick={() => setExpBullets([...expBullets, ""])}
                      className="px-2.5 py-1 bg-yellow-300 hover:bg-yellow-400 text-black border border-black text-[11px] font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    >
                      + Tambah Poin
                    </button>
                  </div>
                  <div className="flex flex-col gap-2.5">
                    {expBullets.map((bullet, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="w-5 text-center text-xs font-black opacity-50">{idx + 1}.</span>
                        <input
                          type="text"
                          placeholder={`Keterangan poin ${idx + 1}...`}
                          value={bullet}
                          onChange={(e) => {
                            const updated = [...expBullets];
                            updated[idx] = e.target.value;
                            setExpBullets(updated);
                          }}
                          className="flex-1 border-2 border-black p-2 text-xs font-medium bg-white focus:outline-none focus:bg-yellow-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                        />
                        {expBullets.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const updated = expBullets.filter((_, i) => i !== idx);
                              setExpBullets(updated);
                            }}
                            className="w-8 h-8 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white font-black text-xs border border-black"
                            title="Hapus baris ini"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Action Buttons */}
                <div className="flex items-center justify-between gap-3 mt-4 pt-4 border-t-2 border-black">
                  {isEditing ? (
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm("Hapus pengalaman kerja ini?")) {
                          onDeleteExperience?.((initialData as ExperienceItem).id);
                          onClose();
                        }
                      }}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5"
                    >
                      🗑️ Hapus Pengalaman
                    </button>
                  ) : (
                    <div></div>
                  )}
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 bg-zinc-200 hover:bg-zinc-300 font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-black font-black text-xs uppercase tracking-wider border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5"
                    >
                      💾 Simpan Pengalaman
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* 3. EDUCATION & ACHIEVEMENTS FORM */}
            {modalType === "education" && (
              <form onSubmit={handleSaveEducation} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider mb-1.5">
                      Nama Universitas / Sekolah <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Universitas Pamulang"
                      value={eduSchool}
                      onChange={(e) => setEduSchool(e.target.value)}
                      className="w-full border-2 border-black p-2.5 text-xs font-bold bg-white focus:outline-none focus:bg-yellow-50 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider mb-1.5">
                      Jurusan / Jenjang
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Bachelor of Computer Science / S1 Teknik Informatika"
                      value={eduMajor}
                      onChange={(e) => setEduMajor(e.target.value)}
                      className="w-full border-2 border-black p-2.5 text-xs font-bold bg-white focus:outline-none focus:bg-yellow-50 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider mb-1.5">
                      Lokasi & Status
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Tangerang — Currently Enrolled"
                      value={eduLocStatus}
                      onChange={(e) => setEduLocStatus(e.target.value)}
                      className="w-full border-2 border-black p-2.5 text-xs font-bold bg-white focus:outline-none focus:bg-yellow-50 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider mb-1.5">
                      Link Verifikasi PDDIKTI (Opsional)
                    </label>
                    <input
                      type="url"
                      placeholder="https://pddikti.kemdiktisaintek.go.id/..."
                      value={eduVerifyUrl}
                      onChange={(e) => setEduVerifyUrl(e.target.value)}
                      className="w-full border-2 border-black p-2.5 text-xs font-bold bg-white focus:outline-none focus:bg-yellow-50 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                    />
                  </div>
                </div>

                {/* Achievements List */}
                <div className="mt-3 pt-3 border-t-2 border-black">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <label className="text-xs font-black uppercase tracking-wider block">
                        🏆 Daftar Prestasi / Pencapaian (Achievements)
                      </label>
                      <span className="text-[10px] text-zinc-500 font-bold">
                        Bisa ditambahkan sebanyak yang Anda inginkan
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setEduAchievements([
                          ...eduAchievements,
                          { id: "achieve-" + Date.now(), label: "Prestasi", text: "", proofUrl: "" },
                        ])
                      }
                      className="px-3 py-1.5 bg-yellow-300 hover:bg-yellow-400 text-black border-2 border-black text-xs font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
                    >
                      + Tambah Prestasi Baru
                    </button>
                  </div>
                  <div className="flex flex-col gap-3.5">
                    {eduAchievements.map((ach, idx) => (
                      <div key={ach.id || idx} className="p-3.5 border-2 border-black bg-zinc-50 flex flex-col gap-2.5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 flex-1">
                            <span className="text-xs font-black bg-orange-500 text-black px-2 py-0.5 border border-black text-[10px]">
                              #{idx + 1}
                            </span>
                            <input
                              type="text"
                              placeholder="Kategori/Label (Contoh: Prestasi / Publikasi SINTA / Juara Lomba)"
                              value={ach.label}
                              onChange={(e) => {
                                const updated = [...eduAchievements];
                                updated[idx].label = e.target.value;
                                setEduAchievements(updated);
                              }}
                              className="w-full border-2 border-black p-1.5 text-xs font-bold bg-white focus:outline-none focus:bg-yellow-50"
                            />
                          </div>
                          {eduAchievements.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                const updated = eduAchievements.filter((_, i) => i !== idx);
                                setEduAchievements(updated);
                              }}
                              className="px-2.5 py-1 bg-red-500 hover:bg-red-600 text-white font-black text-xs border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                              title="Hapus Prestasi Ini"
                            >
                              ✕ Hapus
                            </button>
                          )}
                        </div>
                        <div>
                          <label className="block text-[10px] font-black uppercase tracking-wider mb-1 opacity-70">
                            Keterangan Prestasi
                          </label>
                          <textarea
                            rows={2}
                            placeholder="Contoh: Developed a project published in SINTA 5 scientific journal..."
                            value={ach.text}
                            onChange={(e) => {
                              const updated = [...eduAchievements];
                              updated[idx].text = e.target.value;
                              setEduAchievements(updated);
                            }}
                            className="w-full border-2 border-black p-2 text-xs font-medium bg-white focus:outline-none focus:bg-yellow-50 resize-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black uppercase tracking-wider mb-1 opacity-70">
                            Link Bukti / Jurnal / Sertifikat (Opsional)
                          </label>
                          <input
                            type="url"
                            placeholder="https://garuda.kemdiktisaintek.go.id/... atau link bukti lainnya"
                            value={ach.proofUrl || ""}
                            onChange={(e) => {
                              const updated = [...eduAchievements];
                              updated[idx].proofUrl = e.target.value;
                              setEduAchievements(updated);
                            }}
                            className="w-full border-2 border-black p-1.5 text-xs font-bold bg-white focus:outline-none focus:bg-yellow-50"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Action Buttons */}
                <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t-2 border-black">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 bg-zinc-200 hover:bg-zinc-300 font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-black font-black text-xs uppercase tracking-wider border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5"
                  >
                    💾 Simpan Pendidikan
                  </button>
                </div>
              </form>
            )}

            {/* 4. CERTIFICATES FORM */}
            {modalType === "certificate" && (
              <form onSubmit={handleSaveCertificate} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider mb-1.5">
                    Nama Sertifikat / Topik <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Belajar Dasar AI (Learn AI Basics)"
                    value={certTitle}
                    onChange={(e) => setCertTitle(e.target.value)}
                    className="w-full border-2 border-black p-2.5 text-xs font-bold bg-white focus:outline-none focus:bg-yellow-50 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider mb-1.5">
                      Lembaga Penerbit / Organisasi <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Dicoding Indonesia / Digital Talent Scholarship"
                      value={certOrg}
                      onChange={(e) => setCertOrg(e.target.value)}
                      className="w-full border-2 border-black p-2.5 text-xs font-bold bg-white focus:outline-none focus:bg-yellow-50 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider mb-1.5">
                      No. Kredensial / Sertifikat (Opsional)
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: No. IL2C5B030V025"
                      value={certCredNo}
                      onChange={(e) => setCertCredNo(e.target.value)}
                      className="w-full border-2 border-black p-2.5 text-xs font-bold bg-white focus:outline-none focus:bg-yellow-50 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider mb-1.5">
                      Tanggal Terbit (Opsional)
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: October 1, 2025"
                      value={certDate}
                      onChange={(e) => setCertDate(e.target.value)}
                      className="w-full border-2 border-black p-2.5 text-xs font-bold bg-white focus:outline-none focus:bg-yellow-50 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider mb-1.5">
                      Warna Aksen Garis
                    </label>
                    <select
                      value={certBorderColor}
                      onChange={(e) => setCertBorderColor(e.target.value)}
                      className="w-full border-2 border-black p-2.5 text-xs font-bold bg-white focus:outline-none focus:bg-yellow-50 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                    >
                      <option value="border-orange-500">Oranye (Orange 500)</option>
                      <option value="border-blue-400">Biru (Blue 400)</option>
                      <option value="border-purple-500">Ungu (Purple 500)</option>
                      <option value="border-green-500">Hijau (Green 500)</option>
                      <option value="border-black">Hitam (Black)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider mb-1.5">
                    Link Verifikasi / Bukti Sertifikat (Opsional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://www.dicoding.com/certificates/... atau link bukti"
                    value={certVerifyUrl}
                    onChange={(e) => setCertVerifyUrl(e.target.value)}
                    className="w-full border-2 border-black p-2.5 text-xs font-bold bg-white focus:outline-none focus:bg-yellow-50 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                  />
                </div>

                {/* Footer Action Buttons */}
                <div className="flex items-center justify-between gap-3 mt-4 pt-4 border-t-2 border-black">
                  {isEditing ? (
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm("Hapus sertifikat ini?")) {
                          onDeleteCertificate?.((initialData as CertificateItem).id);
                          onClose();
                        }
                      }}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5"
                    >
                      🗑️ Hapus Sertifikat
                    </button>
                  ) : (
                    <div></div>
                  )}
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 bg-zinc-200 hover:bg-zinc-300 font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-black font-black text-xs uppercase tracking-wider border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5"
                    >
                      💾 Simpan Sertifikat
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* 5. SKILLS & AUTO-LOGO FORM */}
            {modalType === "skills" && (
              <form onSubmit={handleSaveSkills} className="flex flex-col gap-5">
                {/* Info Banner */}
                <div className="p-3 bg-yellow-100 border-2 border-black text-xs font-bold flex items-start gap-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  <span className="text-base flex-shrink-0">⚡</span>
                  <div>
                    <span className="font-black uppercase text-black">Auto-Generated Logos:</span>{" "}
                    Logo untuk Hard Skills & Software Skills akan <span className="underline decoration-orange-500 font-black">otomatis dicari dan di-generate</span> langsung dari CDN database ikon resmi (SimpleIcons & Devicon) berdasarkan teks nama skill yang Anda ketik (contoh: Python, Docker, Tailwind, Blender, Figma, dll).
                  </div>
                </div>

                {/* Soft Skills */}
                <div className="border-2 border-black p-4 bg-orange-50/50 flex flex-col gap-2">
                  <label className="text-xs font-black uppercase tracking-wider flex items-center justify-between">
                    <span>💡 Soft Skills (Pisahkan dengan koma)</span>
                    <span className="text-[10px] text-zinc-500 font-bold">
                      {skillsSoft.split(",").filter((s) => s.trim()).length} Skills
                    </span>
                  </label>
                  <textarea
                    rows={3}
                    value={skillsSoft}
                    onChange={(e) => setSkillsSoft(e.target.value)}
                    placeholder="Analytical Thinking, Leadership, Empathy, Research, Adaptability, ..."
                    className="w-full border-2 border-black p-2.5 text-xs font-bold bg-white focus:outline-none focus:bg-yellow-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] resize-none"
                  />
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {skillsSoft
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean)
                      .map((s) => (
                        <span key={s} className="px-2 py-0.5 border border-black text-[10px] font-black bg-white">
                          {s}
                        </span>
                      ))}
                  </div>
                </div>

                {/* Hard Skills */}
                <div className="border-2 border-black p-4 bg-blue-50/50 flex flex-col gap-2">
                  <label className="text-xs font-black uppercase tracking-wider flex items-center justify-between">
                    <span>💻 Hard Skills (Pisahkan dengan koma & auto logo)</span>
                    <span className="text-[10px] text-zinc-500 font-bold">
                      {skillsHard.split(",").filter((s) => s.trim()).length} Skills
                    </span>
                  </label>
                  <textarea
                    rows={3}
                    value={skillsHard}
                    onChange={(e) => setSkillsHard(e.target.value)}
                    placeholder="HTML, CSS, JavaScript, TypeScript, React, Next.js, Python, Docker, Tailwind, ..."
                    className="w-full border-2 border-black p-2.5 text-xs font-bold bg-white focus:outline-none focus:bg-yellow-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] resize-none"
                  />
                  {/* Live Icon Preview */}
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500 block mb-1">
                      Live Preview Logo Otomatis:
                    </span>
                    <div className="flex flex-wrap gap-1.5 p-2 bg-white border border-black">
                      {skillsHard
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean)
                        .map((s) => (
                          <span
                            key={s}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 border-2 border-black text-[11px] font-black bg-zinc-50 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                          >
                            <TechIcon name={s} className="w-3.5 h-3.5 flex-shrink-0" />
                            <span>{s}</span>
                          </span>
                        ))}
                    </div>
                  </div>
                </div>

                {/* Software Skills */}
                <div className="border-2 border-black p-4 bg-amber-50/50 flex flex-col gap-2">
                  <label className="text-xs font-black uppercase tracking-wider flex items-center justify-between">
                    <span>🛠️ Software Skills (Pisahkan dengan koma & auto logo)</span>
                    <span className="text-[10px] text-zinc-500 font-bold">
                      {skillsSoftware.split(",").filter((s) => s.trim()).length} Skills
                    </span>
                  </label>
                  <textarea
                    rows={3}
                    value={skillsSoftware}
                    onChange={(e) => setSkillsSoftware(e.target.value)}
                    placeholder="VS Code, Postman, GitHub, Figma, Adobe XD, After Effects, Blender, Photoshop, ..."
                    className="w-full border-2 border-black p-2.5 text-xs font-bold bg-white focus:outline-none focus:bg-yellow-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] resize-none"
                  />
                  {/* Live Icon Preview */}
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500 block mb-1">
                      Live Preview Logo Otomatis:
                    </span>
                    <div className="flex flex-wrap gap-1.5 p-2 bg-white border border-black">
                      {skillsSoftware
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean)
                        .map((s) => (
                          <span
                            key={s}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 border-2 border-black text-[11px] font-black bg-zinc-50 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                          >
                            <TechIcon name={s} className="w-3.5 h-3.5 flex-shrink-0" />
                            <span>{s}</span>
                          </span>
                        ))}
                    </div>
                  </div>
                </div>

                {/* Footer Action Buttons */}
                <div className="flex items-center justify-end gap-3 mt-2 pt-4 border-t-2 border-black">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 bg-zinc-200 hover:bg-zinc-300 font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-black font-black text-xs uppercase tracking-wider border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5"
                  >
                    💾 Simpan Semua Skills
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>,
    document.body
  );
}
