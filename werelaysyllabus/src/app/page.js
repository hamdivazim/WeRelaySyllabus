"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, LogIn, Sparkles, Zap, Users, ShieldCheck } from "lucide-react";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/calendar/saved");
    }
  }, [user, loading, router]);

  if (loading || user) {
    return (
      <div className="min-h-screen bg-[#fdfdfb] flex items-center justify-center">
        <div className="w-12 h-12 border-[6px] border-t-indigo-600 border-slate-200 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfdfb] relative overflow-x-hidden selection:bg-yellow-300">
      <div 
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
        style={{ 
          backgroundImage: 'linear-gradient(#000 2px, transparent 2px), linear-gradient(90deg, #000 2px, transparent 2px)', 
          backgroundSize: '40px 40px' 
        }} 
      />

      <main className="max-w-6xl mx-auto px-6 py-20 relative z-10">
        <section className="text-center mb-24">
          <motion.div 
            initial={{ rotate: -5, y: 20, opacity: 0 }}
            animate={{ rotate: -2, y: 0, opacity: 1 }}
            className="bg-yellow-300 text-slate-900 font-[1000] px-6 py-2 border-[4px] border-slate-900 uppercase text-sm md:text-base mb-8 inline-block shadow-[6px_6px_0px_0px_#000] italic tracking-tighter"
          >
            Crowdsourcing your calendars.
          </motion.div>

          <h1 className="text-6xl md:text-9xl font-[1000] text-slate-900 uppercase italic leading-[0.8] tracking-tighter mb-8">
            WeRelay <br />
            <span className="text-indigo-600">Syllabus</span>
          </h1>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <Link href="/register" className="w-full md:w-auto">
              <button className="w-full md:px-10 py-5 bg-indigo-600 text-white border-[4px] border-slate-900 font-[1000] uppercase italic text-xl shadow-[8px_8px_0px_0px_#000] hover:translate-y-[-4px] hover:shadow-[12px_12px_0px_0px_#000] transition-all flex items-center justify-center gap-3">
                <LogIn size={24} strokeWidth={4} />
                Join the Relay
              </button>
            </Link>

            <Link href="/calendar/search" className="w-full md:w-auto">
              <button className="w-full md:px-10 py-5 bg-rose-500 text-white text-slate-900 border-[4px] border-slate-900 font-[1000] uppercase italic text-xl shadow-[8px_8px_0px_0px_#000] hover:translate-y-[-4px] hover:shadow-[12px_12px_0px_0px_#000] transition-all flex items-center justify-center gap-3">
                <Search size={24} strokeWidth={4} />
                Browse Relays
              </button>
            </Link>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          <div className="bg-white border-[4px] border-slate-900 p-8 shadow-[8px_8px_0px_0px_#fbbf24]">
            <div className="w-14 h-14 bg-yellow-100 border-[3px] border-slate-900 rounded-2xl flex items-center justify-center mb-6">
              <Zap className="text-yellow-600" size={32} strokeWidth={3} fill="currentColor" />
            </div>
            <h3 className="text-2xl font-[1000] text-slate-900 uppercase italic mb-4">Instant Sync</h3>
            <p className="font-bold text-slate-500 uppercase text-sm leading-relaxed">
              Find your course, hit "Export", and get every deadline directly inside your personal calendar.
            </p>
          </div>

          <div className="bg-white border-[4px] border-slate-900 p-8 shadow-[8px_8px_0px_0px_#6366f1]">
            <div className="w-14 h-14 bg-indigo-100 border-[3px] border-slate-900 rounded-2xl flex items-center justify-center mb-6">
              <Users className="text-indigo-600" size={32} strokeWidth={3} />
            </div>
            <h3 className="text-2xl font-[1000] text-slate-900 uppercase italic mb-4">Crowdsourced</h3>
            <p className="font-bold text-slate-500 uppercase text-sm leading-relaxed">
              Built by students for students. One person makes an update, everyone benefits.
            </p>
          </div>

          <div className="bg-white border-[4px] border-slate-900 p-8 shadow-[8px_8px_0px_0px_#f43f5e]">
            <div className="w-14 h-14 bg-rose-100 border-[3px] border-slate-900 rounded-2xl flex items-center justify-center mb-6">
              <ShieldCheck className="text-rose-600" size={32} strokeWidth={3} />
            </div>
            <h3 className="text-2xl font-[1000] text-slate-900 uppercase italic mb-4">Verified</h3>
            <p className="font-bold text-slate-500 uppercase text-sm leading-relaxed">
              The vouch system ensures that you get the most accurate and up-to-date syllabi.
            </p>
          </div>
        </section>

        <section className="bg-slate-900 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-20 hidden md:block">
            <Sparkles className="text-white" size={120} />
          </div>
          
          <h2 className="text-4xl md:text-6xl font-[1000] text-white uppercase italic mb-8 relative z-10">
            Ready to relay <br /> your <span className="text-yellow-400">syllabus?</span>
          </h2>
          
          <Link href="/login">
            <button className="px-12 py-6 bg-yellow-400 text-slate-900 border-[4px] border-white font-[1000] uppercase italic text-2xl shadow-[0_0_20px_rgba(251,191,36,0.3)] hover:scale-105 transition-all">
              Get Started Now
            </button>
          </Link>
        </section>

        <footer className="mt-20 text-center opacity-30">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-900">
            WeRelaySyllabus - Made By Hamd Waseem
          </p>
        </footer>
      </main>
    </div>
  );
}