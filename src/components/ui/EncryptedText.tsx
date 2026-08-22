"use client";
import React, { useEffect, useState } from "react";

interface EncryptedTextProps {
  text: string;
  className?: string;
  interval?: number;
  revealSpeed?: number;
  onComplete?: () => void;
}

export default function EncryptedText({
  text = "",
  className = "",
  interval = 30,
  revealSpeed = 1,
  onComplete,
}: EncryptedTextProps) {
  const [displayText, setDisplayText] = useState("");
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}[]|;:,.<>?";

  useEffect(() => {
    if (!text) {
      if (onComplete) onComplete();
      return;
    }
    let iteration = 0;
    const maxIterations = text.length;

    const timer = setInterval(() => {
      const scrambled = text
        .split("")
        .map((char, index) => {
          if (index < iteration) {
            return text[index];
          }
          if (char === " ") return " ";
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join("");

      setDisplayText(scrambled);

      if (iteration >= maxIterations) {
        clearInterval(timer);
        if (onComplete) {
          onComplete();
        }
      }

      iteration += revealSpeed;
    }, interval);

    return () => clearInterval(timer);
  }, [text, interval, revealSpeed, onComplete]);

  return <span className={className}>{displayText}</span>;
}
