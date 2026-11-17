"use client";

import { DiscordLogo } from "@phosphor-icons/react";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { PixelIcon } from "@/components/pixel/PixelIcon";
import { Sprite } from "@/components/pixel/PixelArt";

export function LoginForm({
  isVerifyRequest = false,
  callbackUrl = "/dashboard",
}: {
  isVerifyRequest?: boolean;
  callbackUrl?: string;
}) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showVerify, setShowVerify] = useState(isVerifyRequest);
  const [emailError, setEmailError] = useState("");

  if (showVerify) {
    return (
      <div className="flex flex-col items-center text-center gap-5 py-6 px-pop" role="status">
        <Sprite name="chestOpen" size={64} />
        <h2 className="px-title text-2xl text-ink">Cek email kamu</h2>
        <p className="text-ink-2 text-sm max-w-[300px]">
          Tautan masuk sudah dikirim ke inbox kamu. Klik tautannya untuk masuk ke EterVerse. Cek folder spam kalau belum muncul.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Discord brand button keeps Discord's own mark (brand exception in DESIGN-ETERVERSE.md). */}
      <button type="button" onClick={() => signIn("discord", { callbackUrl })} className="px-btn px-btn-discord px-btn-block">
        <DiscordLogo size={20} weight="fill" aria-hidden />
        Lanjutkan dengan Discord
      </button>

      <div className="flex items-center gap-3">
        <div className="flex-1 border-t-2 border-dashed border-ink/20" />
        <span className="text-xs text-ink-2">atau pakai email</span>
        <div className="flex-1 border-t-2 border-dashed border-ink/20" />
      </div>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setIsSubmitting(true);
          setEmailError("");
          try {
            const res = await signIn("resend", { email, callbackUrl, redirect: false });
            if (res?.ok && !res?.error) {
              setShowVerify(true);
              return;
            }
            setEmailError("Tautan gagal dikirim. Cek alamat email, atau masuk dengan Discord.");
          } catch {
            setEmailError("Koneksi bermasalah. Coba lagi sebentar lagi.");
          }
          setIsSubmitting(false);
        }}
        className="flex flex-col gap-4"
      >
        <label htmlFor="login-email" className="sr-only">Alamat email</label>
        <div className="relative">
          <PixelIcon name="mail" size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-2" />
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            placeholder="kamu@contoh.com"
            aria-invalid={!!emailError}
            className="px-input !pl-10"
          />
        </div>
        <button type="submit" disabled={isSubmitting} className="px-btn px-btn-block">
          {isSubmitting ? (
            <>
              <PixelIcon name="refresh" size={14} className="px-spin" /> Mengirim
            </>
          ) : (
            "Kirim tautan masuk"
          )}
        </button>
        {emailError && (
          <p role="alert" className="px-note px-note-error text-sm px-shake">
            {emailError}
          </p>
        )}
      </form>
    </div>
  );
}
