import React from "react";

export function TechIcon({ name, className = "w-4 h-4" }: { name: string; className?: string }) {
  const normalized = name.toLowerCase().replace(/[^a-z0-9]/g, "");

  switch (normalized) {
    // === Hard Skills ===
    case "html":
    case "html5":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path fill="#E34F26" d="M1.5 0h21l-1.9 21.2L12 24l-8.6-2.8L1.5 0z" />
          <path fill="#EF652A" d="M12 22.1l7-2.3 1.6-17.8H12v20.1z" />
          <path fill="#EBEBEB" d="M12 5.2H6.9l.4 4.5h4.7V5.2zm0 6.6H7.5l.4 4.5 4.1 1.1V15l-2.4-.6-.2-1.9H12v-.7z" />
          <path fill="#FFFFFF" d="M12 5.2v4.5h4.7l-.4 4.5-4.3 1.2v2.4l7-2.3 1-10.3H12zm0 6.6v.7h2.2l-.2 1.9-2 1.3v-.6z" />
        </svg>
      );

    case "css":
    case "css3":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path fill="#1572B6" d="M1.5 0h21l-1.9 21.2L12 24l-8.6-2.8L1.5 0z" />
          <path fill="#33A9DC" d="M12 22.1l7-2.3 1.6-17.8H12v20.1z" />
          <path fill="#EBEBEB" d="M12 5.2H6.9l.4 4.5h4.7V5.2zm0 6.6H7.5l.4 4.5 4.1 1.1V15l-2.4-.6-.2-1.9H12v-.7z" />
          <path fill="#FFFFFF" d="M12 5.2v4.5h4.7l-.4 4.5-4.3 1.2v2.4l7-2.3 1-10.3H12zm0 6.6v.7h2.2l-.2 1.9-2 1.3v-.6z" />
        </svg>
      );

    case "javascript":
    case "js":
      return (
        <svg className={className} viewBox="0 0 24 24">
          <rect width="24" height="24" rx="3" fill="#F7DF1E" />
          <path fill="#000000" d="M6.2 18.8l1.8-1.1c.4.7.7 1.2 1.4 1.2.7 0 1.1-.3 1.1-1.3v-6.9h2.3v6.9c0 2.2-1.3 3.2-3.2 3.2-1.7 0-2.8-.9-3.4-2zm8.4-.2l1.8-1c.5.8 1.1 1.4 2.2 1.4.9 0 1.5-.4 1.5-1 0-.7-.6-1-1.7-1.5l-.6-.3c-1.7-.7-2.8-1.6-2.8-3.5 0-1.7 1.3-3.1 3.4-3.1 1.5 0 2.6.5 3.3 1.8l-1.7 1.1c-.4-.7-.8-1-1.6-1-.8 0-1.2.3-1.2.8 0 .6.4.8 1.4 1.3l.6.3c2 .9 3.1 1.8 3.1 3.7 0 2.1-1.6 3.3-3.8 3.3-2.1 0-3.4-1-4-2.3z" />
        </svg>
      );

    case "typescript":
    case "ts":
      return (
        <svg className={className} viewBox="0 0 24 24">
          <rect width="24" height="24" rx="3" fill="#3178C6" />
          <path fill="#FFFFFF" d="M5.5 8.5h7.2v2.1H10v7.6H7.6v-7.6H5.5V8.5zm9 5.3c.5.8 1.2 1.3 2.1 1.3.8 0 1.3-.4 1.3-.9 0-.6-.5-.9-1.5-1.3l-.6-.2c-1.6-.6-2.6-1.4-2.6-3 0-1.6 1.3-2.8 3.2-2.8 1.4 0 2.4.5 3.1 1.6l-1.6 1c-.4-.6-.8-.8-1.5-.8-.7 0-1.1.3-1.1.7 0 .5.4.7 1.3 1.1l.6.2c1.8.7 2.8 1.6 2.8 3.2 0 1.9-1.5 3-3.5 3-1.9 0-3.2-.9-3.7-2.1l1.7-1z" />
        </svg>
      );

    case "react":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#61DAFB" strokeWidth="1.5" />
          <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#61DAFB" strokeWidth="1.5" transform="rotate(60 12 12)" />
          <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#61DAFB" strokeWidth="1.5" transform="rotate(120 12 12)" />
          <circle cx="12" cy="12" r="1.8" fill="#61DAFB" />
        </svg>
      );

    case "nextjs":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path fill="#000000" d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.64 17.58L10.3 8.35v8.03H8.76V6.52h1.53l7.98 10.37c-.2.24-.41.47-.63.69zm-1.89-6.33l1.55 2.01V6.52h-1.55v4.73z" />
        </svg>
      );

    case "vuejs":
    case "vue":
      return (
        <svg className={className} viewBox="0 0 24 24">
          <path fill="#41B883" d="M1.5 3.5l10.5 18 10.5-18h-4.2L12 13.5 5.7 3.5H1.5z" />
          <path fill="#35495E" d="M6.3 3.5L12 13.5l5.7-10H14L12 7 10 3.5H6.3z" />
        </svg>
      );

    case "nodejs":
    case "node":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="#339933">
          <path d="M12 2l10 5.8v11.5L12 25 2 19.3V7.8L12 2zm0 2.3L4.2 8.8v8.6L12 21.9l7.8-4.5V8.8L12 4.3z" />
          <circle cx="12" cy="13" r="3.5" fill="#339933" />
        </svg>
      );

    case "angular":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="#DD0031">
          <path d="M12 1.5L2.2 5l1.5 13.2L12 23l8.3-4.8 1.5-13.2L12 1.5zm0 2.8l6.3 14.1h-2.3l-1.3-3.2H9.3l-1.3 3.2H5.7L12 4.3zm1.9 8.9L12 7.7l-1.9 5.5h3.8z" />
        </svg>
      );

    case "mysql":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="#4479A1">
          <path d="M12 3C7 3 3 6.5 3 11c0 3 1.8 5.7 4.7 7.2l-.7 2.8 3.5-1.5c.5.1 1 .2 1.5.2 5 0 9-3.5 9-8s-4-8.7-9-8.7zm0 14.5c-4 0-7.3-2.8-7.3-6.2S8 5.1 12 5.1s7.3 2.8 7.3 6.2-3.3 6.2-7.3 6.2z" />
        </svg>
      );

    case "sqlite":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="#003B57">
          <path d="M12 2C6.5 2 2 4.2 2 7v10c0 2.8 4.5 5 10 5s10-2.2 10-5V7c0-2.8-4.5-5-10-5zm0 2c4.4 0 8 1.3 8 3s-3.6 3-8 3-8-1.3-8-3 3.6-3 8-3zm8 7.5c0 1.7-3.6 3-8 3s-8-1.3-8-3V9.2c1.9 1.4 4.8 2.3 8 2.3s6.1-.9 8-2.3v2.3zm0 5c0 1.7-3.6 3-8 3s-8-1.3-8-3v-2.3c1.9 1.4 4.8 2.3 8 2.3s6.1-.9 8-2.3v2.3z" />
        </svg>
      );

    case "uiuxdesign":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M3 9h18" />
          <path d="M9 21V9" />
        </svg>
      );

    case "mobileanalytics":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="2" width="14" height="20" rx="2" />
          <path d="M12 18h.01" />
          <path d="M8 10l2 2 2-3 4 4" />
        </svg>
      );

    case "websiteanalytics":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 3v18h18" />
          <path d="M7 14l4-4 4 4 6-6" />
        </svg>
      );

    // === Software Skills ===
    case "vscode":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="#007ACC">
          <path d="M17.5 1.5l4.5 2.2v16.6l-4.5 2.2L7 14.8l-4.8 3.7L0 17V7l2.2-1.5L7 9.2l10.5-7.7zm-1.8 6.2L8.2 12l7.5 4.3V7.7z" />
        </svg>
      );

    case "postman":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="#FF6C37">
          <circle cx="12" cy="12" r="10" />
          <path fill="#FFFFFF" d="M16.5 12c0 2.5-2 4.5-4.5 4.5s-4.5-2-4.5-4.5 2-4.5 4.5-4.5 4.5 2 4.5 4.5zm-5.5-2v4l3.5-2-3.5-2z" />
        </svg>
      );

    case "github":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="#181717">
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
        </svg>
      );

    case "git":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="#F05032">
          <path d="M21.6 10.9L13.1 2.4a2 2 0 00-2.8 0L8.5 4.2l3.4 3.4a2.4 2.4 0 013 3l3.3 3.3a2.3 2.3 0 11-1.4 1.4l-3-3a2.4 2.4 0 01-3-3L7.4 6 2.4 11a2 2 0 000 2.8l8.5 8.5a2 2 0 002.8 0l7.9-7.9a2 2 0 000-2.8l-.01-.01-.01-.01-.01-.01-.01-.01-.01-.01-.01-.01-.01-.01-.01-.01-.01-.01-.01-.01-.01-.01-.01-.01-.01-.01z" />
        </svg>
      );

    case "figma":
      return (
        <svg className={className} viewBox="0 0 24 24">
          <path fill="#F24E1E" d="M8 2a3 3 0 00-3 3 3 3 0 003 3h3V2H8z" />
          <path fill="#FF7262" d="M13 2h3a3 3 0 013 3 3 3 0 01-3 3h-3V2z" />
          <path fill="#A259FF" d="M8 8a3 3 0 00-3 3 3 3 0 003 3h3V8H8z" />
          <path fill="#1ABCFE" d="M13 8h3a3 3 0 013 3 3 3 0 01-3 3 3 3 0 01-3 3 3 3 0 01-3-3V8z" />
          <path fill="#0ACF83" d="M8 14a3 3 0 00-3 3 3 3 0 003 3 3 3 0 003-3v-3H8z" />
        </svg>
      );

    case "adobexd":
      return (
        <svg className={className} viewBox="0 0 24 24">
          <rect width="24" height="24" rx="4" fill="#470137" />
          <text x="5" y="16" fill="#FF61F6" fontSize="11" fontWeight="bold" fontFamily="sans-serif">Xd</text>
        </svg>
      );

    case "aftereffects":
      return (
        <svg className={className} viewBox="0 0 24 24">
          <rect width="24" height="24" rx="4" fill="#00005B" />
          <text x="5" y="16" fill="#9999FF" fontSize="11" fontWeight="bold" fontFamily="sans-serif">Ae</text>
        </svg>
      );

    case "affinitydesigner":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="#1B71B5">
          <path d="M12 2L2 19.5h20L12 2zm0 4.8l6.5 11.2H5.5L12 6.8z" />
        </svg>
      );

    case "framer":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="#0055FF">
          <path d="M4 2h16v7h-8l8 7H4v-7h8L4 2z" />
        </svg>
      );

    case "tableau":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="#E97627">
          <path d="M11 2h2v4h-2zm-6 5h2v4H5zm12 0h2v4h-2zm-6 4h2v6h-2zm-6 4h2v4H5zm12 0h2v4h-2zm-6 5h2v4h-2z" />
        </svg>
      );

    case "digitalillustration":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#EC4899" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8a2 2 0 100-4 2 2 0 000 4z" fill="#EC4899" />
          <path d="M16 11a2 2 0 100-4 2 2 0 000 4z" fill="#EC4899" />
          <path d="M8 12a2 2 0 100-4 2 2 0 000 4z" fill="#EC4899" />
        </svg>
      );

    case "colorgrading":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 3a9 9 0 000 18V3z" fill="#F59E0B" />
        </svg>
      );

    // Default Fallback
    default:
      return (
        <span className="text-[11px] select-none">⚡</span>
      );
  }
}
