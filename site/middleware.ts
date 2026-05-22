import { NextRequest, NextResponse } from 'next/server';

/**
 * Middleware gate for the log viewer.
 *
 * In the public ComponentBench site the log viewer is always available so
 * users can browse runs they record locally. The only escape hatch is
 * BENCHMARK_BUILD=1 (static benchmark builds with no log backend), which
 * forces /api/logs/* and ?mode=log to 404.
 */
export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  const isLogPath = pathname.startsWith('/logs') || pathname.startsWith('/api/logs');
  const isLogMode = searchParams.get('mode') === 'log';

  if (!isLogPath && !isLogMode) {
    return NextResponse.next();
  }

  if (process.env.BENCHMARK_BUILD === '1') {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'not_found' }, { status: 404 });
    }
    return NextResponse.rewrite(new URL('/404', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/logs/:path*',
    '/api/logs/:path*',
    '/',
    '/task/:path*',
  ],
};
