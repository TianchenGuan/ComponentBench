'use client';

/**
 * virtual_list-antd-v2-T08
 * Four queues: set Hold only in Secondary queue and save
 *
 * Dark dashboard with 2×2 grid of queue cards. Agent must scroll Secondary queue
 * to JOB-118, turn on its Hold toggle, and click "Save queue state" without
 * changing the other three cards.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Switch, Typography } from 'antd';
import VirtualList from 'rc-virtual-list';
import type { TaskComponentProps } from '../../types';

const { Text } = Typography;

interface JobItem { key: string; code: string; label: string; }

const jobLabels = [
  'Retry worker', 'Index rebuild', 'Cache warm', 'Log rotate', 'Snapshot export',
  'Metric flush', 'Queue drain', 'Token refresh', 'Cert renew', 'DNS sync',
];

function buildJobs(prefix: string, count: number): JobItem[] {
  return Array.from({ length: count }, (_, i) => ({
    key: `${prefix.toLowerCase()}-${i}`,
    code: `${prefix}-${i}`,
    label: jobLabels[i % jobLabels.length],
  }));
}

const primaryJobs = buildJobs('JOB', 300);
const secondaryJobs = buildJobs('JOB', 300);
const archiveJobs = buildJobs('ARC', 200);
const watcherJobs = buildJobs('WCH', 200);

function QueueCard({
  title, items, holds, onToggle, testId,
}: {
  title: string; items: JobItem[]; holds: Set<string>;
  onToggle: (key: string) => void; testId: string;
}) {
  return (
    <Card size="small" title={title} style={{ flex: 1, minWidth: 280 }} data-testid={testId}
      headStyle={{ background: '#1f1f1f', color: '#fff', borderBottom: '1px solid #333' }}
      bodyStyle={{ background: '#141414', padding: 8 }}
    >
      <div style={{ border: '1px solid #333', borderRadius: 4 }}>
        <VirtualList data={items} height={200} itemHeight={38} itemKey="key">
          {(item: JobItem) => (
            <div
              key={item.key}
              data-item-key={item.key}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '6px 10px',
                borderBottom: '1px solid #222',
                fontSize: 12,
                color: '#d9d9d9',
              }}
            >
              <span>{item.code} — {item.label}</span>
              <Switch
                size="small"
                checked={holds.has(item.key)}
                onChange={() => onToggle(item.key)}
                checkedChildren="Hold"
                unCheckedChildren="—"
              />
            </div>
          )}
        </VirtualList>
      </div>
      <Text style={{ color: '#666', fontSize: 11, marginTop: 4, display: 'block' }}>
        Held: {holds.size}
      </Text>
    </Card>
  );
}

export default function T08({ onSuccess }: TaskComponentProps) {
  const [primaryHolds, setPrimaryHolds] = useState<Set<string>>(new Set());
  const [secondaryHolds, setSecondaryHolds] = useState<Set<string>>(new Set());
  const [archiveHolds, setArchiveHolds] = useState<Set<string>>(new Set());
  const [watcherHolds, setWatcherHolds] = useState<Set<string>>(new Set());
  const [saved, setSaved] = useState(false);
  const successRef = useRef(false);

  useEffect(() => {
    if (successRef.current) return;
    if (saved && secondaryHolds.has('job-118')) {
      successRef.current = true;
      onSuccess();
    }
  }, [saved, secondaryHolds, onSuccess]);

  const makeToggler = (setter: React.Dispatch<React.SetStateAction<Set<string>>>) => (key: string) => {
    setter(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
    setSaved(false);
  };

  return (
    <div style={{ background: '#0a0a0a', padding: 16, borderRadius: 8 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        <QueueCard title="Primary queue" items={primaryJobs} holds={primaryHolds} onToggle={makeToggler(setPrimaryHolds)} testId="primary-queue" />
        <QueueCard title="Secondary queue" items={secondaryJobs} holds={secondaryHolds} onToggle={makeToggler(setSecondaryHolds)} testId="secondary-queue" />
        <QueueCard title="Archive" items={archiveJobs} holds={archiveHolds} onToggle={makeToggler(setArchiveHolds)} testId="archive" />
        <QueueCard title="Watchers" items={watcherJobs} holds={watcherHolds} onToggle={makeToggler(setWatcherHolds)} testId="watchers" />
      </div>
      <Button type="primary" onClick={() => setSaved(true)}>Save queue state</Button>
    </div>
  );
}
