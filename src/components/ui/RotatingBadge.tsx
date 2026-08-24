"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export interface RotatingBadgeItem {
  text: string;
  color?: string;
}

interface RotatingBadgeProps {
  items?: RotatingBadgeItem[];
  words?: string[];
  colors?: string[];
  interval?: number;
  className?: string;
}

const DEFAULT_CATEGORY_COLORS = [
  "bg-green-400 text-black",   // UI/UX
  "bg-purple-400 text-black",  // Motion Art
  "bg-blue-400 text-black",    // Graphic Design
  "bg-orange-500 text-black",  // Web Dev
];

export default function RotatingBadge({
  items,
  words,
  colors,
  interval = 2400,
  className = "",
}: RotatingBadgeProps) {
  const [index, setIndex] = useState(0);

  // Normalize items
  const normalizedItems: RotatingBadgeItem[] = React.useMemo(() => {
    if (items && items.length > 0) return items;
    if (words && words.length > 0) {
      return words.map((word, i) => ({
        text: word,
        color: (colors && colors[i]) || DEFAULT_CATEGORY_COLORS[i % DEFAULT_CATEGORY_COLORS.length],
      }));
    }
    return [];
  }, [items, words, colors]);

  useEffect(() => {
    if (normalizedItems.length === 0) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % normalizedItems.length);
    }, interval);

    return () => clearInterval(timer);
  }, [normalizedItems.length, interval]);

  if (normalizedItems.length === 0) return null;

  const currentItem = normalizedItems[index % normalizedItems.length];
  const currentColor = currentItem.color || DEFAULT_CATEGORY_COLORS[index % DEFAULT_CATEGORY_COLORS.length];

  return (
    <span className={`inline-block align-middle relative mx-1 my-1 ${className}`}>
      <AnimatePresence mode="wait">
        <motion.span
          key={`${currentItem.text}-${index}`}
          initial={{ y: 16, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -16, opacity: 0, scale: 0.95 }}
          transition={{
            type: "spring",
            stiffness: 420,
            damping: 26,
            opacity: { duration: 0.15 },
          }}
          className={`inline-flex items-center justify-center px-2.5 py-0.5 md:py-1 rounded-md border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-sm sm:text-lg md:text-xl font-black tracking-wide uppercase select-none transition-colors duration-300 leading-tight ${currentColor}`}
        >
          {currentItem.text}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
