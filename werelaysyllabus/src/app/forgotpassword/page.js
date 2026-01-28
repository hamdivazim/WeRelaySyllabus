"use client";

import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Link from "next/link";
import AuthLayout from "@/components/auth/AuthLayout";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Check your inbox for reset instructions!");
    } catch (err) {
      setError("We couldn't find an account with that email.");
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md bg-white border-[4px] border-slate-900 shadow-[8px_8px_0px_0px_#000] p-8 md:p-10">
        <h2 className="text-4xl font-[1000] text-slate-900 uppercase italic leading-none mb-4">
          Reset <br /> <span className="text-indigo-600">Access</span>
        </h2>
        
        <p className="text-xs font-bold text-slate-500 uppercase tracking-tight mb-8">
          Lost your key? Enter your email and we'll send a relay to get you back in.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email Address</label>
            <input 
              type="email" 
              required 
              className="w-full bg-transparent border-b-4 border-slate-100 focus:border-indigo-500 py-2 text-lg font-bold outline-none transition-all"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {message && (
            <div className="p-3 bg-green-50 border-l-4 border-green-500 text-green-700 font-black text-[10px] uppercase italic">
              {message}
            </div>
          )}

          {error && (
            <div className="p-3 bg-rose-50 border-l-4 border-rose-500 text-rose-600 font-black text-[10px] uppercase italic">
              {error}
            </div>
          )}

          <button 
            type="submit"
            className="group w-full py-4 bg-slate-900 text-white font-[1000] text-lg uppercase italic tracking-tighter shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-4px] hover:translate-x-[-4px] active:translate-y-[0px] active:translate-x-[0px] active:shadow-none transition-all flex items-center justify-center gap-2"
          >
            <span>Send Reset Link</span>
            <ChevronRight className="w-6 h-6 stroke-[3px] group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t-2 border-slate-100">
          <Link 
            href="/login" 
            className="group flex items-center justify-center gap-1 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 stroke-[3px] group-hover:-translate-x-1 transition-transform" /> 
            <span>Back to Login</span>
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}