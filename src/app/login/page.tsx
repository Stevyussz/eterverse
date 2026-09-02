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
      
      <div className="w-full max-w-md bg-[#050505]/80 backdrop-blur-xl border border-white/10 rounded-xl p-8 shadow-2xl flex flex-col gap-8 relative overflow-hidden">
        
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1/2 bg-eter-cyan/20 blur-[100px] pointer-events-none rounded-full" />
        
        {!isVerifyRequest && (
          <div className="flex flex-col items-center text-center gap-2 relative z-10">
            <h1 className="text-3xl font-display font-semibold text-eter-starlight tracking-tight">
              Welcome Back
            </h1>
            <p className="text-zinc-400 font-body text-sm">
              Sign in to manage your EterVerse servers.
            </p>
          </div>
        )}

        {/* Animated Client Component Form */}
        <LoginForm isVerifyRequest={isVerifyRequest} />
        
        {!isVerifyRequest && (
          <p className="text-center text-xs text-zinc-600 relative z-10 mt-4">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        )}
      </div>
      
    </main>
  );
}
