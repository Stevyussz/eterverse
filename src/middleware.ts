import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/auth';

export async function middleware(request: NextRequest) {
  // This middleware protects the owner and admin routes
  const session = await auth();
  const { pathname } = request.nextUrl;

  const isProtectedPath = pathname.startsWith('/dashboard') || pathname.startsWith('/admin');

  if (isProtectedPath && !session) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', encodeURI(pathname));
    return NextResponse.redirect(loginUrl);
  }

  // TODO: Add strict role-based access checks (Owner vs Admin) once user roles are implemented in DB.

  return NextResponse.next();
}

// Next.js config for the paths that should trigger this middleware
export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};
