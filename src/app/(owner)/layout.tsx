import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";

export default async function OwnerLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  // Middleware also protects this, but just to be safe:
  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  return (
    <div className="flex min-h-screen pt-20 relative z-10">
      
      {/* Sidebar Component */}
      <DashboardSidebar user={{ name: session.user.name, email: session.user.email, image: session.user.image }} />

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 p-6 md:p-8 min-h-screen pt-16 md:pt-8 w-full max-w-full overflow-x-hidden">
        {children}
      </main>
      
    </div>
  );
}
