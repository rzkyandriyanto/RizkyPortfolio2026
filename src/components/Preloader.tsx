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
  const [activeLogs, setActiveLogs] = useState<string[]>([]);
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
    setStage("logs");

    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("guest_auth_updated", {
        detail: { name: finalName, instagram: finalIg, role: finalRole }
      }));
    }
  };

  useEffect(() => {
    if (stage !== "logs") return;

    // Reset activeLogs so that it always starts fresh
    setActiveLogs([]);

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < logMessages.length) {
        const nextLog = logMessages[currentIndex];
        if (nextLog !== undefined) {
          setActiveLogs((prev) => [...prev, nextLog]);
        }
        currentIndex++;
        setTimeout(() => {
          if (logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
          }
        }, 50);
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setStage("welcome");
        }, 800);
      }
    }, 350);

    return () => clearInterval(interval);
  }, [stage, role, name]);

  const triggerExitAnimation = () => {
    gsap.to(loaderRef.current, {
      opacity: 0,
      duration: 1.2,
      ease: "power2.inOut",
      onComplete: () => {
        setLoading(false);
        window.dispatchEvent(new Event("loaderFinished"));
      },
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
      
      <div className="w-full max-w-2xl px-6 flex flex-col justify-between h-[85vh] py-8 z-10">
        
        {/* Terminal Header */}
        <div className={`border-b pb-4 opacity-80 text-xs md:text-sm transition-colors duration-500 ${
          isPink ? "border-pink-300 text-pink-100" : "border-green-900 text-green-700"
        }`}>
          <p>RIZKY_MAINFRAME v2026.08.22 // {isPink ? "LOVE CONSOLE" : "SECURE CONSOLE"}</p>
          <p>{isPink ? "CPU: Pure-Emotion-9.9 // RAM: Unlimited Hearts" : "CPU: Gem-X-3.5-Flash // RAM: 64GB ECC // PORT: 3001"}</p>
        </div>

        {/* Dynamic Stages */}
        <div className="flex-1 flex flex-col justify-center my-6 overflow-hidden">
          {stage === "input" && (
            <form ref={formRef} onSubmit={handleStartLoading} className="flex flex-col gap-6 w-full">
              <div className="space-y-2">
                <p className={`text-sm md:text-base transition-colors duration-500 ${isPink ? "text-pink-100" : "text-green-400"}`}>
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
              <div className="space-y-2">
                <p className={`text-sm md:text-base transition-colors duration-500 ${isPink ? "text-pink-100" : "text-green-400"}`}>
                  <span className={`${isPink ? "text-white" : "text-green-600"} font-bold`}>&gt;</span> INSTAGRAM:
                </p>
                <div className="relative w-full max-w-lg">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-mono text-zinc-500 select-none">@</span>
                  <input
                    type="text"
                    placeholder="username (e.g. your_instagram)"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    className={`w-full border-2 rounded pl-8 pr-4 py-2 font-mono outline-none text-base transition-all duration-500 ${
                      isPink 
                        ? "bg-[#ff558f] border-white text-white placeholder-pink-200 focus:border-pink-100"
                        : "bg-black border-green-900 focus:border-green-500 text-green-400"
                    }`}
                    maxLength={35}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <p className={`text-sm md:text-base transition-colors duration-500 ${isPink ? "text-pink-100" : "text-green-400"}`}>
                  <span className={isPink ? "text-pink-200" : "text-green-700"}>&gt;</span> CHOOSE CONNECTION CATEGORY:
                  {!role && !hasError && (
                    <span className={`ml-2 text-xs opacity-60 ${isPink ? "text-pink-200" : "text-green-700"}`}>(required)</span>
                  )}
                </p>
                <div className="grid grid-cols-2 gap-3 max-w-lg">
                  {(["HRD", "FRIEND", "BROTHER", "GUEST", "GIRLFRIEND"] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => { setRole(r); setHasError(false); setErrorMsg(""); }}
                      onMouseEnter={r === "GIRLFRIEND" ? () => setIsHoveredGF(true) : undefined}
                      onMouseLeave={r === "GIRLFRIEND" ? () => setIsHoveredGF(false) : undefined}
                      className={`border-2 px-3 py-2 text-xs md:text-sm font-black uppercase transition-all duration-300 flex items-center justify-center gap-1.5 ${
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
                      [ {r} {r === "GIRLFRIEND" && <PixelHeart className="w-3.5 h-3.5 text-white animate-heartbeat" />} ]
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
                className={`mt-4 w-full max-w-lg border-2 font-black py-3 px-6 text-sm uppercase tracking-wider transition-all duration-500 cursor-pointer ${
                  name.trim()
                    ? isPink
                      ? "bg-white text-[#ff6fa4] border-white shadow-[0_0_15px_rgba(255,255,255,0.7)] hover:bg-[#ff558f] hover:text-white"
                      : "bg-green-500 text-black border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.6)] hover:bg-black hover:text-green-500"
                    : isPink
                    ? "bg-[#ff558f] text-pink-300 border-pink-400 cursor-not-allowed"
                    : "bg-black text-zinc-800 border-zinc-900 cursor-not-allowed"
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
              {activeLogs.map((log, index) => (
                <div key={index} className="leading-relaxed">
                  <span className={`font-bold mr-2 ${isGF ? "text-pink-200" : "text-green-700"}`}>&gt;&gt;</span>
                  <EncryptedText
                    text={log}
                    interval={15}
                    revealSpeed={2}
                    className={`${isGF ? "text-white" : "text-green-400"} font-mono`}
                  />
                </div>
              ))}
            </div>
          )}

          {stage === "welcome" && (
            <div className="flex flex-col items-center justify-center gap-4 text-center">
              <div className="flex items-center justify-center gap-2">
                {isGF && <PixelHeart className="w-8 h-8 md:w-12 md:h-12 text-white animate-heartbeat" />}
                <EncryptedText
                  text={`WELCOME, ${name.toUpperCase()}!`}
                  className={`font-bebas-neue text-4xl sm:text-6xl md:text-7xl tracking-wider font-black select-none ${
                    isGF ? "text-white" : "text-[#ff1a75]"
                  }`}
                  interval={25}
                  revealSpeed={1}
                  onComplete={() => {
                    setTimeout(() => {
                      triggerExitAnimation();
                    }, 1200);
                  }}
                />
                {isGF && <PixelHeart className="w-8 h-8 md:w-12 md:h-12 text-white animate-heartbeat [animation-delay:0.2s]" />}
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
