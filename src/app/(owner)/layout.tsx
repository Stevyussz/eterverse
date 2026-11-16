import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";

export default async function OwnerLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  // Middleware also protects this, but just to be safe:
  if (!session?.user) {
    // Our own login page (the bare next-auth page was unstyled and lost the destination).
    redirect("/login?callbackUrl=/dashboard");
  }

  return (
    // pt-16 matches the fixed 64px app navbar exactly; there is no second mobile bar anymore.
    // No z-index here: it would trap the mobile drawer in a stacking context under the navbar.
    <div className="flex min-h-screen pt-16 relative">
      <DashboardSidebar user={{ name: session.user.name, email: session.user.email, image: session.user.image }} />

      <main className="flex-1 min-w-0 md:ml-64 px-4 py-6 sm:px-6 md:p-8 min-h-screen overflow-x-hidden">
        {children}
      </main>
      
    </div>
  );
}
