import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  const isBenchmarkBuild = process.env.BENCHMARK_BUILD === '1';
  const isLogEnabled = process.env.LOG_VIEWER_ENABLED === 'true';

  const isLogPath = pathname.startsWith('/logs') || pathname.startsWith('/api/logs');
  const isLogMode = searchParams.get('mode') === 'log';

  if (!isLogPath && !isLogMode) {
    return NextResponse.next();
  }

  if (isBenchmarkBuild || !isLogEnabled) {
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
