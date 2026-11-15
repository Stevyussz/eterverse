import { auth } from "@/auth";

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const admins = (process.env.ADMIN_EMAILS || "").split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);
  return admins.includes(email.toLowerCase());
}

/**
 * Server actions are public POST endpoints. The middleware guards the /admin pages, but
 * Next.js asks every action to check auth itself because middleware can be bypassed.
 */
export async function requireAdmin() {
  const session = await auth();
  if (!isAdminEmail(session?.user?.email)) {
    throw new Error("Unauthorized");
  }
  return session!;
}
