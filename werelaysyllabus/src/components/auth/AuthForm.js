"use client";
import { useState } from "react";
import { motion } from "framer-motion";

export default function AuthForm({ type, onSubmit, error, isLoading }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isRegister = type === 'register';
  
  const theme = {
    accent: isRegister ? "bg-indigo-600" : "bg-rose-500",
    shadow: isRegister ? "shadow-[#6366f1]" : "shadow-[#f43f5e]",
    btnHover: isRegister ? "bg-indigo-400" : "bg-rose-400",
    sticker: isRegister ? "bg-yellow-300" : "bg-amber-300",
    heading: isRegister ? 'Join the\nRelay' : 'Back in\nMotion',
    subtext: isRegister ? "Sync your syllabi with a click." : "Log in to vouch or edit."
  };

  return (
    <div className={`flex flex-col md:flex-row w-full max-w-5xl bg-white border-[4px] md:border-[6px] border-slate-900 shadow-[8px_8px_0px_0px_#1e293b] md:shadow-[16px_16px_0px_0px_#1e293b] ${theme.shadow} overflow-hidden transition-all duration-500`}>
      <div className={`w-full md:w-5/12 ${theme.accent} p-8 md:p-10 flex flex-col justify-between border-b-[4px] md:border-b-0 md:border-r-[6px] border-slate-900 relative overflow-hidden`}>
        <div className="relative z-10">
          <motion.span 
            initial={{ rotate: -5, scale: 0.9 }}
            animate={{ rotate: -2, scale: 1 }}
            className={`${theme.sticker} text-slate-900 font-black px-3 py-1 border-2 border-slate-900 uppercase text-[10px] md:text-sm mb-4 inline-block shadow-[3px_3px_0px_0px_#000]`}
          >
            WeRelaySyllabus
          </motion.span>
          <h2 className="text-5xl md:text-7xl font-[1000] text-white italic leading-[0.85] md:leading-[0.8] uppercase tracking-tighter mt-2 whitespace-pre-line">
            {theme.heading}
          </h2>
        </div>
        
        <div className="mt-8 md:mt-12 relative z-10">
          <p className="text-white font-bold text-sm md:text-lg leading-tight uppercase italic max-w-[200px] md:max-w-[220px] opacity-80">
            {theme.subtext}
          </p>
        </div>

        <div className="absolute -bottom-4 -right-4 md:-bottom-8 md:-right-8 opacity-10 md:opacity-20 pointer-events-none">
          <h3 className="text-8xl md:text-[12rem] font-[1000] text-slate-900 uppercase">
            {isRegister ? 'NEW' : 'GO'}
          </h3>
        </div>
      </div>

      <div className="flex-1 p-6 md:p-16 bg-white relative flex flex-col justify-center">
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(email, password); }} className="space-y-6 md:space-y-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Identity / Email</label>
            <input 
              type="email" required 
              placeholder="student@university.edu"
              className="w-full bg-transparent border-b-2 md:border-b-4 border-slate-100 focus:border-slate-900 py-2 md:py-3 text-lg md:text-xl font-bold outline-none transition-all placeholder:text-slate-200"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Security / Password</label>
            <input 
              type="password" required 
              placeholder="••••••••"
              className="w-full bg-transparent border-b-2 md:border-b-4 border-slate-100 focus:border-slate-900 py-2 md:py-3 text-lg md:text-xl font-bold outline-none transition-all placeholder:text-slate-200"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border-l-4 border-rose-500 text-rose-600 font-black text-[10px] uppercase italic">
              {error}
            </div>
          )}

          <button 
            type="submit"
            disabled={isLoading}
            className="group relative w-full py-4 md:py-6 bg-slate-900 text-white font-[1000] text-lg md:text-xl uppercase italic tracking-tighter overflow-hidden shadow-[4px_4px_0px_0px_#1e293b] active:translate-y-[2px] active:shadow-none transition-all disabled:opacity-70"
          >
            <span className="relative z-20">
              {isLoading ? 'Processing...' : (isRegister ? 'Create Profile →' : 'Launch Syllabus →')}
            </span>
            
            <div className={`absolute inset-0 z-10 ${theme.btnHover} translate-y-[101%] group-hover:translate-y-0 transition-transform duration-300 ease-out`} />
          </button>
        </form>

        <div className="mt-12 md:absolute md:bottom-4 md:right-8 text-[9px] font-black text-slate-300 tracking-widest uppercase text-center md:text-right">
          Made By Hamd Waseem
        </div>
      </div>
    </div>
  );
}