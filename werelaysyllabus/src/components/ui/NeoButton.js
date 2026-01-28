"use client";
import { motion } from "framer-motion";

export default function NeoButton({ children, onClick, variant = "primary", className = "", type = "button", disabled = false }) {
  const variants = {
    primary: "bg-indigo-600 text-white shadow-[4px_4px_0px_0px_#1e293b] hover:shadow-[2px_2px_0px_0px_#1e293b] hover:translate-x-[2px] hover:translate-y-[2px]",
    secondary: "bg-white text-slate-900 border-2 border-slate-900 shadow-[4px_4px_0px_0px_#1e293b]",
    dark: "bg-slate-900 text-white shadow-[4px_4px_0px_0px_#6366f1]"
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`px-6 py-3 font-black text-[10px] uppercase tracking-[0.2em] transition-all active:shadow-none active:translate-x-[4px] active:translate-y-[4px] ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}