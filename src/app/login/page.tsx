"use client";
import {useState} from "react";
import {supabase} from "@/lib/supabase";
export default function Login(){
 const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [busy,setBusy]=useState(false); const [error,setError]=useState("");
 async function submit(e:React.FormEvent){e.preventDefault();setBusy(true);setError("");const {error}=await supabase.auth.signInWithPassword({email,password});setBusy(false);if(error)setError(error.message);else window.location.href="/dashboard";}
 return <main className="login-wrap"><form className="login-card" onSubmit={submit}><div style={{
  width: "80px",
  height: "80px",
  minWidth: "80px",
  maxWidth: "80px",
  overflow: "hidden",
  display: "block",
  marginBottom: "18px"
}}>
  <img
    src="/zeb-logo.png"
    alt="ZEB Construction logo"
    style={{
      width: "80px",
      height: "80px",
      minWidth: "80px",
      maxWidth: "80px",
      objectFit: "contain",
      display: "block"
    }}
  />
</div><p className="eyebrow">ZEB CONSTRUCTION</p><h1>Welcome back</h1><p className="muted">Sign in to manage your construction projects.</p><label>Email address</label><input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="admin@example.com"/><label>Password</label><input type="password" required value={password} onChange={e=>setPassword(e.target.value)} placeholder="Your password"/>{error&&<p className="error">{error}</p>}<button disabled={busy}>{busy?"Signing in...":"Sign in"}</button><small>Ask your administrator to create your account.</small></form></main>
}
