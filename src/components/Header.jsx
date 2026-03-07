"use client";

import Link from "next/link";
import { motion } from "framer-motion";

function Header() {
  return (
    <header
      className="fixed top-0 left-0 w-full z-50 px-4 py-6 md:py-10 text-orange-500"
      data-speed="fixed"
    >
      <nav className="flex justify-center items-center">
        {/* Menggunakan text-lg di HP dan text-4xl di Desktop. Gap juga disesuaikan */}
        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-12 text-lg md:text-4xl font-bold">
          <Link href="/" className="flex items-center gap-1 md:gap-2">
            <motion.span
              whileHover={{ y: -4, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="inline-block hover:text-blue-400"
            >
              HOME
            </motion.span>
            <span className="text-gray-500">/</span>
          </Link>

          <Link href="/about" className="flex items-center gap-1 md:gap-2">
            <motion.span
              whileHover={{ y: -4, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="inline-block hover:text-blue-400"
            >
              ABOUT
            </motion.span>
            <span className="text-gray-500">/</span>
          </Link>

          <Link
            href="/projects"
            className="flex items-center gap-1 md:gap-2 text-blue-400"
          >
            <motion.span
              whileHover={{ y: -4, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="inline-block hover:text-black"
            >
              PROJECTS
            </motion.span>
            <span className="text-gray-500">/</span>
          </Link>

          <Link href="/contact" className="flex items-center">
            <motion.span
              whileHover={{ y: -4, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="inline-block hover:text-blue-400"
            >
              CONTACT
            </motion.span>
          </Link>
        </div>
      </nav>
    </header>
  );
}

export default Header;
