import Link from "next/link";
import { motion } from "framer-motion";
import { Ghost, Home, ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen w-full bg-[#fdfdfb] flex items-center justify-center p-6 relative overflow-hidden">
      <div 
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
        style={{ backgroundImage: 'linear-gradient(#000 2px, transparent 2px), linear-gradient(90deg, #000 2px, transparent 2px)', backgroundSize: '40px 40px' }} 
      />

      <div className="max-w-2xl w-full relative z-10 text-center">
        <header className="mb-12 relative inline-block">
          <motion.div 
            initial={{ rotate: 5, scale: 0.9 }}
            animate={{ rotate: -2, scale: 1 }}
            className="bg-rose-600 text-white font-[1000] px-6 py-2 border-[4px] border-slate-900 uppercase text-xl mb-8 inline-block shadow-[8px_8px_0px_0px_#000] italic tracking-tighter"
          >
            Error 404
          </motion.div>

        </header>

        <div className="flex justify-center mb-12">
          <motion.div
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="w-32 h-32 md:w-48 md:h-48 bg-white border-[6px] border-slate-900 rounded-[3rem] flex items-center justify-center shadow-[12px_12px_0px_0px_#f43f5e]"
          >
            <Ghost size={80} strokeWidth={3} className="text-slate-900" />
          </motion.div>
        </div>

        <p className="text-xl md:text-2xl font-black text-slate-400 uppercase tracking-widest mb-12 max-w-lg mx-auto leading-tight">
          The page you're looking for has been <span className="text-slate-900 underline decoration-rose-500 decoration-4">dropped</span> or never existed.
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          <Link href="/" className="w-full md:w-auto">
            <motion.button 
              whileHover={{ scale: 1.05, translateY: -4 }}
              whileTap={{ scale: 0.95 }}
              className="w-full px-10 py-5 bg-rose-600 text-white border-[4px] border-slate-900 font-[1000] uppercase italic text-xl shadow-[8px_8px_0px_0px_#000] flex items-center justify-center gap-3 transition-all hover:shadow-[12px_12px_0px_0px_#000]"
            >
              <Home size={24} strokeWidth={3} />
              Go Home
            </motion.button>
          </Link>

          <button 
            onClick={() => window.history.back()}
            className="w-full md:w-auto px-10 py-5 bg-white text-slate-900 border-[4px] border-slate-900 font-[1000] uppercase italic text-xl shadow-[8px_8px_0px_0px_#000] flex items-center justify-center gap-3 transition-all hover:bg-rose-50"
          >
            <ArrowLeft size={24} strokeWidth={3} />
            Back
          </button>
        </div>
      </div>
    </div>
  );
}