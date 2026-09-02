import type { NextAuthConfig } from "next-auth";

// This file contains the Auth configuration that is Edge compatible.
// It does NOT contain the MongoDB adapter.
export const authConfig = {
  pages: {
    signIn: "/login",
    verifyRequest: "/login?verifyRequest=true",
  },
  providers: [
    // Providers will be merged in auth.ts, but we define an empty array here
    // to satisfy the NextAuthConfig type if needed, or we can define them in auth.ts.
    // However, some edge logic might need provider info, so we can define them here.
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAdminPath = nextUrl.pathname.startsWith('/admin');
      const isDashboardPath = nextUrl.pathname.startsWith('/dashboard');
      
      if (isAdminPath) {
        if (!isLoggedIn) return false; // Redirect to login
        
        // Admin security check
        const adminEmails = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(',').map(e => e.trim()) : [];
        const isUserAdmin = auth?.user?.email && adminEmails.includes(auth.user.email);
        
        if (!isUserAdmin) {
          return Response.redirect(new URL('/dashboard', nextUrl));
        }
        return true;
      }

      if (isDashboardPath) {
        if (isLoggedIn) return true;
        return false; // Redirects to login
      }
      
      return true;
    }
  }
} satisfies NextAuthConfig;
