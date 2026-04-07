'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/benchmark', label: 'Benchmark' },
  { href: '/compare', label: 'Compare' },
  { href: '/results', label: 'Results' },
  { href: '/tasklab', label: 'Task Lab' },
  { href: '/docs', label: 'Docs' },
  { href: '/paper', label: 'Paper' },
];

const benchModes = [
  { key: 'presentation', label: 'Presentation', color: 'text-emerald-600 border-emerald-500 bg-emerald-50' },
  { key: 'benchmark', label: 'Benchmark', color: 'text-orange-600 border-orange-500 bg-orange-50' },
];

export default function SiteNav() {
  return (
    <Suspense fallback={<SiteNavFallback />}>
      <SiteNavInner />
    </Suspense>
  );
}

function SiteNavFallback() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <span className="flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-slate-900 text-white text-sm font-bold">C</span>
            <span className="text-lg font-bold text-gray-900 tracking-tight">ComponentBench</span>
          </span>
        </div>
      </div>
    </nav>
  );
}

function SiteNavInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const isBenchmarkPage = pathname === '/benchmark';

  // Determine current bench mode
  const currentMode = searchParams.get('viewMode') === 'benchmark'
    ? 'benchmark'
    : 'presentation';

  // Preserve bench version param when switching modes
  const benchParam = searchParams.get('bench');
  const buildModeHref = (mode: typeof benchModes[number]) => {
    const params = new URLSearchParams();
    if (benchParam) params.set('bench', benchParam);
    if (mode.key === 'benchmark') params.set('viewMode', 'benchmark');
    const qs = params.toString();
    return `/benchmark${qs ? `?${qs}` : ''}`;
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-slate-900 text-white text-sm font-bold">
              C
            </span>
            <span className="text-lg font-bold text-gray-900 tracking-tight">
              ComponentBench
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    'relative px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900',
                    isActive(link.href) &&
                      'text-gray-900 after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:bg-slate-900 after:rounded-full'
                  )}
                >
                  {link.label}
                </Button>
              </Link>
            ))}

            {/* Mode switcher — visible on /benchmark */}
            {isBenchmarkPage && (
              <>
                <div className="mx-2 h-5 w-px bg-gray-200" />
                {benchModes.map((mode) => (
                  <Link key={mode.key} href={buildModeHref(mode)}>
                    <button
                      className={cn(
                        'px-2.5 py-1 text-xs font-semibold rounded-md border transition-colors',
                        currentMode === mode.key
                          ? mode.color
                          : 'text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-50'
                      )}
                    >
                      {mode.label}
                    </button>
                  </Link>
                ))}
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-slate-500"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-2 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'block rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive(link.href)
                    ? 'bg-slate-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                {link.label}
              </Link>
            ))}
            {isBenchmarkPage && (
              <div className="border-t border-gray-100 pt-2 mt-2">
                <p className="px-3 pb-1 text-xs font-semibold text-gray-400 uppercase">View Mode</p>
                {benchModes.map((mode) => (
                  <Link
                    key={mode.key}
                    href={buildModeHref(mode)}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'block rounded-md px-3 py-2 text-sm font-medium transition-colors',
                      currentMode === mode.key
                        ? 'bg-slate-100 text-gray-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    )}
                  >
                    {mode.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
