import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function CourseHeader({ courseName, eventCount, currentMonthDate, onPrevMonth, onNextMonth, onToday }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4 md:mb-8 shrink-0"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6">
        <div className="space-y-1">
          <div className="bg-indigo-600 text-white px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest w-fit">
            Syllabus
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-[1000] uppercase tracking-tighter leading-[0.85] text-slate-900 italic">
            {courseName || "Calendar"}
          </h1>
          <p className="text-[10px] md:text-sm font-bold text-slate-400 uppercase tracking-widest mt-2">
            {eventCount} Scheduled Events
          </p>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center bg-white border-2 border-slate-900 rounded-xl overflow-hidden shadow-[4px_4px_0px_0px_#1e293b]">
            <button onClick={onPrevMonth} className="px-4 py-2 font-black border-r-2 border-slate-900 hover:bg-slate-50 transition-colors">
                <ChevronLeft size={24} />
            </button>
            <span className="px-6 text-xs font-[1000] uppercase tracking-widest min-w-[180px] text-center">
              {currentMonthDate.toLocaleString('default', { month: "long", year: "numeric" })}
            </span>
            <button onClick={onNextMonth} className="px-4 py-2 font-black border-l-2 border-slate-900 hover:bg-slate-50 transition-colors">
                <ChevronRight size={24} />
            </button>
          </div>
          <button onClick={onToday} className="px-5 py-2 bg-white border-2 border-slate-900 rounded-xl text-sm font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_#1e293b] active:shadow-none active:translate-y-1 transition-all">Today</button>
        </div>
      </div>
      <div className="h-1 w-full bg-slate-900 mt-4 md:mt-6 rounded-full" />
    </motion.div>
  );
}