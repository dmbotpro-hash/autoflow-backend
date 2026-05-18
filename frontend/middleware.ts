import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public routes
  if (
    pathname === '/login' ||
    pathname === '/signup' ||
    pathname === '/' ||
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/inbox') ||
    pathname.startsWith('/contacts') ||
    pathname.startsWith('/workflows') ||
    pathname.startsWith('/settings') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/public')
  ) {
    return NextResponse.next();
  }

  // Minimal protection placeholder.
  // Replace with cookie/JWT verification that matches your backend.
  const hasSession = Boolean(req.cookies.get('token')?.value || req.headers.get('authorization'));
  if (!hasSession) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

