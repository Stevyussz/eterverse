"use client";

import { motion } from "framer-motion";
import { DiscordLogo, EnvelopeSimple, PaperPlaneRight } from "@phosphor-icons/react";
import { useState } from "react";
import { signIn } from "next-auth/react";

export function LoginForm({ isVerifyRequest = false }: { isVerifyRequest?: boolean }) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isVerifyRequest) {
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
          className="w-20 h-20 bg-eter-cyan/10 rounded-full flex items-center justify-center border border-eter-cyan/20 shadow-[0_0_30px_rgba(34,211,238,0.2)]"
        >
          <PaperPlaneRight size={36} weight="duotone" className="text-eter-cyan" />
        </motion.div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-display font-semibold text-eter-starlight">Check your email</h2>
          <p className="text-zinc-400 font-body text-sm max-w-[280px]">
            A magic sign-in link has been sent to your inbox. Click the link to log in to EterVerse.
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
        className="w-full flex items-center justify-center gap-3 bg-[#5865F2] hover:bg-[#4752C4] text-white font-medium py-3.5 px-4 rounded-md transition-colors duration-smooth shadow-lg shadow-[#5865F2]/20"
      >
        <DiscordLogo size={22} weight="fill" />
        Continue with Discord
      </button>

      <div className="flex items-center gap-4 my-2">
        <div className="flex-1 h-[1px] bg-white/10"></div>
        <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Or use email</span>
        <div className="flex-1 h-[1px] bg-white/10"></div>
      </div>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setIsSubmitting(true);
          await signIn("resend", { email, callbackUrl: "/dashboard" });
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
            placeholder="you@example.com"
            className="w-full bg-black/50 border border-white/10 rounded-md py-3 pl-10 pr-4 text-sm text-eter-starlight placeholder:text-zinc-600 focus:outline-none focus:border-eter-cyan/50 focus:ring-1 focus:ring-eter-cyan/50 transition-all duration-smooth"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 text-eter-starlight font-medium py-3 px-4 rounded-md transition-colors duration-smooth disabled:opacity-50"
        >
          {isSubmitting ? "Sending..." : "Send Magic Link"}
        </button>
      </form>

    </motion.div>
  );
}
