"use client";

import { motion } from "framer-motion";
import { DiscordLogo, EnvelopeSimple, PaperPlaneRight } from "@phosphor-icons/react";
import { useState } from "react";
import { signIn } from "next-auth/react";

export function LoginForm({ isVerifyRequest = false }: { isVerifyRequest?: boolean }) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showVerify, setShowVerify] = useState(isVerifyRequest);

  if (showVerify) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center text-center gap-6 relative z-10 py-10"
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
          className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center border border-zinc-800 shadow-xl"
        >
          <PaperPlaneRight size={32} weight="duotone" className="text-white" />
        </motion.div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-display font-semibold text-white">Cek Email Anda</h2>
          <p className="text-zinc-400 font-body text-sm max-w-[280px]">
            Tautan masuk (magic link) telah dikirim ke inbox Anda. Klik tautan tersebut untuk masuk ke EterVerse.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col gap-4 relative z-10 w-full"
    >
      
      <button
        type="button"
        onClick={() => signIn("discord", { callbackUrl: "/dashboard" })}
        className="w-full flex items-center justify-center gap-3 bg-[#5865F2] hover:bg-[#4752C4] text-white font-medium py-3.5 px-4 rounded-lg transition-colors duration-200"
      >
        <DiscordLogo size={22} weight="fill" />
        Lanjutkan dengan Discord
      </button>

      <div className="flex items-center gap-4 my-2">
        <div className="flex-1 h-[1px] bg-zinc-800"></div>
        <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">Atau gunakan email</span>
        <div className="flex-1 h-[1px] bg-zinc-800"></div>
      </div>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setIsSubmitting(true);
          const res = await signIn("resend", { email, callbackUrl: "/dashboard", redirect: false });
          if (res?.ok && !res?.error) {
            setShowVerify(true);
          } else {
            setIsSubmitting(false);
          }
        }}
        className="flex flex-col gap-4"
      >
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <EnvelopeSimple size={18} className="text-zinc-500" />
          </div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="kamu@contoh.com"
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-3 pl-10 pr-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-all duration-200"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center bg-white text-zinc-950 hover:bg-zinc-200 font-medium py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50"
        >
          {isSubmitting ? "Mengirim..." : "Kirim Tautan Masuk"}
        </button>
      </form>

    </motion.div>
  );
}
