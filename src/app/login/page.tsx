import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/LoginForm";
import { VerseScene } from "@/components/pixel/VerseScene";
import { LogoMark } from "@/components/pixel/Logo";

type Props = {
  searchParams: Promise<{ verifyRequest?: string; callbackUrl?: string }>;
};

import { safeCallback, siteOriginsFromEnv } from "@/lib/safe-callback";

export default async function LoginPage(props: Props) {
  const session = await auth();
  const searchParams = await props.searchParams;
  const callbackUrl = safeCallback(searchParams?.callbackUrl, siteOriginsFromEnv());
  const isPlayerLogin = callbackUrl.startsWith("/server/");

  if (session) {
    redirect(callbackUrl);
  }

  const isVerifyRequest = searchParams?.verifyRequest === "true" || searchParams?.verifyRequest === "";

  return (
    <main className="min-h-screen flex items-center justify-center relative px-4 pt-24 pb-16 bg-sky">
      <VerseScene className="absolute inset-x-0 bottom-0 w-full h-[140px] sm:h-[200px] only-light" />
        <VerseScene variant="nether" className="absolute inset-x-0 bottom-0 w-full h-[140px] sm:h-[200px] only-nether" />
      
      <div className="w-full max-w-md px-panel p-6 sm:p-8 flex flex-col gap-7 relative z-10 px-pop">
        
        {!isVerifyRequest && (
          <div className="flex flex-col items-center text-center gap-2 relative z-10">
            <LogoMark size={64} />
            <h1 className="px-title px-title-shadow text-3xl text-ink">Masuk ke EterVerse</h1>
            <p className="text-ink-2 text-sm">
              {isPlayerLogin
                ? "Masuk untuk vote dan memberi rating server. Satu akun, satu vote per hari."
                : "Masuk untuk mengelola server dan memantau analitik EterVerse."}
            </p>
          </div>
        )}

        {/* Animated Client Component Form */}
        <LoginForm isVerifyRequest={isVerifyRequest} callbackUrl={callbackUrl} />
        
        {!isVerifyRequest && (
          <p className="text-center text-xs text-ink-2 leading-relaxed">
            Dengan masuk, Anda menyetujui Ketentuan Layanan dan Kebijakan Privasi kami.
          </p>
        )}
      </div>
      
    </main>
  );
}
