import type { NextAuthConfig } from "next-auth";

// This file contains the Auth configuration that is Edge compatible.
// It does NOT contain the MongoDB adapter.
export const authConfig = {
  pages: {
    signIn: "/login",
  },
  providers: [
    // Providers will be merged in auth.ts, but we define an empty array here
    // to satisfy the NextAuthConfig type if needed, or we can define them in auth.ts.
    // However, some edge logic might need provider info, so we can define them here.
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isProtectedPath = nextUrl.pathname.startsWith('/dashboard') || nextUrl.pathname.startsWith('/admin');
      
      if (isProtectedPath) {
        if (isLoggedIn) return true;
        return false; // Redirects to login
      }
      return true;
    }
  }
} satisfies NextAuthConfig;
