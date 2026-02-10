"use client";

import { useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const performLogout = async () => {
      try {
        await signOut(auth);
        setTimeout(() => router.push("/login"), 800);
      } catch (err) {
        router.push("/login");
      }
    };
    performLogout();
  }, [router]);

  return (
    <div className="min-h-screen w-full bg-[#fdfdfb] flex items-center justify-center p-6">
      <div className="w-full max-w-xs">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-4 h-4 bg-rose-500 border-2 border-slate-900 animate-pulse" />
          <h2 className="text-xl font-[1000] text-slate-900 uppercase italic tracking-tighter">
            Signing <span className="text-rose-500">out...</span>
          </h2>
        </div>
        
        <div className="w-full h-4 bg-white border-[3px] border-slate-900 shadow-[4px_4px_0px_0px_#000] overflow-hidden">
          <motion.div 
            className="h-full bg-rose-500"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 0.8, ease: "circOut" }}
          />
        </div>
        
        <p className="mt-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
          Redirecting to login...
        </p>
      </div>
    </div>
  );
}