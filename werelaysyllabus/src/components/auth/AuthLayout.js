"use client";
import { motion } from "framer-motion";

export default function AuthLayout({ children, decoration }) {
  return (
    <div className="min-h-screen w-full bg-[#fdfdfb] relative overflow-x-hidden flex items-center justify-center p-4 md:p-8">
      <div 
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
        style={{ 
          backgroundImage: 'linear-gradient(#000 2px, transparent 2px), linear-gradient(90deg, #000 2px, transparent 2px)', 
          backgroundSize: '40px 40px' 
        }} 
      />

      <div className="hidden lg:block select-none pointer-events-none">
        {decoration}
      </div>

      <div className="relative z-10 w-full flex flex-col items-center">
        {children}
      </div>
    </div>
  );
}