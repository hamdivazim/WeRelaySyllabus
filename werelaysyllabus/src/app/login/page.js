"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthForm from "@/components/auth/AuthForm";
import AuthLayout from "@/components/auth/AuthLayout";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");

  const handleLogin = async (e, p) => {
    try {
      setError("");
      await login(e, p);
      router.push("/calendar/saved"); 
    } catch (err) {
      setError("Invalid credentials. Try again!");
    }
  };

  const loginDecor = (
    <>
      <div className="absolute top-20 right-20 w-32 h-32 border-4 border-slate-900 rounded-full bg-cyan-300 -rotate-12 shadow-[8px_8px_0px_0px_#000]" />
    </>
  );

  return (
    <AuthLayout decoration={loginDecor}>
      <AuthForm type="login" onSubmit={handleLogin} error={error} />
      <Link href="/register" className="mt-8 group">
        <p className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-900 group-hover:text-rose-500 transition-colors">
          New Student? <span className="border-b-2 border-rose-400">Join the Relay</span>
        </p>
      </Link>
    </AuthLayout>
  );
}