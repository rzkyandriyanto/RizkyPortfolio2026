"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import gsap from "gsap";
import EncryptedText from "./ui/EncryptedText";

type PreloaderRole = "HRD" | "FRIEND" | "BROTHER" | "GUEST" | "GIRLFRIEND" | "OWNER";
type PreloaderStage = "input" | "logs" | "welcome";

const PixelHeart = ({ className = "w-4 h-4 inline-block align-middle" }) => (
  <svg viewBox="0 0 8 8" className={className} fill="currentColor">
    <path d="M1,1h2v1h-2z M5,1h2v1h-2z M0,2h8v2h-8z M1,4h6v1h-6z M2,5h4v1h-4z M3,6h2v1h-2z" />
  </svg>
);

export default function Preloader() {
  const [loading, setLoading] = useState(true);
  const [stage, setStage] = useState<PreloaderStage>("input");
  const [name, setName] = useState("");
  const [instagram, setInstagram] = useState("");
  const [role, setRole] = useState<PreloaderRole | null>(null); // null = belum pilih
  const [currentLogIndex, setCurrentLogIndex] = useState(0);
  const [isHoveredGF, setIsHoveredGF] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  
  const loaderRef = useRef<HTMLDivElement>(null);
  const logContainerRef = useRef<HTMLDivElement>(null);

  const isGF = role === "GIRLFRIEND";
  const isOwner = role === "OWNER" || name.trim().toLowerCase() === "rizky" || name.trim().toLowerCase() === "owner" || name.trim().toLowerCase() === "admin" || name.trim() === "2026";
  const isPink = isGF || isHoveredGF;

  // Animasi shake saat error
  const triggerShake = useCallback(() => {
    if (!formRef.current) return;
    setHasError(true);
    gsap.fromTo(
      formRef.current,
      { x: 0 },
      {
        x: 16,
        duration: 0.07,
        ease: "power1.inOut",
        repeat: 7,
        yoyo: true,
        onComplete: () => {
          gsap.set(formRef.current, { x: 0 });
          setTimeout(() => setHasError(false), 2000);
        },
      }
    );
  }, []);

  const logMessages = [
    "LOG: Initializing connection sequence...",
    "SECURE_LINK: Connecting to Rizky-Mainframe-2026...",
    "DB_PING: Remote host responded in 14ms (RTT)...",
    "AUTH: Scrambling cryptographic handshake ciphers...",
    "VERIFY: User credential signature authenticated successfully.",
    "PARSING: Extracting experience files and project databases...",
    "COMPILING: Compiling Tailwind V4 stylesheet dependencies...",
    isGF ? "HEARTBEAT: Core temperature rising rapidly..." : isOwner ? "SECURITY: Bypassing firewalls with root cryptographic keys..." : "GSAP: Initializing rubber-band physics drag parameters...",
    isOwner ? `STATUS: ROOT ADMIN PRIVILEGES UNLOCKED [OWNER MODE ACTIVE] ⚡ - Welcome back, Master ${name || "Rizky"}!` : isGF ? `STATUS: Access GRANTED for my favorite person [${role}] 🤍 - User: ${name}` : `STATUS: Access GRANTED for category [${role ?? "GUEST"}] - User: ${name || "Anonymous"}`,
    isOwner ? "BOOT: Granting full database edit/delete access and starting RizkyPortfolio2026.exe..." : isGF ? "BOOT: Sending virtual hugs and starting RizkyPortfolio2026.exe..." : "BOOT: Booting RizkyPortfolio2026.exe..."
  ];

  const handleStartLoading = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) return;

    const isOwnerAuth = 
      trimmedName.toLowerCase() === "guk" ||
      trimmedName.toLowerCase() === "rizky" || 
      trimmedName.toLowerCase() === "rizky andriyanto" || 
      role === "OWNER";

    const finalRole: PreloaderRole = isOwnerAuth ? "OWNER" : (role as PreloaderRole);

    // Validasi: harus pilih kategori jika bukan owner
    if (!finalRole) {
      setErrorMsg("// ERROR: CONNECTION CATEGORY NOT SELECTED. CHOOSE YOUR ACCESS LEVEL.");
      triggerShake();
      return;
    }

    setErrorMsg("");
    setHasError(false);
    const cleanIg = instagram.replace(/^@/, "").trim();
    const finalName = isOwnerAuth && trimmedName.toLowerCase() === "guk" ? "Rizky (Owner)" : trimmedName;
    const finalIg = isOwnerAuth ? "rzkyandriyanto" : cleanIg;

    localStorage.setItem("guest_name", finalName);
    localStorage.setItem("guest_instagram", finalIg);
    localStorage.setItem("guest_role", finalRole);
    setRole(finalRole);
    setCurrentLogIndex(0);
    setStage("logs");

    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("guest_auth_updated", {
        detail: { name: finalName, instagram: finalIg, role: finalRole }
      }));
    }
  };

  const triggerExitAnimation = () => {
    if (!loaderRef.current) {
      setLoading(false);
      window.dispatchEvent(new Event("loaderFinished"));
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        setLoading(false);
        window.dispatchEvent(new Event("loaderFinished"));
      },
    });

    // === TAHAP 1: INTENSE CRT SYSTEM ERROR & VIOLENT GLITCH BURST ===
    // 1. Sudden massive shake, color inversion & RGB chromatic aberration
    tl.to(loaderRef.current, {
      x: -16,
      y: 8,
      skewX: 10,
      filter: "invert(1) contrast(2.5) brightness(2)",
      opacity: 0.9,
      duration: 0.05,
      ease: "none",
    })
    .to(loaderRef.current, {
      x: 18,
      y: -10,
      skewX: -12,
      rotate: 2,
      filter: "drop-shadow(-10px 0 0 #00ffff) drop-shadow(10px 0 0 #ff0055) brightness(2.5)",
      opacity: 1,
      duration: 0.05,
      ease: "none",
    })
    // 2. Blackout dropout (Sinyal drop mendadak)
    .to(loaderRef.current, {
      opacity: 0,
      duration: 0.03,
      ease: "none",
    })
    // 3. Blinding White Flash & severe horizontal scanline tear
    .to(loaderRef.current, {
      opacity: 1,
      x: -10,
      y: 12,
      skewX: 16,
      rotate: -2.5,
      scaleY: 1.08,
      filter: "invert(1) brightness(3.5) contrast(3)",
      duration: 0.07,
      ease: "none",
    })
    // 4. Rapid electrical flickers (Kedip tegangan tinggi TV tabung error)
    .to(loaderRef.current, {
      x: 12,
      y: -6,
      skewX: -8,
      rotate: 1.2,
      filter: "drop-shadow(8px 0 0 #00ff66) drop-shadow(-8px 0 0 #ff00ff) contrast(2)",
      opacity: 0.25,
      duration: 0.04,
    })
    .to(loaderRef.current, {
      opacity: 1,
      x: -6,
      y: 4,
      skewX: 5,
      rotate: 0,
      duration: 0.04,
    })
    .to(loaderRef.current, {
      opacity: 0.1,
      x: 8,
      y: -3,
      duration: 0.03,
    })
    .to(loaderRef.current, {
      opacity: 1,
      x: 0,
      y: 0,
      skewX: 0,
      rotate: 0,
      scaleY: 1,
      filter: "brightness(3) contrast(2)",
      duration: 0.08,
    })
    // === TAHAP 2: CRT TUBE COLLAPSE (Sinar TV Tabung Menciut & Lenyap) ===
    .to(loaderRef.current, {
      scaleY: 0.003,
      scaleX: 1.2,
      filter: "brightness(5) contrast(4)",
      backgroundColor: "#ffffff",
      duration: 0.22,
      ease: "power4.in",
    })
    .to(loaderRef.current, {
      scaleX: 0,
      opacity: 0,
      duration: 0.12,
      ease: "power4.in",
    });
  };

  if (!loading) return null;

  return (
    <div
      ref={loaderRef}
      className={`fixed inset-0 z-[9999] flex items-center justify-center font-mono select-none overflow-hidden transition-colors duration-500 ${
        isPink ? "bg-[#ff6fa4] text-white" : "bg-black text-green-500"
      }`}
    >
      {/* Retro CRT Scanlines & Flicker Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,3px_100%] z-[1000] opacity-80"></div>
      
      <div className="w-full max-w-2xl px-6 flex flex-col justify-between min-h-[85vh] max-h-[96vh] py-4 md:py-6 z-10 overflow-y-auto scrollbar-none">
        
        {/* Terminal Header */}
        <div className={`border-b pb-3 opacity-80 text-xs md:text-sm transition-colors duration-500 flex-shrink-0 ${
          isPink ? "border-pink-300 text-pink-100" : "border-green-900 text-green-700"
        }`}>
          <p>RIZKY_MAINFRAME v2026.08.22 // {isPink ? "LOVE CONSOLE" : "SECURE CONSOLE"}</p>
          <p>{isPink ? "CPU: Pure-Emotion-9.9 // RAM: Unlimited Hearts" : "CPU: Gem-X-3.5-Flash // RAM: 64GB ECC // PORT: 3001"}</p>
        </div>

        {/* Dynamic Stages */}
        <div className="flex-1 flex flex-col justify-center my-3 md:my-4">
          {stage === "input" && (
            <form ref={formRef} onSubmit={handleStartLoading} className="flex flex-col gap-3.5 md:gap-4 w-full">
              <div className="space-y-1.5">
                <p className={`text-xs md:text-sm font-bold transition-colors duration-500 ${isPink ? "text-pink-100" : "text-green-400"}`}>
                  <span className={`${isPink ? "text-white" : "text-red-500"} font-bold animate-pulse`}>&gt;</span> PLEASE IDENTIFY YOURSELF:
                </p>
                <input
                  type="text"
                  required
                  placeholder={isPink ? "Your lovely name..." : "Enter Name..."}
                  value={name}
                  onChange={(e) => { setName(e.target.value); if (hasError) { setHasError(false); setErrorMsg(""); } }}
                  className={`w-full max-w-lg border-2 rounded px-4 py-2 font-mono outline-none text-base transition-all duration-500 ${
                    isPink 
                      ? "bg-[#ff558f] border-white text-white placeholder-pink-200 focus:border-pink-100"
                      : "bg-black border-green-900 focus:border-green-500 text-green-400"
                  }`}
                  maxLength={25}
                  autoFocus
                />
              </div>

              {/* Instagram Handle Input */}
              <div className="space-y-1.5">
                <p className={`text-xs md:text-sm font-bold transition-colors duration-500 ${isPink ? "text-pink-100" : "text-green-400"}`}>
                  <span className={`${isPink ? "text-white" : "text-green-600"} font-bold`}>&gt;</span> INSTAGRAM:
                </p>
                <div className="relative w-full max-w-lg">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-mono text-zinc-500 select-none">@</span>
                  <input
                    type="text"
                    placeholder="username (e.g. your_instagram)"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    className={`w-full border-2 rounded pl-8 pr-4 py-1.5 font-mono outline-none text-sm md:text-base transition-all duration-500 ${
                      isPink 
                        ? "bg-[#ff558f] border-white text-white placeholder-pink-200 focus:border-pink-100"
                        : "bg-black border-green-900 focus:border-green-500 text-green-400"
                    }`}
                    maxLength={35}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <p className={`text-xs md:text-sm font-bold transition-colors duration-500 ${isPink ? "text-pink-100" : "text-green-400"}`}>
                  <span className={isPink ? "text-pink-200" : "text-green-700"}>&gt;</span> CHOOSE CONNECTION CATEGORY:
                  {!role && !hasError && (
                    <span className={`ml-2 text-xs opacity-60 ${isPink ? "text-pink-200" : "text-green-700"}`}>(required)</span>
                  )}
                </p>
                <div className="grid grid-cols-2 gap-2 md:gap-2.5 max-w-lg">
                  {(["HRD", "FRIEND", "BROTHER", "GUEST", "GIRLFRIEND"] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => { setRole(r); setHasError(false); setErrorMsg(""); }}
                      onMouseEnter={r === "GIRLFRIEND" ? () => setIsHoveredGF(true) : undefined}
                      onMouseLeave={r === "GIRLFRIEND" ? () => setIsHoveredGF(false) : undefined}
                      className={`group border-2 px-3 py-1.5 md:py-2 text-xs md:text-sm font-black uppercase transition-all duration-300 flex items-center justify-center gap-1.5 ${
                        r === "GIRLFRIEND" ? "col-span-2" : ""
                      } ${
                        role === r
                          ? isPink
                            ? "bg-white text-[#ff6fa4] border-white shadow-[0_0_10px_rgba(255,255,255,0.6)] animate-pulse"
                            : "bg-green-500 text-black border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"
                          : hasError && !role
                          ? isPink
                            ? "bg-[#ff3377] text-pink-200 border-pink-300 animate-pulse"
                            : "bg-black text-red-500 border-red-700 animate-pulse"
                          : isPink
                          ? "bg-[#ff558f] text-pink-200 border-pink-400 hover:border-white hover:text-white"
                          : "bg-black text-green-700 border-green-900 hover:border-green-600 hover:text-green-500"
                      }`}
                    >
                      [ {r} {r === "GIRLFRIEND" && <PixelHeart className={`w-3.5 h-3.5 ${role === "GIRLFRIEND" ? "text-[#ff6fa4]" : "text-red-500 group-hover:text-white"} transition-colors duration-200 animate-heartbeat`} />} ]
                    </button>
                  ))}
                </div>

                {/* Error / Warning Message */}
                {errorMsg && (
                  <p className={`text-xs font-black animate-pulse mt-1 ${
                    isPink ? "text-white" : "text-red-400"
                  }`}>
                    {errorMsg}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={!name.trim()}
                className={`mt-2 md:mt-3 w-full max-w-lg border-2 font-black py-2.5 md:py-3 px-6 text-xs md:text-sm uppercase tracking-wider transition-all duration-500 cursor-pointer ${
                  name.trim()
                    ? isPink
                      ? "bg-white text-[#ff6fa4] border-white shadow-[0_0_15px_rgba(255,255,255,0.7)] hover:bg-[#ff558f] hover:text-white"
                      : "bg-green-500 text-black border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.6)] hover:bg-black hover:text-green-500"
                    : isPink
                    ? "bg-[#ff558f] text-pink-300 border-pink-400 cursor-not-allowed"
                    : "bg-black text-zinc-600 border-zinc-800 cursor-not-allowed"
                }`}
              >
                REQUEST SYSTEM ACCESS
              </button>
            </form>
          )}

          {stage === "logs" && (
            <div
              ref={logContainerRef}
              className={`w-full h-[50vh] overflow-y-auto border p-4 rounded text-xs md:text-sm flex flex-col gap-2 scrollbar-none transition-all duration-500 ${
                isGF ? "border-pink-300 bg-[#ff558f]" : "border-green-900 bg-black"
              }`}
              style={{ scrollbarWidth: "none" }}
            >
              {logMessages.slice(0, currentLogIndex + 1).map((log, index) => {
                const isCurrentActive = index === currentLogIndex;
                return (
                  <div key={index} className="leading-relaxed">
                    <span className={`font-bold mr-2 ${isGF ? "text-pink-200" : "text-green-700"}`}>&gt;&gt;</span>
                    {isCurrentActive ? (
                      <EncryptedText
                        text={log}
                        interval={10}
                        cyclesPerChar={1}
                        className={`${isGF ? "text-white" : "text-green-400"} font-mono`}
                        onComplete={() => {
                          if (logContainerRef.current) {
                            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
                          }
                          if (index < logMessages.length - 1) {
                            setTimeout(() => {
                              setCurrentLogIndex((prev) => prev + 1);
                            }, 80);
                          } else {
                            setTimeout(() => {
                              setStage("welcome");
                            }, 600);
                          }
                        }}
                      />
                    ) : (
                      <span className={`${isGF ? "text-white" : "text-green-400"} font-mono`}>
                        {log}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {stage === "welcome" && (
            <div className="flex flex-col items-center justify-center gap-4 text-center">
              <div className="flex items-center justify-center gap-2">
                {isGF && <PixelHeart className="w-8 h-8 md:w-12 md:h-12 text-red-500 animate-heartbeat" />}
                <div className="inline-flex items-center">
                  <EncryptedText
                    text={`WELCOME, ${name.toUpperCase()}!`}
                    className={`font-bebas-neue text-4xl sm:text-6xl md:text-7xl tracking-wider font-black select-none ${
                      isGF ? "text-white" : "text-[#ff1a75]"
                    }`}
                    interval={45}
                    cyclesPerChar={2}
                    onComplete={() => {
                      setTimeout(() => {
                        triggerExitAnimation();
                      }, 1400);
                    }}
                  />
                  {/* Blinking Typing Cursor / Garis Kedip */}
                  <span
                    className={`inline-block w-1.5 sm:w-2.5 h-7 sm:h-11 md:h-14 ml-1.5 animate-pulse transition-colors duration-300 ${
                      isGF ? "bg-white shadow-[0_0_8px_#ffffff]" : "bg-[#ff1a75] shadow-[0_0_10px_#ff1a75]"
                    }`}
                    style={{ animationDuration: "0.6s" }}
                  />
                </div>
                {isGF && <PixelHeart className="w-8 h-8 md:w-12 md:h-12 text-red-500 animate-heartbeat [animation-delay:0.2s]" />}
              </div>
              <div className={`w-16 h-1 animate-pulse mt-2 ${isGF ? "bg-white" : "bg-green-500"}`}></div>
            </div>
          )}
        </div>

        {/* Terminal Footer */}
        <div className={`border-t pt-4 flex justify-between text-[10px] md:text-xs opacity-60 transition-colors duration-500 ${
          isPink ? "border-pink-300 text-pink-100" : "border-green-900 text-green-700"
        }`}>
          <p>{isPink ? "LOVE CONSOLE // SIGN IN" : "SECURE CONSOLE // ACCESS REQ"}</p>
          <p
            onClick={() => {
              setName("Rizky (Owner)");
              setRole("OWNER");
              localStorage.setItem("guest_name", "Rizky (Owner)");
              localStorage.setItem("guest_instagram", "rzkyandriyanto");
              localStorage.setItem("guest_role", "OWNER");
              setCurrentLogIndex(0);
              setStage("logs");
              if (typeof window !== "undefined") {
                window.dispatchEvent(new CustomEvent("guest_auth_updated", {
                  detail: { name: "Rizky (Owner)", instagram: "rzkyandriyanto", role: "OWNER" }
                }));
              }
            }}
            className="cursor-default select-none"
          >
            © RIZKY ANDRIYANTO 2026
          </p>
        </div>

        {/* Secret Camouflaged Dot in bottom-right corner */}
        <button
          type="button"
          onClick={() => {
            setName("Rizky (Owner)");
            setRole("OWNER");
            localStorage.setItem("guest_name", "Rizky (Owner)");
            localStorage.setItem("guest_instagram", "rzkyandriyanto");
            localStorage.setItem("guest_role", "OWNER");
            setCurrentLogIndex(0);
            setStage("logs");
            if (typeof window !== "undefined") {
              window.dispatchEvent(new CustomEvent("guest_auth_updated", {
                detail: { name: "Rizky (Owner)", instagram: "rzkyandriyanto", role: "OWNER" }
              }));
            }
          }}
          className="fixed bottom-2 right-2 text-[9px] font-mono select-none cursor-pointer transition-opacity duration-300 opacity-5 hover:opacity-40"
          style={{ color: isPink ? "#ff6fa4" : "#142918" }}
          tabIndex={-1}
          aria-hidden="true"
        >
          [·]
        </button>

      </div>
    </div>
  );
}
