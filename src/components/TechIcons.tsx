"use client";
import React, { useState } from "react";

export function TechIcon({ name, className = "w-4 h-4" }: { name: string; className?: string }) {
  const normalized = name.toLowerCase().replace(/[^a-z0-9]/g, "");

  switch (normalized) {
    // === Web & Frontend ===
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
    case "reactjs":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#61DAFB" strokeWidth="1.5" />
          <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#61DAFB" strokeWidth="1.5" transform="rotate(60 12 12)" />
          <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#61DAFB" strokeWidth="1.5" transform="rotate(120 12 12)" />
          <circle cx="12" cy="12" r="1.8" fill="#61DAFB" />
        </svg>
      );

    case "nextjs":
    case "next":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path fill="#000000" d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.64 17.58L10.3 8.35v8.03H8.76V6.52h1.53l7.98 10.37c-.2.24-.41.47-.63.69zm-1.89-6.33l1.55 2.01V6.52h-1.55v4.73z" />
        </svg>
      );

    case "vue":
    case "vuejs":
      return (
        <svg className={className} viewBox="0 0 24 24">
          <path fill="#41B883" d="M1.5 3.5l10.5 18 10.5-18h-4.2L12 13.5 5.7 3.5H1.5z" />
          <path fill="#35495E" d="M6.3 3.5L12 13.5l5.7-10H14L12 7 10 3.5H6.3z" />
        </svg>
      );

    case "tailwind":
    case "tailwindcss":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="#06B6D4">
          <path d="M12 6c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5 1.05.26 1.8 1.02 2.63 1.87C14.47 11.75 16.03 13.33 20 13.33c2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-1.05-.26-1.8-1.02-2.63-1.87C17.53 7.58 15.97 6 12 6zM4 13.33c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5 1.05.26 1.8 1.02 2.63 1.87 1.34 1.38 2.9 2.96 6.87 2.96 2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-1.05-.26-1.8-1.02-2.63-1.87C10.53 14.91 8.97 13.33 4 13.33z" />
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

    case "python":
    case "py":
      return (
        <svg className={className} viewBox="0 0 24 24">
          <path fill="#3776AB" d="M11.9 2C6.9 2 7.2 4.2 7.2 4.2l.01 2.3h4.8v.7H5.2S2 6.8 2 11.9c0 5 2.8 4.8 2.8 4.8h1.7v-2.4s-.1-2.8 2.8-2.8h4.7s2.7.1 2.7-2.6V4.7S17 2 11.9 2zm-2.4 1.5a.8.8 0 110 1.6.8.8 0 010-1.6z" />
          <path fill="#FFD43B" d="M12.1 22c5 0 4.7-2.2 4.7-2.2l-.01-2.3h-4.8v-.7h6.8s3.2.4 3.2-4.7c0-5-2.8-4.8-2.8-4.8h-1.7v2.4s.1 2.8-2.8 2.8h-4.7s-2.7-.1-2.7 2.6v4.2s-.3 2.7 4.8 2.7zm2.4-1.5a.8.8 0 110-1.6.8.8 0 010 1.6z" />
        </svg>
      );

    case "docker":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="#2496ED">
          <path d="M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.186.185.186m-2.93 0h2.12a.186.186 0 00.184-.186V6.29a.185.185 0 00-.185-.185H8.1a.185.185 0 00-.185.185v1.887c0 .102.083.186.185.186m-2.964 0h2.119a.186.186 0 00.185-.186V6.29a.185.185 0 00-.185-.185H5.136a.186.186 0 00-.186.185v1.887c0 .102.084.186.186.186m5.893 2.715h2.118a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.185-.186H5.136a.186.186 0 00-.186.185v1.888c0 .102.084.185.186.185m-2.928 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.185-.186H2.208a.186.186 0 00-.186.185v1.888c0 .102.084.185.186.185m21.724-.327a5.03 5.03 0 00-.978-.718c-.808-.475-1.785-.563-2.684-.253-.342.118-.654.298-.934.526a.222.222 0 00-.095.143 8.358 8.358 0 00-.317 2.164c0 .356.035.707.098 1.05-.623.364-1.317.585-2.046.643H2.072a.673.673 0 00-.672.673c0 .373.3.674.672.674h14.733c2.478 0 4.674-1.397 5.753-3.473a4.238 4.238 0 001.372-.429z" />
        </svg>
      );

    case "php":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="#777BB4">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-4.5 13.5H6l1.2-6h2.2c1.4 0 2.1.7 1.8 2.1-.3 1.3-1.3 3.9-3.7 3.9zm6.5 0h-1.5l1.2-6h2.2c1.4 0 2.1.7 1.8 2.1-.3 1.3-1.3 3.9-3.7 3.9zm4.2-3.8h-1.3l.4-2.2h1.3c.6 0 1 .3.9.9-.2.8-.7 1.3-1.3 1.3z" />
        </svg>
      );

    case "laravel":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="#FF2D20">
          <path d="M8.2 2L2 5.6v12.8L8.2 22l6.2-3.6V5.6L8.2 2zm6.9 4l5.9 3.4v6.8l-5.9 3.4V6z" />
        </svg>
      );

    case "flutter":
      return (
        <svg className={className} viewBox="0 0 24 24">
          <path fill="#02569B" d="M14.3 2L4 12.3l3.2 3.2L20.7 2h-6.4z" />
          <path fill="#0175C2" d="M14.3 13.7L8.9 19.1l3.2 3.2 8.6-8.6h-6.4z" />
          <path fill="#29B6F6" d="M14.3 13.7l-3.2 3.2 3.2 3.2 3.2-3.2-3.2-3.2z" />
        </svg>
      );

    case "blender":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="#E87D0D">
          <path d="M12 2a4 4 0 00-4 4c0 .3.04.58.1.86L3.6 9.4A2 2 0 003 10.8a2 2 0 003.4 1.4l3.7-2.1c.6.5 1.3.9 2.1 1.1v4.4a2 2 0 004 0v-4.4c1.7-.4 3-1.9 3-3.8 0-2.2-1.8-4-4-4a4 4 0 00-3.2 1.6V6a4 4 0 00-4-4zm0 6a2 2 0 110 4 2 2 0 010-4z" />
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

    case "mongodb":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="#47A248">
          <path d="M12 1.5s-6 6.7-6 11.5c0 4.5 3.5 7.5 6 9.5 2.5-2 6-5 6-9.5 0-4.8-6-11.5-6-11.5zm.3 18.2v-7.3c0-.2-.1-.3-.3-.3s-.3.1-.3.3v7.3c-1.8-1.5-4.2-3.8-4.2-6.7 0-3.3 3.6-7.8 4.5-8.8.9 1 4.5 5.5 4.5 8.8 0 2.9-2.4 5.2-4.2 6.7z" />
        </svg>
      );

    case "postgresql":
    case "postgres":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="#4169E1">
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm4.8 14.5c-.5.4-1.2.6-2 .7v-1.5c.5-.1.9-.2 1.2-.4.4-.3.6-.7.6-1.2 0-.6-.3-1-1-1.3l-1.3-.5c-1.2-.5-1.8-1.3-1.8-2.4 0-1.1.7-2 2-2.3V6.2h1.6v1.4c.7.1 1.3.4 1.7.8l-.8 1.2c-.4-.3-.8-.5-1.3-.6-.5 0-.9.2-.9.6 0 .4.3.7.9.9l1.2.5c1.4.5 2.1 1.4 2.1 2.6 0 1.2-.8 2.2-2.2 2.7v1.4h-1.6v-1.4z" />
        </svg>
      );

    case "supabase":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="#3ECF8E">
          <path d="M21.362 9.354H12V.396a.396.396 0 0 0-.716-.233L2.21 12.646a.792.792 0 0 0 .616 1.308H12v8.958a.396.396 0 0 0 .716.233l9.074-12.483a.792.792 0 0 0-.616-1.308z" />
        </svg>
      );

    case "firebase":
      return (
        <svg className={className} viewBox="0 0 24 24">
          <path fill="#FFCA28" d="M4.6 18.5L9.3 3.3c.1-.4.7-.5.9-.1l2.6 5-8.2 10.3z" />
          <path fill="#FFA000" d="M14.9 8.2L12.8 4.2c-.2-.4-.8-.4-1 0L4.6 18.5l10.3-10.3z" />
          <path fill="#F57C00" d="M19.4 18.5L16.2 8.4c-.1-.4-.7-.5-.9-.1l-10.7 10.2 14.8 0z" />
        </svg>
      );

    // === Design & Software ===
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

    case "photoshop":
    case "adobephotoshop":
    case "ps":
      return (
        <svg className={className} viewBox="0 0 24 24">
          <rect width="24" height="24" rx="4" fill="#001E36" />
          <path fill="#31A8FF" d="M6 6h4.5c2 0 3.5 1 3.5 3s-1.5 3-3.5 3H8v4H6V6zm2 4.2h2.2c.9 0 1.5-.4 1.5-1.2s-.6-1.2-1.5-1.2H8v2.4zm8.5 2.8c-.8 0-1.5.4-1.5 1.2 0 1.5 3.5 1 3.5 3.3 0 1.4-1.2 2.5-3 2.5-1.8 0-2.8-1-2.8-2h1.8c0 .5.4.8 1 .8.6 0 1-.3 1-.8 0-1.5-3.5-1.1-3.5-3.3 0-1.5 1.2-2.5 3-2.5 1.5 0 2.5.8 2.7 1.8h-1.8c-.1-.5-.5-.8-.4-.8z" />
        </svg>
      );

    case "illustrator":
    case "adobeillustrator":
    case "ai":
      return (
        <svg className={className} viewBox="0 0 24 24">
          <rect width="24" height="24" rx="4" fill="#330000" />
          <path fill="#FF9A00" d="M6.5 16l2.8-8h1.8l2.8 8h-1.7l-.6-2H8.3l-.6 2H6.5zm2.3-3.5h2.3L10 9.2l-1.2 3.3zm6.7-4.5h1.8v8h-1.8V8zm0-2.5h1.8v1.8h-1.8V5.5z" />
        </svg>
      );

    case "aftereffects":
    case "adobeaftereffects":
    case "ae":
      return (
        <svg className={className} viewBox="0 0 24 24">
          <rect width="24" height="24" rx="4" fill="#00005B" />
          <path fill="#9999FF" d="M5.5 16l2.6-8h1.8l2.6 8h-1.6l-.6-2H7.7l-.6 2H5.5zm2.6-3.5h2.1L9.1 9.2l-1 3.3zm7.4 3.5c-2 0-3.3-1.4-3.3-3.5s1.4-3.5 3.3-3.5 3.2 1.4 3.2 3.5v.7h-4.8c.1 1.2.9 1.8 1.8 1.8.8 0 1.4-.4 1.6-.9h1.6c-.4 1.2-1.6 1.9-3.4 1.9zm-.1-5.6c-.8 0-1.4.6-1.5 1.5h3c-.1-.9-.7-1.5-1.5-1.5z" />
        </svg>
      );

    case "premiere":
    case "premierepro":
    case "adobepremiere":
    case "adobepremierepro":
    case "pr":
      return (
        <svg className={className} viewBox="0 0 24 24">
          <rect width="24" height="24" rx="4" fill="#00005B" />
          <path fill="#EA77FF" d="M6 6h4.5c2 0 3.5 1 3.5 3s-1.5 3-3.5 3H8v4H6V6zm2 4.2h2.2c.9 0 1.5-.4 1.5-1.2s-.6-1.2-1.5-1.2H8v2.4zm7.5 5.8v-5.6h1.6v1.2c.4-.9 1.1-1.3 2-1.3v1.8c-.2 0-.4 0-.6 0-1 0-1.4.7-1.4 1.8V16h-1.6z" />
        </svg>
      );

    case "adobexd":
    case "xd":
      return (
        <svg className={className} viewBox="0 0 24 24">
          <rect width="24" height="24" rx="4" fill="#470137" />
          <text x="5" y="16" fill="#FF61F6" fontSize="11" fontWeight="bold" fontFamily="sans-serif">Xd</text>
        </svg>
      );

    case "vscode":
    case "visualstudiocode":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="#007ACC">
          <path d="M18.5 2.5L13 7.8 8.8 4.2 2 8.5v7l6.8 4.3 4.2-3.6 5.5 5.3 3.5-1.7V4.2L18.5 2.5zM13 14.2l-3.5-2.7L13 8.8v5.4z" />
        </svg>
      );

    case "github":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
        </svg>
      );

    case "git":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="#F05032">
          <path d="M21.6 10.9L13.1 2.4a2 2 0 00-2.8 0L8.5 4.2l3.4 3.4a2.4 2.4 0 013 3l3.3 3.3a2.3 2.3 0 11-1.4 1.4l-3-3a2.4 2.4 0 01-3-3L7.4 6 2.4 11a2 2 0 000 2.8l8.5 8.5a2 2 0 002.8 0l7.9-7.9a2 2 0 000-2.8z" />
        </svg>
      );

    case "postman":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="#FF6C37">
          <path d="M13.5 2C7.7 2 3 6.7 3 12.5S7.7 23 13.5 23 24 18.3 24 12.5 19.3 2 13.5 2zm3.8 8.8l-1.9 4.8c-.1.3-.4.4-.7.4-.1 0-.3 0-.4-.1l-2.4-1.2-1.3 1.7c-.2.3-.6.4-.9.2-.3-.2-.4-.6-.2-.9l1.7-2.3-2.6-1.3c-.3-.2-.5-.5-.4-.9.1-.3.4-.6.8-.6l5.2-.2c.4 0 .7.3.7.7z" />
        </svg>
      );

    case "framer":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="#0055FF">
          <path d="M4 2h16v7h-8l8 7H4v-7h8L4 2z" />
        </svg>
      );

    case "affinitydesigner":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="#1B71B5">
          <path d="M12 2L2 19.5h20L12 2zm0 4.8l6.5 11.2H5.5L12 6.8z" />
        </svg>
      );

    case "tableau":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="#E97627">
          <path d="M11 2h2v4h-2zm-6 5h2v4H5zm12 0h2v4h-2zm-6 4h2v6h-2zm-6 4h2v4H5zm12 0h2v4h-2zm-6 5h2v4h-2z" />
        </svg>
      );

    case "canva":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="#00C4CC">
          <circle cx="12" cy="12" r="10" />
          <path fill="#FFFFFF" d="M12 6a6 6 0 100 12 6 6 0 000-12zm-1 9.5c-1.8 0-3-1.4-3-3.5s1.2-3.5 3-3.5c1.2 0 2.2.6 2.6 1.6l-1.4.8c-.3-.6-.7-.9-1.2-.9-1 0-1.6.8-1.6 2s.6 2 1.6 2c.5 0 .9-.3 1.2-.9l1.4.8c-.4 1-1.4 1.6-2.6 1.6z" />
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

    // Default Fallback: Auto-fetch from SkillIcons CDN & Iconify
    default: {
      return <AutoTechIcon slug={normalized} name={name} className={className} />;
    }
  }
}

function AutoTechIcon({ slug, name, className }: { slug: string; name: string; className: string }) {
  const [cdnIndex, setCdnIndex] = useState(0);

  // Normalization alias dictionary for SkillIcons & Devicon
  const aliasMap: Record<string, string> = {
    golang: "go",
    vue: "vue",
    vuejs: "vue",
    next: "nextjs",
    nextjs: "nextjs",
    node: "nodejs",
    nodejs: "nodejs",
    express: "express",
    tailwind: "tailwind",
    tailwindcss: "tailwind",
    csharp: "cs",
    cpp: "cpp",
    cplusplus: "cpp",
    adobexd: "xd",
    aftereffects: "ae",
    adobeaftereffects: "ae",
    illustrator: "ai",
    adobeillustrator: "ai",
    photoshop: "ps",
    adobephotoshop: "ps",
    premiere: "pr",
    premierepro: "pr",
    adobepremiere: "pr",
    adobepremierepro: "pr",
    affinitydesigner: "affinitydesigner",
    vscode: "vscode",
    postman: "postman",
    github: "github",
    git: "git",
    blender: "blender",
    figma: "figma",
    flutter: "flutter",
    dart: "dart",
    kotlin: "kotlin",
    swift: "swift",
    python: "python",
    docker: "docker",
    supabase: "supabase",
    firebase: "firebase",
    mongodb: "mongodb",
    postgres: "postgres",
    postgresql: "postgres",
    mysql: "mysql",
    redis: "redis",
    svelte: "svelte",
    laravel: "laravel",
    php: "php",
    linux: "linux",
    ubuntu: "ubuntu",
  };

  const finalSlug = aliasMap[slug] || slug;

  // List of high-reliability CDN endpoints for branded SVGs
  const cdnList = [
    `https://skillicons.dev/icons?i=${finalSlug}`,
    `https://api.iconify.design/logos:${finalSlug}.svg`,
    `https://cdn.simpleicons.org/${finalSlug}`,
  ];

  if (cdnIndex >= cdnList.length) {
    return (
      <span className="inline-flex items-center justify-center w-3.5 h-3.5 bg-black text-white text-[9px] font-black rounded-xs select-none flex-shrink-0">
        {name.slice(0, 1).toUpperCase()}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={cdnList[cdnIndex]}
      alt={name}
      className={`${className} object-contain flex-shrink-0`}
      onError={() => setCdnIndex((prev) => prev + 1)}
      loading="lazy"
    />
  );
}
