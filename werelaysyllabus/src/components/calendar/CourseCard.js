"use client";

import Link from "next/link";
import { 
  Flame, BookmarkPlus, Check, 
  Loader2, ArrowUpRight, Trash2 
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useCourseData } from "@/hooks/useCourseData";
import { useAuth } from "@/context/AuthContext";
import { Bookmark, Download as DownloadIcon } from "lucide-react";

export default function CourseCard({ course, variant = "indigo", isSavedPage = false }) {
  const { user } = useAuth();
  const { downloadICS, saveToProfile, removeFromProfile } = useCourseData(course.id);
  const [isSaved, setIsSaved] = useState(user?.savedCourses?.includes(course.id) || isSavedPage);
  const [localLoading, setLocalLoading] = useState(false);

  const currentVariant = isSavedPage ? "rose" : variant;

  const styles = {
    indigo: {
      hoverShadow: "group-hover:shadow-[16px_16px_0px_0px_#6366f1]",
      textHover: "group-hover:text-indigo-600",
      buttonBg: "bg-indigo-600",
      buttonHover: "hover:bg-indigo-500",
    },
    rose: {
      hoverShadow: "group-hover:shadow-[16px_16px_0px_0px_#f43f5e]",
      textHover: "group-hover:text-rose-600",
      buttonBg: "bg-rose-600",
      buttonHover: "hover:bg-rose-500",
    }
  }[currentVariant];

  const handleQuickAction = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user || localLoading) return;
    
    setLocalLoading(true);
    try {
      if (isSavedPage || isSaved) {
        await removeFromProfile();
        setIsSaved(false);
      } else {
        await saveToProfile();
        setIsSaved(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLocalLoading(false);
    }
  };

  const handleQuickDownload = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    downloadICS(course.name);
  };

  return (
    <Link href={`/calendar/${course.id}`} className="group block h-full">
      <motion.div
        whileHover={{ y: -8, x: -4 }}
        className={`h-full bg-white border-[4px] border-slate-900 rounded-[2rem] shadow-[8px_8px_0px_0px_#000] ${styles.hoverShadow} transition-all relative overflow-hidden flex flex-col p-6 md:p-8`}
      >
        <div className="flex justify-between items-start mb-6 relative z-10">
          <div className="flex flex-col gap-2">
            <span className="bg-slate-900 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase self-start">
              {course.university || "Global"}
            </span>
            <div className="flex items-center gap-1.5 bg-yellow-400 border-[3px] border-slate-900 px-2 py-0.5 rounded-lg shadow-[3px_3px_0px_0px_#000] w-fit">
              <Flame size={14} fill="currentColor" strokeWidth={3} />
              <span className="text-xs font-[1000] uppercase">{course.vouched?.length || 0}</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleQuickDownload}
              className="w-12 h-12 bg-white border-[3px] border-slate-900 rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_#000] hover:bg-yellow-300 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#000] active:translate-x-[0px] active:translate-y-[0px] active:shadow-none transition-all"
            >
              <DownloadIcon size={20} strokeWidth={3} />
            </button>

            {user && (
              <button
                onClick={handleQuickAction}
                disabled={localLoading}
                className={`w-12 h-12 border-[3px] border-slate-900 rounded-full flex items-center justify-center transition-all shadow-[4px_4px_0px_0px_#000] group/save
                  ${isSavedPage 
                    ? "bg-white text-slate-900 hover:bg-rose-600 hover:text-white" 
                    : isSaved 
                      ? "bg-emerald-400 text-slate-900 shadow-none translate-x-[2px] translate-y-[2px]" 
                      : `${styles.buttonBg} text-white ${styles.buttonHover} hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#000] active:translate-x-[0px] active:translate-y-[0px] active:shadow-none`
                  }`}
              >
                {localLoading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : isSavedPage ? (
                  <Trash2 size={20} strokeWidth={3} />
                ) : isSaved ? (
                  <Check size={20} strokeWidth={4} />
                ) : (
                  <BookmarkPlus size={20} strokeWidth={3} />
                )}
              </button>
            )}
          </div>
        </div>

        <div className="mt-auto relative z-10">
          <h3 className={`text-4xl font-[1000] uppercase text-slate-900 italic leading-[0.8] tracking-tighter mb-4 ${styles.textHover} transition-colors`}>
            {course.name}
          </h3>
          <div className="flex items-center justify-between">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
              {course.description 
                ? `${course.description.slice(0, 20)}${course.description.length > 20 ? "..." : ""}` 
                : course.code}
            </p>
            <ArrowUpRight size={32} className="text-slate-900 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" strokeWidth={4} />
          </div>
        </div>

        <div className="absolute -bottom-4 -left-4 text-slate-100 font-[1000] text-9xl italic pointer-events-none select-none z-0 opacity-100 uppercase">
          {course.code?.slice(0, 2) || "GO"}
        </div>
      </motion.div>
    </Link>
  );
}