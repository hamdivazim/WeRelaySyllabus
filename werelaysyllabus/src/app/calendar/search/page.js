"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import Link from "next/link";
import { Search, Plus, Ghost, Sparkles, Bookmark } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CourseCard from "@/components/calendar/CourseCard"; 
import { useAuth } from "@/context/AuthContext";

export default function CalendarSearchPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const q = query(collection(db, "courses"), orderBy("name"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCourses(data);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(course => {
    if (!searchTerm) return true;
    const searchWords = searchTerm.toLowerCase().split(/\s+/).filter(word => word.length > 0);
    const courseContent = `${course.name} ${course.university}`.toLowerCase();
    return searchWords.every(word => courseContent.includes(word));
  });

  const buttonVariants = {
    initial: { opacity: 0, x: -10, scale: 0.95 },
    animate: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, scale: 0.95 }
  };

  return (
    <div className="min-h-screen w-full bg-[#fdfdfb] relative overflow-x-hidden p-4 md:p-12">
      <div 
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
        style={{ 
          backgroundImage: 'linear-gradient(#000 2px, transparent 2px), linear-gradient(90deg, #000 2px, transparent 2px)', 
          backgroundSize: '40px 40px' 
        }} 
      />

      <div className="max-w-4xl mx-auto relative z-10">
        <header className="mb-12 relative">
          <motion.div 
            initial={{ rotate: -5, x: -20 }}
            animate={{ rotate: -2, x: 0 }}
            className="bg-yellow-300 text-slate-900 font-[1000] px-4 py-1 border-[3px] border-slate-900 uppercase text-xs md:text-sm mb-6 inline-block shadow-[4px_4px_0px_0px_#000] italic tracking-tighter"
          >
            WeRelaySyllabus
          </motion.div>

          <h1 className="text-6xl md:text-8xl font-[1000] text-slate-900 uppercase italic leading-[0.8] tracking-tighter mb-4">
            Search <br />
            <span className="text-indigo-600">The Relays</span>
          </h1>
          
          <p className="text-xs md:text-sm font-black text-slate-400 uppercase tracking-[0.2em] mt-6 max-w-md leading-relaxed">
            Connect to community-sourced syllabi. Built by students, verified by vouches.
          </p>
        </header>

        <div className="flex flex-col gap-3 mb-16">
          <div className="flex gap-3 md:gap-4 items-stretch">
            <div className="relative flex-grow group">
              <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none z-20">
                <Search className="text-slate-900" size={28} strokeWidth={4} />
              </div>
              <input
                type="text"
                placeholder="COURSE CODE..."
                className="w-full bg-white border-[4px] md:border-[6px] border-slate-900 rounded-2xl py-6 md:py-8 pl-16 md:pl-20 pr-8 text-xl md:text-2xl font-[1000] uppercase outline-none shadow-[8px_8px_0px_0px_#1e293b] focus:shadow-[12px_12px_0px_0px_#6366f1] focus:translate-x-[-4px] focus:translate-y-[-4px] transition-all placeholder:text-slate-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="hidden md:block absolute -right-2 -top-6 bg-indigo-600 text-white p-2 border-4 border-slate-900 rotate-12 shadow-[4px_4px_0px_0px_#000] z-30 pointer-events-none">
                <Sparkles size={20} fill="currentColor" />
              </div>
            </div>

            <AnimatePresence mode="wait">
              {user && (
                <motion.div 
                  key="desktop-auth-actions"
                  variants={buttonVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="flex gap-3 md:gap-4"
                >
                  <Link href="/calendar/saved" className="hidden md:flex">
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-white border-[4px] border-slate-900 rounded-2xl px-6 flex items-center justify-center shadow-[8px_8px_0px_0px_#1e293b] hover:bg-indigo-50 transition-all group/saved"
                    >
                      <Bookmark className="text-slate-900 group-hover/saved:fill-indigo-600 group-hover/saved:text-indigo-600 transition-colors" size={28} strokeWidth={4} />
                    </motion.button>
                  </Link>

                  <Link href="/calendar/new" className="flex">
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-white border-[4px] border-slate-900 rounded-2xl px-6 flex items-center justify-center shadow-[8px_8px_0px_0px_#1e293b] hover:bg-slate-50 transition-all"
                    >
                      <Plus className="text-slate-900" size={28} strokeWidth={4} />
                    </motion.button>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {user && (
              <motion.div
                key="mobile-saved-action"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="md:hidden"
              >
                <Link href="/calendar/saved">
                  <motion.button 
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-white border-[4px] border-slate-900 rounded-2xl py-4 flex items-center justify-center gap-3 shadow-[6px_6px_0px_0px_#1e293b] active:shadow-none active:translate-y-[2px] transition-all"
                  >
                    <Bookmark className="text-slate-900 fill-slate-900" size={20} strokeWidth={3} />
                    <span className="font-[1000] uppercase text-slate-900 text-sm tracking-widest">Saved Relays</span>
                  </motion.button>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {loading ? (
             <div className="col-span-full flex flex-col items-center py-20 gap-6">
                <div className="w-16 h-16 border-[6px] border-t-indigo-600 border-slate-200 rounded-full animate-spin" />
                <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Syncing...</p>
             </div>
          ) : filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))
          ) : (
            <div className="col-span-full bg-white border-[6px] border-dashed border-slate-200 py-24 rounded-[3rem] flex flex-col items-center text-center px-6 shadow-[12px_12px_0px_0px_rgba(0,0,0,0.05)]">
              <div className="w-24 h-24 bg-slate-50 border-4 border-slate-900 rounded-full flex items-center justify-center mb-8 rotate-12">
                <Ghost className="text-slate-200" size={48} strokeWidth={3} />
              </div>
              <p className="font-[1000] text-slate-300 uppercase text-2xl mb-8 italic tracking-tighter">
                Syllabus Not Found
              </p>
              
              <Link href={user ? "/calendar/new" : "/login"}>
                <button className="px-10 py-5 bg-rose-500 text-white border-[4px] border-slate-900 font-[1000] uppercase italic text-lg shadow-[8px_8px_0px_0px_#000] hover:translate-y-[-4px] hover:shadow-[12px_12px_0px_0px_#000] active:translate-y-0 active:shadow-none transition-all flex items-center gap-3">
                  <Plus size={24} strokeWidth={4} />
                  {user ? "Register New Course" : "Login to Add Course"}
                </button>
              </Link>
            </div>
          )}
        </div>

        <div className="mt-20 text-center opacity-30">
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-900">
              WeRelaySyllabus - Made By Hamd Waseem
            </p>
        </div>
      </div>
    </div>
  );
}