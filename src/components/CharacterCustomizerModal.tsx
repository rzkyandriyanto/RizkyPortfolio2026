"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";

export interface CharacterConfig {
  gender: "male" | "female";
  hair: string;
  hairColor: string;
  skinColor: string;
  glasses: string;
  accessories: string;
  backgroundColor: string;
}

interface CharacterCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (avatarUrl: string, config: CharacterConfig) => void;
  initialName?: string;
  initialInstagram?: string;
}

// Preset archetypes for instant fun selection
const PRESET_CHARACTERS: {
  id: string;
  name: string;
  gender: "male" | "female";
  emoji: string;
  config: CharacterConfig;
}[] = [
  {
    id: "cyber-hacker",
    name: "Cyber Hacker",
    gender: "male",
    emoji: "💻",
    config: {
      gender: "male",
      hair: "short02",
      hairColor: "090909",
      skinColor: "e0a38b",
      glasses: "dark01",
      accessories: "none",
      backgroundColor: "06b6d4",
    },
  },
  {
    id: "gamer-girl",
    name: "Gamer Girl",
    gender: "female",
    emoji: "🎧",
    config: {
      gender: "female",
      hair: "long01",
      hairColor: "e11d48",
      skinColor: "e0a38b",
      glasses: "light01",
      accessories: "variant03",
      backgroundColor: "f43f5e",
    },
  },
  {
    id: "ronin-ninja",
    name: "Ronin Ninja",
    gender: "male",
    emoji: "🥷",
    config: {
      gender: "male",
      hair: "short01",
      hairColor: "090909",
      skinColor: "bd8060",
      glasses: "none",
      accessories: "none",
      backgroundColor: "18181b",
    },
  },
  {
    id: "cyber-vixen",
    name: "Neon Vixen",
    gender: "female",
    emoji: "⚡",
    config: {
      gender: "female",
      hair: "long02",
      hairColor: "3b82f6",
      skinColor: "e0a38b",
      glasses: "dark03",
      accessories: "variant01",
      backgroundColor: "8b5cf6",
    },
  },
  {
    id: "punk-rocker",
    name: "Punk Rocker",
    gender: "male",
    emoji: "🎸",
    config: {
      gender: "male",
      hair: "short05",
      hairColor: "e74c3c",
      skinColor: "e0a38b",
      glasses: "dark01",
      accessories: "variant02",
      backgroundColor: "f97316",
    },
  },
  {
    id: "pixel-witch",
    name: "Pixel Sorceress",
    gender: "female",
    emoji: "🔮",
    config: {
      gender: "female",
      hair: "long09",
      hairColor: "a855f7",
      skinColor: "e0a38b",
      glasses: "none",
      accessories: "variant03",
      backgroundColor: "6366f1",
    },
  },
  {
    id: "streetwear-boy",
    name: "Streetwear Boy",
    gender: "male",
    emoji: "🛹",
    config: {
      gender: "male",
      hair: "short03",
      hairColor: "f1c40f",
      skinColor: "bd8060",
      glasses: "light01",
      accessories: "none",
      backgroundColor: "10b981",
    },
  },
  {
    id: "anime-idol",
    name: "Anime Idol",
    gender: "female",
    emoji: "🌸",
    config: {
      gender: "female",
      hair: "long04",
      hairColor: "facc15",
      skinColor: "e0a38b",
      glasses: "none",
      accessories: "variant03",
      backgroundColor: "ec4899",
    },
  },
  {
    id: "bald-boss",
    name: "Hitman / Boss",
    gender: "male",
    emoji: "🕶️",
    config: {
      gender: "male",
      hair: "none",
      hairColor: "090909",
      skinColor: "e0a38b",
      glasses: "dark01",
      accessories: "none",
      backgroundColor: "18181b",
    },
  },
  {
    id: "lofi-girl",
    name: "Lofi Girl",
    gender: "female",
    emoji: "☕",
    config: {
      gender: "female",
      hair: "long05",
      hairColor: "6f4e37",
      skinColor: "bd8060",
      glasses: "light01",
      accessories: "none",
      backgroundColor: "eab308",
    },
  },
];

const MALE_HAIRS = [
  { id: "none", label: "✨ Botak Clean" },
  { id: "short01", label: "Classic Boy" },
  { id: "short02", label: "Spike Anime" },
  { id: "short03", label: "Side Part" },
  { id: "short04", label: "Messy Crop" },
  { id: "short05", label: "Punk Mohawk" },
];

const FEMALE_HAIRS = [
  { id: "none", label: "✨ Botak Clean" },
  { id: "long01", label: "Long Twin" },
  { id: "long02", label: "Bob Cut" },
  { id: "long03", label: "Straight Flow" },
  { id: "long04", label: "Side Ponytail" },
  { id: "long05", label: "Shoulder Bob" },
  { id: "long09", label: "Curly Wave" },
  { id: "long10", label: "Bangs Cut" },
];

const HAIR_COLORS = [
  { hex: "090909", name: "Jet Black" },
  { hex: "6f4e37", name: "Brunette" },
  { hex: "f1c40f", name: "Blonde" },
  { hex: "e74c3c", name: "Fire Red" },
  { hex: "3b82f6", name: "Cyber Blue" },
  { hex: "ec4899", name: "Neon Pink" },
  { hex: "a855f7", name: "Synth Purple" },
  { hex: "10b981", name: "Emerald" },
  { hex: "ffffff", name: "Silver" },
];

const SKIN_TONES = [
  { hex: "e0a38b", name: "Fair / Putih" },
  { hex: "bd8060", name: "Tan / Sawo" },
  { hex: "7d482e", name: "Dark / Cokelat" },
  { hex: "2dd4bf", name: "Cyber Teal" },
];

const GLASSES_OPTIONS = [
  { id: "none", label: "Tanpa Kacamata" },
  { id: "dark01", label: "Sunglasses 🕶️" },
  { id: "light01", label: "Kacamata Baca 👓" },
  { id: "dark03", label: "Cyber Visor 🥽" },
  { id: "dark05", label: "Retro Aviator 🕶️" },
];

const ACCESSORIES_OPTIONS = [
  { id: "none", label: "Tanpa Anting" },
  { id: "variant01", label: "Anting Kiri 💎" },
  { id: "variant02", label: "Anting Kanan 💎" },
  { id: "variant03", label: "Anting Sepasang ✨" },
];

const BG_COLORS = [
  { hex: "f97316", name: "Orange" },
  { hex: "e11d48", name: "Rose" },
  { hex: "8b5cf6", name: "Purple" },
  { hex: "06b6d4", name: "Cyan" },
  { hex: "10b981", name: "Green" },
  { hex: "eab308", name: "Yellow" },
  { hex: "18181b", name: "Dark" },
];

export function buildAvatarUrl(config: CharacterConfig): string {
  const params = new URLSearchParams();

  // Handle Hair & Hat (Set hatProbability=0 so no random hats/beanies cover bald or hair)
  params.set("hatProbability", "0");
  if (config.hair === "none") {
    params.set("hairProbability", "0");
  } else {
    params.set("hair", config.hair);
    params.set("hairProbability", "100");
  }

  // Handle Real Glasses / Sunglasses
  if (config.glasses === "none") {
    params.set("glassesProbability", "0");
  } else {
    params.set("glasses", config.glasses);
    params.set("glassesProbability", "100");
  }

  // Handle Earrings / Accessories
  if (config.accessories === "none") {
    params.set("accessoriesProbability", "0");
  } else {
    params.set("accessories", config.accessories);
    params.set("accessoriesProbability", "100");
  }

  params.set("skinColor", config.skinColor);
  params.set("hairColor", config.hairColor);
  params.set("backgroundColor", config.backgroundColor);

  return `https://api.dicebear.com/7.x/pixel-art/svg?${params.toString()}`;
}

export default function CharacterCustomizerModal({
  isOpen,
  onClose,
  onConfirm,
  initialName,
}: CharacterCustomizerModalProps) {
  const [tab, setTab] = useState<"presets" | "custom">("presets");
  const [selectedGender, setSelectedGender] = useState<"all" | "male" | "female">("all");

  // Character config state
  const [config, setConfig] = useState<CharacterConfig>({
    gender: "male",
    hair: "short02",
    hairColor: "090909",
    skinColor: "e0a38b",
    glasses: "dark01",
    accessories: "none",
    backgroundColor: "f97316",
  });

  const [mounted, setMounted] = useState(false);

  // Load saved preference from localStorage on mount
  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("guest_character_config");
      if (saved) {
        try {
          setConfig(JSON.parse(saved));
        } catch {
          // ignore
        }
      }
    }
  }, []);

  if (!isOpen || !mounted) return null;

  const currentAvatarUrl = buildAvatarUrl(config);

  const handleRandomize = () => {
    const isFemale = Math.random() > 0.5;
    const hairs = isFemale ? FEMALE_HAIRS : MALE_HAIRS;
    const randomHair = hairs[Math.floor(Math.random() * hairs.length)].id;
    const randomHairColor = HAIR_COLORS[Math.floor(Math.random() * HAIR_COLORS.length)].hex;
    const randomSkin = SKIN_TONES[Math.floor(Math.random() * SKIN_TONES.length)].hex;
    const randomGlasses = GLASSES_OPTIONS[Math.floor(Math.random() * GLASSES_OPTIONS.length)].id;
    const randomAcc = ACCESSORIES_OPTIONS[Math.floor(Math.random() * ACCESSORIES_OPTIONS.length)].id;
    const randomBg = BG_COLORS[Math.floor(Math.random() * BG_COLORS.length)].hex;

    setConfig({
      gender: isFemale ? "female" : "male",
      hair: randomHair,
      hairColor: randomHairColor,
      skinColor: randomSkin,
      glasses: randomGlasses,
      accessories: randomAcc,
      backgroundColor: randomBg,
    });
  };

  const handleApplyPreset = (preset: typeof PRESET_CHARACTERS[0]) => {
    setConfig(preset.config);
  };

  const handleConfirm = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("guest_character_config", JSON.stringify(config));
      localStorage.setItem("guest_custom_avatar", currentAvatarUrl);
    }
    onConfirm(currentAvatarUrl, config);
  };

  const filteredPresets = PRESET_CHARACTERS.filter((p) => {
    if (selectedGender === "all") return true;
    return p.gender === selectedGender;
  });

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-white border-3 md:border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col max-h-[92vh] overflow-hidden">
        {/* Modal Top Bar */}
        <div className="bg-black text-white px-4 py-3 flex items-center justify-between border-b-2 border-black select-none">
          <div className="flex items-center gap-2">
            <span className="text-base sm:text-lg animate-bounce">👾</span>
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm font-black tracking-widest uppercase text-amber-300">
                PIXEL AVATAR CREATOR
              </span>
              <span className="text-[10px] text-zinc-400 font-mono">
                PILIH / EDIT KARAKTER SPRITE UNTUK KOMENTARMU
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="w-7 h-7 bg-red-500 hover:bg-red-600 text-white font-black text-sm border-2 border-white flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
            title="Tutup"
          >
            ✕
          </button>
        </div>

        {/* Modal Main Body */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 flex flex-col gap-4 bg-zinc-50" style={{ scrollbarWidth: "thin" }}>
          
          {/* Top Live Preview Banner */}
          <div className="bg-zinc-950 border-2 border-black p-3 sm:p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col sm:flex-row items-center gap-4 text-white">
            {/* Sprite Avatar */}
            <div className="relative group flex-shrink-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 border-3 border-amber-300 rounded-lg overflow-hidden bg-black flex items-center justify-center shadow-[0_0_20px_rgba(251,191,36,0.3)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={currentAvatarUrl}
                  alt="Avatar Preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-amber-400 text-black font-black text-[9px] px-1.5 py-0.5 border border-black uppercase font-mono shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                LIVE
              </div>
            </div>

            {/* Info & Quick Randomize */}
            <div className="flex-1 flex flex-col gap-2 text-center sm:text-left">
              <div>
                <span className="text-[10px] font-black uppercase text-amber-400 font-mono tracking-wider">
                  VISITOR SPRITE:
                </span>
                <h4 className="text-base sm:text-lg font-black tracking-wide text-white">
                  {initialName || "Anonymous Adventurer"}
                </h4>
                <p className="text-[11px] text-zinc-400 leading-tight">
                  Karakter ini akan tampil di samping komentar dan profilmu di Guestbook!
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleRandomize}
                  className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-black text-xs font-black uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 flex items-center gap-1.5 cursor-pointer"
                >
                  <span>🎲</span>
                  <span>ACAK / RANDOM</span>
                </button>
              </div>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex border-2 border-black bg-zinc-200 p-1 gap-1">
            <button
              type="button"
              onClick={() => setTab("presets")}
              className={`flex-1 py-2 text-xs font-black uppercase tracking-wider transition-all border ${
                tab === "presets"
                  ? "bg-black text-amber-300 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  : "bg-white text-black border-zinc-300 hover:bg-zinc-100"
              }`}
            >
              🌟 PILIHAN PRESET (1-KLIK)
            </button>
            <button
              type="button"
              onClick={() => setTab("custom")}
              className={`flex-1 py-2 text-xs font-black uppercase tracking-wider transition-all border ${
                tab === "custom"
                  ? "bg-black text-amber-300 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  : "bg-white text-black border-zinc-300 hover:bg-zinc-100"
              }`}
            >
              🎨 CUSTOM STUDIO
            </button>
          </div>

          {/* TAB 1: PRESET ARCHETYPES */}
          {tab === "presets" && (
            <div className="flex flex-col gap-3">
              {/* Gender Filter Buttons */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black uppercase text-zinc-600">FILTER:</span>
                {[
                  { id: "all" as const, label: "Semua" },
                  { id: "male" as const, label: "👦 Male / Cowo" },
                  { id: "female" as const, label: "👧 Female / Cewe" },
                ].map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setSelectedGender(g.id)}
                    className={`px-2.5 py-1 text-[11px] font-black uppercase border-2 transition-all ${
                      selectedGender === g.id
                        ? "bg-orange-500 text-black border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                        : "bg-white text-zinc-700 border-zinc-300 hover:border-black"
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>

              {/* Presets Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {filteredPresets.map((preset) => {
                  const presetUrl = buildAvatarUrl(preset.config);
                  const isSelected =
                    config.hair === preset.config.hair &&
                    config.hairColor === preset.config.hairColor &&
                    config.glasses === preset.config.glasses &&
                    config.backgroundColor === preset.config.backgroundColor;

                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleApplyPreset(preset)}
                      className={`flex flex-col items-center gap-2 p-2.5 border-2 text-center transition-all cursor-pointer ${
                        isSelected
                          ? "bg-amber-100 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] scale-[1.02]"
                          : "bg-white border-zinc-300 hover:border-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                      }`}
                    >
                      <div className="w-14 h-14 border-2 border-black rounded overflow-hidden bg-black flex-shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={presetUrl} alt={preset.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-xs font-black text-black leading-tight line-clamp-1">
                          {preset.name}
                        </span>
                        <span className="text-[10px] font-mono text-zinc-500">{preset.emoji} {preset.gender}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: CUSTOM STUDIO */}
          {tab === "custom" && (
            <div className="flex flex-col gap-4 bg-white border-2 border-black p-3.5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              {/* Gender Switch */}
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-black uppercase text-zinc-700">Tipe Karakter:</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setConfig((prev) => ({
                        ...prev,
                        gender: "male",
                        hair: MALE_HAIRS[0].id,
                      }));
                    }}
                    className={`flex-1 py-1.5 border-2 text-xs font-black uppercase ${
                      config.gender === "male"
                        ? "bg-blue-500 text-white border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                        : "bg-zinc-100 text-zinc-700 border-zinc-300"
                    }`}
                  >
                    👦 Male / Pria
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setConfig((prev) => ({
                        ...prev,
                        gender: "female",
                        hair: FEMALE_HAIRS[0].id,
                      }));
                    }}
                    className={`flex-1 py-1.5 border-2 text-xs font-black uppercase ${
                      config.gender === "female"
                        ? "bg-pink-500 text-white border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                        : "bg-zinc-100 text-zinc-700 border-zinc-300"
                    }`}
                  >
                    👧 Female / Wanita
                  </button>
                </div>
              </div>

              {/* Hairstyle */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-black uppercase text-zinc-700">Gaya Rambut:</span>
                <div className="flex flex-wrap gap-1.5">
                  {(config.gender === "female" ? FEMALE_HAIRS : MALE_HAIRS).map((h) => (
                    <button
                      key={h.id}
                      type="button"
                      onClick={() => setConfig((prev) => ({ ...prev, hair: h.id }))}
                      className={`px-2.5 py-1 border text-[11px] font-black uppercase transition-all ${
                        config.hair === h.id
                          ? "bg-black text-amber-300 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                          : "bg-zinc-50 text-zinc-800 border-zinc-300 hover:border-black"
                      }`}
                    >
                      {h.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hair Color (hanya relevan jika tidak botak) */}
              {config.hair !== "none" && (
                <div className="flex flex-col gap-1.5">
                  <span className="text-[11px] font-black uppercase text-zinc-700">Warna Rambut:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {HAIR_COLORS.map((c) => (
                      <button
                        key={c.hex}
                        type="button"
                        onClick={() => setConfig((prev) => ({ ...prev, hairColor: c.hex }))}
                        className={`px-2.5 py-1 border text-[10px] font-black uppercase flex items-center gap-1.5 ${
                          config.hairColor === c.hex
                            ? "bg-black text-white border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                            : "bg-zinc-50 text-zinc-700 border-zinc-300 hover:border-black"
                        }`}
                      >
                        <span className="w-2.5 h-2.5 rounded-full border border-black" style={{ backgroundColor: `#${c.hex}` }} />
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Skin Tone */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-black uppercase text-zinc-700">Warna Kulit:</span>
                <div className="flex flex-wrap gap-2">
                  {SKIN_TONES.map((s) => (
                    <button
                      key={s.hex}
                      type="button"
                      onClick={() => setConfig((prev) => ({ ...prev, skinColor: s.hex }))}
                      className={`px-2.5 py-1 border text-[10px] font-black uppercase flex items-center gap-1.5 ${
                        config.skinColor === s.hex
                          ? "bg-black text-white border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                          : "bg-zinc-50 text-zinc-700 border-zinc-300 hover:border-black"
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full border border-black" style={{ backgroundColor: `#${s.hex}` }} />
                      {s.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Real Glasses & Sunglasses */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-black uppercase text-zinc-700">Kacamata & Shades:</span>
                <div className="flex flex-wrap gap-2">
                  {GLASSES_OPTIONS.map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setConfig((prev) => ({ ...prev, glasses: g.id }))}
                      className={`px-3 py-1 border text-[11px] font-black uppercase ${
                        config.glasses === g.id
                          ? "bg-black text-amber-300 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                          : "bg-zinc-50 text-zinc-700 border-zinc-300 hover:border-black"
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Earrings / Accessories */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-black uppercase text-zinc-700">Anting-Anting (Earrings):</span>
                <div className="flex flex-wrap gap-2">
                  {ACCESSORIES_OPTIONS.map((a) => (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => setConfig((prev) => ({ ...prev, accessories: a.id }))}
                      className={`px-3 py-1 border text-[11px] font-black uppercase ${
                        config.accessories === a.id
                          ? "bg-black text-amber-300 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                          : "bg-zinc-50 text-zinc-700 border-zinc-300 hover:border-black"
                      }`}
                    >
                      {a.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Background Canvas Color */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-black uppercase text-zinc-700">Warna Background:</span>
                <div className="flex flex-wrap gap-2 items-center">
                  {BG_COLORS.map((bg) => (
                    <button
                      key={bg.hex}
                      type="button"
                      onClick={() => setConfig((prev) => ({ ...prev, backgroundColor: bg.hex }))}
                      className={`w-7 h-7 rounded border-2 transition-transform hover:scale-110 flex items-center justify-center ${
                        config.backgroundColor === bg.hex
                          ? "border-black scale-110 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ring-2 ring-amber-400"
                          : "border-zinc-300"
                      }`}
                      style={{ backgroundColor: `#${bg.hex}` }}
                      title={bg.name}
                    >
                      {config.backgroundColor === bg.hex && <span className="text-[10px] text-white font-black">✓</span>}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer Actions */}
        <div className="bg-white p-3 sm:p-4 border-t-2 border-black flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 border-2 border-black bg-zinc-100 hover:bg-zinc-200 text-black text-xs font-black uppercase tracking-wider cursor-pointer"
          >
            BATAL
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            className="w-full sm:flex-1 px-6 py-3 border-2 border-black bg-orange-500 hover:bg-black hover:text-white text-black text-xs sm:text-sm font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>🚀</span>
            <span>KIRIM KOMENTAR DENGAN AVATAR INI</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
