"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Ghost, Search, Sparkles, LogOut, X, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CourseCard from "@/components/calendar/CourseCard"; 
import { useAuth } from "@/context/AuthContext";

export default function SavedCoursesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSignOutAlert, setShowSignOutAlert] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/");
    }
  }, [user, authLoading, router]);

  const fetchSavedCourses = async () => {
    if (authLoading || !user) return;
    
    try {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      const savedIds = userSnap.data()?.savedCourses || [];
      
      if (savedIds.length === 0) { 
        setCourses([]); 
        setLoading(false);
        return; 
      }

      const coursesRef = collection(db, "courses");
      const q = query(coursesRef, where("__name__", "in", savedIds));
      const snapshot = await getDocs(q);
      setCourses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedCourses();
  }, [user, authLoading]);

  const filteredCourses = courses.filter(course => {
    const content = `${course.name} ${course.code} ${course.university}`.toLowerCase();
    return content.includes(searchTerm.toLowerCase());
  });

  if (authLoading || !user) {
    return (
      <div className="min-h-screen w-full bg-[#fdfdfb] flex items-center justify-center">
        <div className="w-16 h-16 border-[6px] border-t-rose-600 border-slate-200 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#fdfdfb] relative overflow-x-hidden p-4 md:p-12">
      <div 
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
        style={{ backgroundImage: 'linear-gradient(#000 2px, transparent 2px), linear-gradient(90deg, #000 2px, transparent 2px)', backgroundSize: '40px 40px' }} 
      />
      <div className="max-w-4xl mx-auto relative z-10">
        <header className="mb-8 relative">
          <div className="flex justify-between items-start">
            <motion.div 
              initial={{ rotate: -5, x: -20 }}
              animate={{ rotate: -2, x: 0 }}
              className="bg-rose-600 text-white font-[1000] px-4 py-1 border-[3px] border-slate-900 uppercase text-xs md:text-sm mb-6 inline-block shadow-[4px_4px_0px_0px_#000] italic tracking-tighter"
            >
              WeRelaySyllabus
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.05, rotate: 3 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSignOutAlert(true)}
              className="p-3 bg-white border-[3px] border-slate-900 rounded-xl shadow-[4px_4px_0px_0px_#000] hover:bg-rose-50 transition-all text-slate-900"
            >
              <LogOut size={20} strokeWidth={3} />
            </motion.button>
          </div>

          <h1 className="text-6xl md:text-8xl font-[1000] text-slate-900 uppercase italic leading-[0.8] tracking-tighter mb-4">
            Saved <br />
            <span className="text-rose-600">Relays</span>
          </h1>
          
          <div className="flex flex-col md:flex-row md:items-center gap-4 mt-6">
            <p className="text-xs md:text-sm font-black text-slate-400 uppercase tracking-[0.2em] max-w-md leading-relaxed">
              Your personal collection of calendars.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white border-2 border-slate-900 px-3 py-1 rounded-full w-fit mt-2">
            <Sparkles size={14} className="text-rose-500" fill="currentColor" />
            <span className="text-[10px] font-black uppercase tracking-widest">{courses.length} Courses</span>
          </div>
        </header>

        <div className="flex flex-col gap-3 mb-16">
          <div className="flex gap-3 md:gap-4 items-stretch">
            <div className="relative flex-grow group">
              <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none z-20">
                <Search className="text-slate-900" size={28} strokeWidth={4} />
              </div>
              <input
                type="text"
                placeholder="SEARCH YOUR VAULT..."
                className="w-full bg-white border-[4px] md:border-[6px] border-slate-900 rounded-2xl py-6 md:py-8 pl-16 md:pl-20 pr-8 text-xl md:text-2xl font-[1000] uppercase outline-none shadow-[8px_8px_0px_0px_#1e293b] focus:shadow-[12px_12px_0px_0px_#f43f5e] focus:translate-x-[-4px] focus:translate-y-[-4px] transition-all placeholder:text-slate-100"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Link href="/calendar/search" className="hidden md:flex">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white border-[4px] border-slate-900 rounded-2xl px-6 flex items-center justify-center shadow-[8px_8px_0px_0px_#1e293b] hover:bg-rose-50 transition-all"
              >
                <ChevronLeft className="text-slate-900" size={32} strokeWidth={4} />
              </motion.button>
            </Link>
          </div>
          
          <Link href="/calendar/search" className="md:hidden">
            <button className="w-full bg-white border-[4px] border-slate-900 rounded-2xl py-4 font-[1000] uppercase text-sm shadow-[4px_4px_0px_0px_#000] flex items-center justify-center gap-2">
              <ChevronLeft size={20} strokeWidth={4} /> Back to Search
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-20">
          {loading ? (
             <div className="col-span-full flex flex-col items-center py-20 gap-6">
                <div className="w-16 h-16 border-[6px] border-t-rose-600 border-slate-200 rounded-full animate-spin" />
             </div>
          ) : filteredCourses.length > 0 ? (
            <AnimatePresence>
              {filteredCourses.map((course) => (
                <motion.div 
                  key={course.id}
                  layout
                  initial={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8, rotate: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <CourseCard 
                    course={course} 
                    isSavedPage={true} 
                    onActionSuccess={fetchSavedCourses} 
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          ) : (
            <div className="col-span-full bg-white border-[6px] border-dashed border-slate-200 py-24 rounded-[3rem] flex flex-col items-center text-center px-6">
              <Ghost className="text-slate-200 mb-8" size={64} strokeWidth={3} />
              <p className="font-[1000] text-slate-300 uppercase text-2xl italic mb-8">Vault Empty</p>
              <Link href="/calendar/search">
                <button className="px-10 py-5 bg-rose-600 text-white border-[4px] border-slate-900 font-[1000] uppercase italic shadow-[8px_8px_0px_0px_#000] hover:translate-y-[-4px] transition-all">
                  Find Relays
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showSignOutAlert && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowSignOutAlert(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="relative w-full max-w-sm bg-white border-[4px] border-slate-900 p-8 shadow-[12px_12px_0px_0px_#000]"
            >
              <button onClick={() => setShowSignOutAlert(false)} className="absolute top-4 right-4 p-1 hover:bg-slate-100 rounded-lg">
                <X size={20} className="text-slate-900" strokeWidth={3} />
              </button>
              <div className="w-16 h-16 bg-rose-50 border-4 border-slate-900 flex items-center justify-center mb-6 -rotate-6 shadow-[4px_4px_0px_0px_#000]">
                <Info className="text-rose-600" size={32} strokeWidth={3} />
              </div>
              <h3 className="text-3xl font-[1000] text-slate-900 uppercase italic leading-none mb-4">Signing <span className="text-rose-600">out?</span></h3>
              <p className="text-sm font-bold text-slate-600 uppercase tracking-tight mb-8">Are you sure you want to sign out?</p>
              <div className="flex flex-col gap-3">
                <Link href="/signout" className="w-full">
                  <button className="w-full py-4 bg-slate-900 text-white border-4 border-slate-900 font-black uppercase italic shadow-[4px_4px_0px_0px_#f43f5e] hover:translate-y-[-2px] transition-all">Yes, Sign Out</button>
                </Link>
                <button onClick={() => setShowSignOutAlert(false)} className="w-full py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Stay Logged In</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}