import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = [
  '/',
  '/login',
  '/signup',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
];

const PROTECTED_PREFIXES = [
  '/dashboard',
  '/inbox',
  '/contacts',
  '/workflows',
  '/settings',
  '/billing',
  '/analytics',
  '/onboarding',
  '/team',
  '/security',
  '/templates',
  '/design-system',
];

function hasSession(req: NextRequest): boolean {
  const cookieToken = req.cookies.get('token')?.value;
  const authHeader = req.headers.get('authorization');
  return Boolean(cookieToken || authHeader?.startsWith('Bearer '));
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/public') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  const isPublic = PUBLIC_PATHS.some(
    (p) => pathname === p || (p !== '/' && pathname.startsWith(p)),
  );

  if (isPublic) {
    return NextResponse.next();
  }

  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));

  if (isProtected && !hasSession(req)) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
