"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthForm from "@/components/auth/AuthForm";
import AuthLayout from "@/components/auth/AuthLayout";

export default function RegisterPage() {
  const { signup } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (email, password) => {
    setLoading(true);
    setError("");
    try {
      await signup(email, password);
      router.push("/calendar/search");
    } catch (err) {
      const message = err.code === "auth/email-already-in-use" 
        ? "That email is already taken!" 
        : err.code === "auth/invalid-email"
        ? "The email address is incorrectly formatted."
        : err.code === "auth/weak-password"
        ? "This password is too weak!"
        : "Something went wrong. Try again later.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const registerDecor = (
    <>
      <div className="absolute top-20 left-20 w-32 h-32 border-4 border-slate-900 rounded-full bg-yellow-300 -rotate-12 shadow-[8px_8px_0px_0px_#000]" />
      <div className="absolute bottom-20 right-20 w-40 h-12 border-4 border-slate-900 bg-rose-400 rotate-6 shadow-[8px_8px_0px_0px_#000] flex items-center justify-center">
        <span className="font-black italic uppercase text-white text-xs tracking-widest">Join Now</span>
      </div>
    </>
  );

  return (
    <AuthLayout decoration={registerDecor}>
      <AuthForm 
        type="register" 
        onSubmit={handleRegister} 
        error={error} 
        isLoading={loading} 
      />
      
      <div className="mt-8 flex flex-col items-center gap-3">
        <Link href="/login" className="group">
          <p className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-900 group-hover:text-indigo-600 transition-colors">
            Already a member? <span className="border-b-2 border-indigo-500">Log In</span>
          </p>
        </Link>

        <Link href="/forgotpassword" title="Recover your access">
          <p className="text-[9px] font-bold uppercase tracking-tighter text-slate-400 hover:text-slate-900 transition-colors">
            Lost your key? <span className="underline decoration-slate-300 underline-offset-2">Recover Password</span>
          </p>
        </Link>
      </div>
    </AuthLayout>
  );
}