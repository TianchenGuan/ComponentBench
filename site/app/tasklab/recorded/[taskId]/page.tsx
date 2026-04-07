'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function RecordedContent({ taskId }: { taskId: string }) {
  const searchParams = useSearchParams();
  const status = searchParams.get('status') || 'SUCCESS';
  const runId = searchParams.get('runId') || '';
  const isSuccess = status === 'SUCCESS';

  return (
    <div className="mx-auto max-w-2xl px-6 py-20">
      <div className="rounded-lg border border-gray-200 bg-white p-10 text-center shadow-sm">
        <div
          className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full text-3xl ${
            isSuccess ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
          }`}
        >
          {isSuccess ? '✓' : '!'}
        </div>
        <h1 className="text-2xl font-bold text-gray-900">
          {isSuccess ? 'Human trace recorded' : `Recording ended (${status})`}
        </h1>
        <p className="mt-3 text-sm text-gray-600">
          {isSuccess ? (
            <>
              Both <b>cold</b> and <b>warm</b> passes for{' '}
              <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs">{taskId}</code> have been
              saved. Your task is now <b>waiting for review</b> before it gets published to the
              public benchmark.
            </>
          ) : (
            <>
              The recording for{' '}
              <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs">{taskId}</code> did not
              complete successfully. You can try again from the Task Lab.
            </>
          )}
        </p>
        {runId && (
          <p className="mt-4 text-xs text-gray-500">
            Run ID: <code>{runId}</code>
          </p>
        )}

        <div className="mt-8 flex items-center justify-center gap-3">
          <Link
            href="/tasklab"
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Back to Task Lab
          </Link>
          <Link
            href={`/playground/${taskId}`}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            View task
          </Link>
          {isSuccess && (
            <Link
              href={`/playground/${taskId}?record=1&runId=tasklab_${taskId}_${Date.now()}`}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Re-record
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default function RecordedPage({ params }: { params: { taskId: string } }) {
  return (
    <Suspense fallback={<div className="p-10 text-center text-sm text-gray-500">Loading…</div>}>
      <RecordedContent taskId={params.taskId} />
    </Suspense>
  );
}
