"use client";
import React, { useEffect, useState } from "react";

interface EncryptedTextProps {
  text: string;
  className?: string;
  interval?: number;
  cyclesPerChar?: number;
  onComplete?: () => void;
}

export default function EncryptedText({
  text = "",
  className = "",
  interval = 40,
  cyclesPerChar = 2,
  onComplete,
}: EncryptedTextProps) {
  const [displayText, setDisplayText] = useState("");
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}[]|;:,.<>?";

  useEffect(() => {
    if (!text) {
      if (onComplete) onComplete();
      return;
    }

    let charIndex = 0;
    let cycle = 0;

    const timer = setInterval(() => {
      if (charIndex >= text.length) {
        setDisplayText(text);
        clearInterval(timer);
        if (onComplete) {
          onComplete();
        }
        return;
      }

      // Handle space directly without glitch
      if (text[charIndex] === " ") {
        charIndex++;
        cycle = 0;
        return;
      }

      // Progressive reveal: Locked text so far + random glitch character for current position
      const lockedPart = text.slice(0, charIndex);
      const randomGlitch = chars[Math.floor(Math.random() * chars.length)];
      setDisplayText(lockedPart + randomGlitch);

      cycle++;
      if (cycle >= cyclesPerChar) {
        cycle = 0;
        charIndex++;
      }
    }, interval);

    return () => clearInterval(timer);
  }, [text, interval, cyclesPerChar, onComplete]);

  return <span className={className}>{displayText}</span>;
}
