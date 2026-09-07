"use client";
import { useState } from "react";
import Link from "next/link";
import { Mail, Phone, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { publicEnv, hasSupabaseEnv } from "@/lib/env";

type Mode = "login" | "signup";

export function AuthCard({ mode }: { mode: Mode }) {
  const [busy,setBusy]=useState(false); const [message,setMessage]=useState<string|null>(null); const [phoneMode,setPhoneMode]=useState(false); const [phone,setPhone]=useState("+251"); const [otp,setOtp]=useState(""); const [otpSent,setOtpSent]=useState(false);
  const next = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("next") || "/dashboard" : "/dashboard";

  async function emailSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); if(!hasSupabaseEnv){setMessage("Connect Supabase first. See .env.example and README.md.");return;}
    setBusy(true); setMessage(null); const fd=new FormData(event.currentTarget); const email=String(fd.get("email")); const password=String(fd.get("password")); const supabase=createClient();
    const result = mode === "signup" ? await supabase.auth.signUp({email,password,options:{emailRedirectTo:`${publicEnv.NEXT_PUBLIC_APP_URL}/auth/callback?next=/onboarding`}}) : await supabase.auth.signInWithPassword({email,password});
    setBusy(false); if(result.error){setMessage(result.error.message);return;} if(mode==="signup"){setMessage("Check your email to verify your account.");} else {window.location.assign(next);}
  }

  async function google(){if(!hasSupabaseEnv){setMessage("Connect Supabase first.");return;} const supabase=createClient(); await supabase.auth.signInWithOAuth({provider:"google",options:{redirectTo:`${publicEnv.NEXT_PUBLIC_APP_URL}/auth/callback?next=${encodeURIComponent(mode==="signup"?"/onboarding":next)}`}});}
  async function magic(email:string){if(!hasSupabaseEnv){setMessage("Connect Supabase first.");return;} setBusy(true); const {error}=await createClient().auth.signInWithOtp({email,options:{emailRedirectTo:`${publicEnv.NEXT_PUBLIC_APP_URL}/auth/callback?next=${encodeURIComponent(next)}`}}); setBusy(false); setMessage(error?.message||"Magic link sent. Check your email.");}
  async function sendPhone(){if(!/^\+251\d{9}$/.test(phone)){setMessage("Use an Ethiopian number in the format +2519XXXXXXXX.");return;} if(!hasSupabaseEnv){setMessage("Connect Supabase and configure an SMS provider first.");return;} setBusy(true); const {error}=await createClient().auth.signInWithOtp({phone}); setBusy(false); if(error){setMessage(error.message);return;} setOtpSent(true);setMessage("Verification code sent.");}
  async function verifyPhone(){if(!hasSupabaseEnv)return; setBusy(true); const {error}=await createClient().auth.verifyOtp({phone,token:otp,type:"sms"});setBusy(false);if(error){setMessage(error.message);return;}window.location.assign(mode==="signup"?"/onboarding":next);}

  return <div className="card soft-shadow w-full max-w-md p-6 sm:p-8"><h1 className="text-3xl font-semibold tracking-[-.04em]">{mode==="signup"?"Create your Linqo":"Welcome back"}</h1><p className="mt-2 text-sm text-[#68716c]">{mode==="signup"?"Your identity starts with one secure account.":"Sign in to manage your page."}</p>
    {message&&<div role="status" className="mt-5 rounded-2xl border border-black/10 bg-[#f6f7f3] p-3 text-sm text-[#4f5954]">{message}</div>}
    {!phoneMode?<>
      <form onSubmit={emailSubmit} className="mt-6 space-y-4"><label className="block text-sm font-semibold">Email<input name="email" type="email" autoComplete="email" required className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 font-normal"/></label><label className="block text-sm font-semibold">Password<input name="password" type="password" minLength={8} autoComplete={mode==="signup"?"new-password":"current-password"} required className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 font-normal"/></label><button disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-full bg-[#135d44] px-5 py-3 text-sm font-semibold text-white">{busy&&<Loader2 className="animate-spin" size={16}/>} {mode==="signup"?"Create account":"Sign in"}</button></form>
      <div className="my-5 flex items-center gap-3 text-xs text-[#8a918d]"><span className="h-px flex-1 bg-black/10"/>OR<span className="h-px flex-1 bg-black/10"/></div>
      <div className="grid gap-2"><button onClick={google} className="rounded-full border border-black/10 bg-white px-4 py-3 text-sm font-semibold">Continue with Google</button><button onClick={()=>setPhoneMode(true)} className="flex items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-4 py-3 text-sm font-semibold"><Phone size={16}/>Use +251 phone</button><button onClick={()=>{const email=window.prompt("Email address");if(email)void magic(email)}} className="flex items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-4 py-3 text-sm font-semibold"><Mail size={16}/>Email me a magic link</button></div>
    </>:<div className="mt-6 space-y-4"><label className="block text-sm font-semibold">Ethiopian phone number<input value={phone} onChange={e=>setPhone(e.target.value.replace(/\s/g,""))} className="mt-2 w-full rounded-2xl border border-black/10 px-4 py-3 font-normal"/></label>{otpSent&&<label className="block text-sm font-semibold">Verification code<input inputMode="numeric" value={otp} onChange={e=>setOtp(e.target.value)} className="mt-2 w-full rounded-2xl border border-black/10 px-4 py-3 font-normal"/></label>}<button onClick={otpSent?verifyPhone:sendPhone} disabled={busy} className="w-full rounded-full bg-[#135d44] px-5 py-3 text-sm font-semibold text-white">{otpSent?"Verify code":"Send code"}</button><button onClick={()=>setPhoneMode(false)} className="w-full rounded-full px-5 py-3 text-sm font-semibold text-[#5e6762]">Use email instead</button></div>}
    <div className="mt-6 flex items-center justify-between text-sm"><span className="text-[#68716c]">{mode==="signup"?"Already have an account?":"New to Linqo?"}</span><Link className="font-semibold text-[#135d44]" href={mode==="signup"?"/login":"/signup"}>{mode==="signup"?"Sign in":"Create account"}</Link></div>{mode==="login"&&<Link href="/forgot-password" className="mt-4 block text-center text-xs font-semibold text-[#68716c]">Forgot password?</Link>}
  </div>;
}
