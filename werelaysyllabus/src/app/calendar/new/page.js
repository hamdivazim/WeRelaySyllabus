"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, School, BookOpen, Loader2, Info, Hash } from "lucide-react";
import Link from "next/link";
import { useCourseData } from "@/hooks/useCourseData";

const INPUT_STYLE = "w-full bg-white border-[3px] border-slate-900 rounded-2xl px-5 py-4 font-black text-lg uppercase placeholder:text-slate-200 focus:bg-indigo-50 focus:shadow-[6px_6px_0px_0px_#6366f1] focus:translate-x-[-3px] focus:translate-y-[-3px] outline-none transition-all";
const INPUT_STYLE_ROSE = "w-full bg-white border-[3px] border-slate-900 rounded-2xl px-5 py-4 font-black text-lg uppercase placeholder:text-slate-200 focus:shadow-[6px_6px_0px_0px_#f43f5e] focus:translate-x-[-3px] focus:translate-y-[-3px] outline-none transition-all";
const LABEL_STYLE = "flex items-center gap-2 text-[11px] font-[1000] uppercase tracking-widest text-slate-400 mb-2 ml-1";

export default function CreateCoursePage() {
  const router = useRouter();
  const { createCourse } = useCourseData();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    university: "",
    code: "",
    name: "",
    description: "",
    term: "Spring 2026"
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const newCourseId = await createCourse(formData);
      router.push(`/calendar/${newCourseId}`);
    } catch (error) {
      setIsSubmitting(false);
    }
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen w-full bg-[#fdfdfb] relative overflow-hidden flex flex-col items-center py-12 md:py-20 p-4">
      <div 
        className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none" 
        style={{ 
          backgroundImage: 'linear-gradient(#000 2px, transparent 2px), linear-gradient(90deg, #000 2px, transparent 2px)', 
          backgroundSize: '40px 40px' 
        }} 
      />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full relative z-10"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-5">
            <Link href="/calendar/search">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-14 h-14 bg-white border-[4px] border-slate-900 rounded-2xl flex items-center justify-center shadow-[6px_6px_0px_0px_#000] active:shadow-none active:translate-y-1 transition-all"
              >
                <ArrowLeft size={28} strokeWidth={4} />
              </motion.button>
            </Link>
            <div>
              <h1 className="text-5xl md:text-6xl font-[1000] uppercase italic text-slate-900 tracking-tighter leading-none">
                Create <span className="text-indigo-600">Relay</span>
              </h1>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mt-2">
                Start the chain for your classmates
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border-[6px] border-slate-900 rounded-[3rem] p-8 md:p-12 shadow-[16px_16px_0px_0px_#1e293b] relative">
          
          <form onSubmit={handleSubmit} className="space-y-10">
            
            <section className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-6 w-1.5 bg-indigo-600 rounded-full" />
                <h2 className="font-[1000] uppercase text-sm tracking-tighter">Course Identity</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className={LABEL_STYLE}><School size={14} /> University / Institution</label>
                  <input 
                    required
                    type="text" 
                    placeholder="University of Oxford"
                    value={formData.university}
                    onChange={(e) => updateField("university", e.target.value)}
                    className={INPUT_STYLE}
                  />
                </div>

                <div>
                  <label className={LABEL_STYLE}><Hash size={14} /> Course Code</label>
                  <input 
                    required
                    type="text" 
                    placeholder="CS 101"
                    value={formData.code}
                    onChange={(e) => updateField("code", e.target.value)}
                    className={INPUT_STYLE}
                  />
                </div>
              </div>
            </section>

            <section className="space-y-6">
               <div className="flex items-center gap-3 mb-2">
                <div className="h-6 w-1.5 bg-rose-500 rounded-full" />
                <h2 className="font-[1000] uppercase text-sm tracking-tighter">Syllabus Details</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={LABEL_STYLE}><BookOpen size={14} /> Full Course Title</label>
                  <input 
                    required
                    type="text" 
                    placeholder="Algorithm Design & Analysis"
                    value={formData.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    className={INPUT_STYLE_ROSE}
                  />
                </div>

                <div>
                  <label className={LABEL_STYLE}><Info size={14} /> Short Description</label>
                  <textarea
                    rows={3}
                    placeholder="What should students know about this relay?"
                    value={formData.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    className={`${INPUT_STYLE_ROSE} normal-case font-bold text-base md:text-lg resize-none`}
                  />
                </div>
              </div>
            </section>

            <div className="pt-4">
              <motion.button 
                type="submit" 
                disabled={isSubmitting}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-rose-500 text-white border-[6px] border-slate-900 rounded-[2rem] py-6 text-2xl font-[1000] uppercase italic tracking-tighter shadow-[10px_10px_0px_0px_#000] hover:shadow-[14px_14px_0px_0px_#000] active:shadow-none active:translate-y-2 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={32} strokeWidth={4} />
                ) : (
                  <>
                    <Sparkles size={28} strokeWidth={4} fill="currentColor" className="text-yellow-300" />
                    Launch Relay
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}