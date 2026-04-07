'use client';

import React, { useCallback, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

const RecordOverlay = dynamic(() => import('@/components/RecordOverlay'), { ssr: false });

interface TaskSpec {
  task_id: string;
  title?: string | null;
  browsergym_goal?: string;
  [key: string]: unknown;
}

function PlaygroundNotFound() {
  return (
    <div style={{ padding: 24 }}>
      <h2>Playground task component not found</h2>
      <p>The component file has not been generated yet, or generation failed.</p>
    </div>
  );
}

export default function PlaygroundTaskPage({
  params,
}: {
  params: { taskId: string };
}) {
  const { taskId } = params;
  const router = useRouter();
  const searchParams = useSearchParams();
  const isRecordMode = searchParams.get('record') === '1';
  const recordRunId = searchParams.get('runId') || '';
  const recordPass = Number(searchParams.get('pass') || '1');
  const [spec, setSpec] = useState<TaskSpec | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);

  const handleRecordFinalized = useCallback((status: 'SUCCESS' | 'SKIPPED' | 'ABORTED') => {
    if (status !== 'SUCCESS') {
      router.push(`/tasklab/recorded/${taskId}?status=${status}`);
      return;
    }
    if (recordPass === 1) {
      // Advance to warm pass
      const params = new URLSearchParams({ record: '1', runId: recordRunId, pass: '2' });
      router.replace(`/playground/${taskId}?${params.toString()}`);
      return;
    }
    router.push(`/tasklab/recorded/${taskId}?status=SUCCESS&runId=${encodeURIComponent(recordRunId)}`);
  }, [router, taskId, recordPass, recordRunId]);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/tasklab/get-task/${encodeURIComponent(taskId)}`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (data.error) setError(data.error);
        else setSpec(data.spec);
      })
      .catch((e) => !cancelled && setError(String(e)));
    return () => {
      cancelled = true;
    };
  }, [taskId]);

  const PlaygroundComponent = React.useMemo(
    () =>
      dynamic<{ task: unknown; onSuccess: () => void }>(
        () =>
          import(`@/runners/_playground/${taskId}`).catch(() => ({
            default: PlaygroundNotFound as React.ComponentType<{
              task: unknown;
              onSuccess: () => void;
            }>,
          })),
        { ssr: false, loading: () => <div style={{ padding: 24 }}>Loading task component...</div> },
      ),
    [taskId],
  );

  const handleSuccess = () => {
    setCompleted(true);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('componentbench:task-success', { detail: { taskId } }));
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      <div
        style={{
          padding: '16px 24px',
          background: '#fff',
          borderBottom: '1px solid #eee',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <Link href="/tasklab" style={{ color: '#1677ff' }}>
            ← Back to Task Lab
          </Link>
          <div style={{ marginTop: 8, fontWeight: 600 }}>
            {spec?.title || taskId}
          </div>
          {spec?.browsergym_goal && (
            <div style={{ color: '#555', marginTop: 4, maxWidth: 720 }}>
              {spec.browsergym_goal}
            </div>
          )}
        </div>
        {completed && (
          <div style={{ color: '#52c41a', fontWeight: 600 }}>Task completed</div>
        )}
      </div>

      <div style={{ padding: 24 }}>
        {error && (
          <div style={{ color: '#cf1322', marginBottom: 16 }}>Error: {error}</div>
        )}
        <PlaygroundComponent key={`run-${recordPass}`} task={spec ?? { task_id: taskId }} onSuccess={handleSuccess} />
      </div>

      {isRecordMode && recordRunId && (
        <RecordOverlay
          key={`${taskId}-pass${recordPass}`}
          runId={recordRunId}
          taskId={taskId}
          pass={recordPass}
          currentIndex={recordPass - 1}
          totalTasks={2}
          onFinalized={handleRecordFinalized}
        />
      )}
    </div>
  );
}
