import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { DiscordLogo, EnvelopeSimple } from "@phosphor-icons/react/dist/ssr";
import { signIn } from "@/auth"; // Server action for auth

export default async function LoginPage() {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen flex items-center justify-center relative px-6 z-10 pt-20 pb-20">
      
      <div className="w-full max-w-md bg-[#050505]/80 backdrop-blur-xl border border-white/10 rounded-xl p-8 shadow-2xl flex flex-col gap-8 relative overflow-hidden">
        
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1/2 bg-eter-cyan/20 blur-[100px] pointer-events-none rounded-full" />
        
        <div className="flex flex-col items-center text-center gap-2 relative z-10">
          <h1 className="text-3xl font-display font-semibold text-eter-starlight tracking-tight">
            Welcome Back
          </h1>
          <p className="text-zinc-400 font-body text-sm">
            Sign in to manage your EterVerse servers.
          </p>
        </div>

        <div className="flex flex-col gap-4 relative z-10">
          
          <form
            action={async () => {
              "use server";
              await signIn("discord", { redirectTo: "/dashboard" });
            }}
          >
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 bg-[#5865F2] hover:bg-[#4752C4] text-white font-medium py-3.5 px-4 rounded-md transition-colors duration-smooth shadow-lg shadow-[#5865F2]/20"
            >
              <DiscordLogo size={22} weight="fill" />
              Continue with Discord
            </button>
          </form>

          <div className="flex items-center gap-4 my-2">
            <div className="flex-1 h-[1px] bg-white/10"></div>
            <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Or use email</span>
            <div className="flex-1 h-[1px] bg-white/10"></div>
          </div>

          <form
            action={async (formData) => {
              "use server";
              await signIn("resend", formData);
            }}
            className="flex flex-col gap-4"
          >
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <EnvelopeSimple size={18} className="text-zinc-500" />
              </div>
              <input
                type="email"
                name="email"
                id="email"
                required
                placeholder="you@example.com"
                className="w-full bg-black/50 border border-white/10 rounded-md py-3 pl-10 pr-4 text-sm text-eter-starlight placeholder:text-zinc-600 focus:outline-none focus:border-eter-cyan/50 focus:ring-1 focus:ring-eter-cyan/50 transition-all duration-smooth"
              />
            </div>
            <button
              type="submit"
              className="w-full flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 text-eter-starlight font-medium py-3 px-4 rounded-md transition-colors duration-smooth"
            >
              Send Magic Link
            </button>
          </form>

        </div>
        
        <p className="text-center text-xs text-zinc-600 relative z-10 mt-4">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
      
    </main>
  );
}
