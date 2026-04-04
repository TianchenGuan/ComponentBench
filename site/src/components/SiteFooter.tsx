import Link from 'next/link';

const footerLinks = [
  { href: 'https://github.com/', label: 'GitHub', external: true },
  { href: '/paper', label: 'Paper', external: false },
  { href: '/docs', label: 'Documentation', external: false },
];

export default function SiteFooter() {
  return (
    <footer className="w-full border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          {/* Branding */}
          <div className="flex flex-col items-center sm:items-start gap-1">
            <p className="text-sm font-semibold text-gray-900">
              ComponentBench
            </p>
            <p className="text-xs text-gray-500">
              Component-level Web Benchmark
            </p>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            {footerLinks.map((link) =>
              link.external ? (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                >
                  {link.label}
                </Link>
              )
            )}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 border-t border-gray-200 pt-4 text-center">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} ComponentBench. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
