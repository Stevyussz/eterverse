import NextAuth from 'next-auth';
import { authConfig } from '@/auth.config';

// Initialize NextAuth with Edge-compatible config
export default NextAuth(authConfig).auth;

// Next.js config for the paths that should trigger this middleware
export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};

