"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronLeft, Flame, CheckCircle2, X, Lock } from 'lucide-react';
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function Sidebar({ courseData, courseId, eventCount, onDownload, onVouch }) {
  const router = useRouter();
  const { user } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAuthAlert, setShowAuthAlert] = useState(false);

  const isVouched = user && courseData?.vouched?.includes(user.uid);

  const handleVouchClick = () => {
    if (!user) {
      setShowAuthAlert(true);
      return;
    }
    if (!isVouched) {
      onVouch();
    }
  };

  return (
    <>
      <aside className="w-full md:w-[31%] lg:w-[31.75%] md:h-full bg-white border-b-[4px] md:border-b-0 md:border-r-[4px] border-slate-900 p-4 md:p-10 flex flex-col z-20 md:overflow-y-auto custom-scrollbar transition-all shrink-0">
        <div className="flex flex-col gap-4 md:gap-0">
          
          <div className="flex items-center justify-between md:mb-12">
            <button 
              onClick={() => router.back()} 
              className="w-10 h-10 md:w-14 md:h-14 flex items-center justify-center bg-white border-[2px] md:border-[3px] border-slate-900 rounded-xl md:rounded-2xl shadow-[3px_3px_0px_0px_#000] md:shadow-[4px_4px_0px_0px_#000] hover:bg-indigo-50 transition-all font-black text-xl md:text-2xl"
            >
              <ChevronLeft size={24} />
            </button>

            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="md:hidden px-4 py-2 bg-indigo-50 border-2 border-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-[3px_3px_0px_0px_#000]"
            >
              {isExpanded ? "Close Info" : "Course Info"}
            </button>
            
            <div className="hidden md:block bg-slate-900 text-white p-4 rotate-2 shadow-[6px_6px_0px_0px_#6366f1] border-2 border-white">
              <p className="text-[14px] font-[1000] uppercase tracking-[0.2em] leading-none">Werelay</p>
              <p className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.3em] mt-1">Syllabus</p>
            </div>
          </div>

          <div className="hidden md:block mb-8">
             <h2 className="text-4xl font-[1000] text-slate-900 uppercase italic leading-none tracking-tighter">
               Course <br /> <span className="text-indigo-600">Details</span>
             </h2>
          </div>

          <div className={`${isExpanded ? 'block' : 'hidden'} md:block mt-6 md:mt-0 space-y-6 md:space-y-8 pb-4 md:pb-0`}>
            
            <div className="p-5 md:p-6 bg-[#fdfdfb] border-[3px] border-slate-900 rounded-3xl shadow-[6px_6px_0px_0px_#000] md:shadow-[8px_8px_0px_0px_#000]">
              <p className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-400 mb-3 border-b-2 border-slate-100 pb-2">Description</p>
              <p className="text-sm md:text-md font-bold text-slate-700 leading-relaxed italic">
                {courseData?.description || "No description provided for this syllabus."}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 md:gap-6">
              <div className="p-4 md:p-6 bg-indigo-600 border-[3px] border-slate-900 rounded-3xl shadow-[6px_6px_0px_0px_#000] md:shadow-[8px_8px_0px_0px_#000] text-white">
                <p className="text-[10px] md:text-xs font-black uppercase tracking-widest opacity-80 mb-1">Scheduled</p>
                <p className="text-3xl md:text-4xl lg:text-5xl font-[1000] leading-none">{eventCount}</p>
              </div>
              
              <button 
                onClick={handleVouchClick} 
                className={`p-4 md:p-6 border-[3px] border-slate-900 rounded-3xl text-left transition-all
                  ${isVouched 
                    ? "bg-emerald-50 border-emerald-500 shadow-none translate-x-1 translate-y-1 cursor-default" 
                    : "bg-yellow-400 shadow-[6px_6px_0px_0px_#000] md:shadow-[8px_8px_0px_0px_#000] hover:bg-yellow-300 active:translate-y-1 active:shadow-none"
                  }`}
              >
                <p className={`text-[10px] md:text-xs font-black uppercase tracking-widest mb-1 
                  ${isVouched ? "text-emerald-600" : "text-slate-900"}`}>
                  {isVouched ? "Vouched" : "Vouch"}
                </p>
                <div className="flex items-center gap-2">
                  <p className={`text-3xl md:text-4xl lg:text-5xl font-[1000] leading-none 
                    ${isVouched ? 'text-emerald-500' : 'text-slate-900'}`}>
                    {courseData?.vouched?.length || 0}
                  </p>
                  {isVouched ? (
                    <CheckCircle2 size={32} className="text-emerald-500" strokeWidth={3} />
                  ) : (
                    <Flame size={32} className="text-orange-600 fill-orange-500" />
                  )}
                </div>
              </button>
            </div>

            <div className="mt-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-3 px-1">Course ID</p>
              <div className="bg-slate-50 border-2 border-slate-900 rounded-xl p-4">
                <h1 className="text-xs md:text-sm font-mono font-black tracking-tight text-slate-500 uppercase break-words leading-tight">
                  <span className="text-indigo-400 mr-2">#</span>
                  {courseId}
                </h1>
              </div>
            </div>

            <div className="pt-2">
              <button onClick={onDownload} className="w-full py-4 md:py-5 bg-slate-900 text-white border-[3px] border-slate-900 rounded-2xl font-black text-xs md:text-sm uppercase tracking-[0.2em] shadow-[6px_6px_0px_0px_#6366f1] md:shadow-[8px_8px_0px_0px_#6366f1] active:translate-y-1 transition-all">
                Export (.ICS)
              </button>
            </div>
          </div>
        </div>
      </aside>

      <AnimatePresence>
        {showAuthAlert && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAuthAlert(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="relative w-full max-w-sm bg-white border-[4px] border-slate-900 p-8 shadow-[12px_12px_0px_0px_#000]"
            >
              <button 
                onClick={() => setShowAuthAlert(false)}
                className="absolute top-4 right-4 p-1 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-slate-900" strokeWidth={3} />
              </button>

              <div className="w-16 h-16 bg-indigo-50 border-4 border-slate-900 flex items-center justify-center mb-6 -rotate-6 shadow-[4px_4px_0px_0px_#000]">
                <Lock className="text-indigo-600" size={32} strokeWidth={3} />
              </div>

              <h3 className="text-3xl font-[1000] text-slate-900 uppercase italic leading-none mb-4">
                Hold <span className="text-indigo-600">Up!</span>
              </h3>
              
              <p className="text-sm font-bold text-slate-600 uppercase tracking-tight mb-8">
                You need to be part of the relay to vouch for syllabi.
              </p>

              <div className="flex flex-col gap-3">
                <Link href="/login" className="w-full">
                  <button className="w-full py-4 bg-rose-500 text-white border-4 border-slate-900 font-black uppercase italic shadow-[4px_4px_0px_0px_#000] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#000] active:translate-y-[0px] transition-all">
                    Login Now
                  </button>
                </Link>
                <button 
                  onClick={() => setShowAuthAlert(false)}
                  className="w-full py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors"
                >
                  Maybe Later
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}