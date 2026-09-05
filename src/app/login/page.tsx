import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/LoginForm";

type Props = {
  searchParams: Promise<{ verifyRequest?: string }>;
};

export default async function LoginPage(props: Props) {
  const session = await auth();
  const searchParams = await props.searchParams;

  if (session) {
    redirect("/dashboard");
  }

  const isVerifyRequest = searchParams?.verifyRequest === "true" || searchParams?.verifyRequest === "";

  return (
    <main className="min-h-screen flex items-center justify-center relative px-6 z-10 pt-20 pb-20">
      
      <div className="w-full max-w-md bg-[#050505]/90 backdrop-blur-xl border border-zinc-800 rounded-2xl p-8 shadow-2xl flex flex-col gap-8 relative overflow-hidden">
        
        {!isVerifyRequest && (
          <div className="flex flex-col items-center text-center gap-2 relative z-10">
            <h1 className="text-2xl sm:text-3xl font-display font-semibold text-white tracking-tight">
              Selamat Datang Kembali
            </h1>
            <p className="text-zinc-400 font-body text-sm">
              Masuk untuk mengelola server dan memantau analitik EterVerse.
            </p>
          </div>
        )}

        {/* Animated Client Component Form */}
        <LoginForm isVerifyRequest={isVerifyRequest} />
        
        {!isVerifyRequest && (
          <p className="text-center text-xs text-zinc-500 relative z-10 mt-2 leading-relaxed">
            Dengan masuk, Anda menyetujui Ketentuan Layanan dan Kebijakan Privasi kami.
          </p>
        )}
      </div>
      
    </main>
  );
}
