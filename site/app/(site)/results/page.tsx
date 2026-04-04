'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';

const LogModeDashboard = dynamic(() => import('@/components/LogModeDashboard'), { ssr: false });

function ResultsContent() {
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') || 'overview';

  return (
    <div style={{ minHeight: '80vh' }}>
      {/* Tab bar */}
      <div style={{
        borderBottom: '1px solid #e8e8e8',
        padding: '12px 24px',
        display: 'flex',
        gap: 8,
        background: '#fff',
      }}>
        {[
          { key: 'overview', label: 'Overview' },
          { key: 'logs', label: 'Logs' },
        ].map(t => (
          <a
            key={t.key}
            href={`/results${t.key === 'overview' ? '' : `?tab=${t.key}`}`}
            style={{
              padding: '8px 16px',
              borderRadius: 6,
              fontSize: 14,
              fontWeight: 600,
              textDecoration: 'none',
              background: tab === t.key ? '#f0f0f0' : 'transparent',
              color: tab === t.key ? '#111' : '#666',
              border: tab === t.key ? '1px solid #d9d9d9' : '1px solid transparent',
            }}
          >
            {t.label}
          </a>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
        {tab === 'logs' ? (
          <LogModeDashboard selectedLib="all" benchVersion="v1" />
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Results Overview</h1>
            <p className="text-gray-500 mb-1">Aggregate benchmark results across models and observation spaces</p>
            <p className="text-sm text-gray-400">Full leaderboard and run browser coming soon</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '80vh' }} />}>
      <ResultsContent />
    </Suspense>
  );
}
