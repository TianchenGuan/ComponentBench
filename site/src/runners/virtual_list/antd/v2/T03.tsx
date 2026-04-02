'use client';

/**
 * virtual_list-antd-v2-T03
 * Dashboard triage: choose the alert row, not the overlapping task ID
 *
 * Dark-theme dashboard with three cards (Alerts / Tasks / Messages), each with
 * its own virtualized list. IDs overlap numerically. Agent must select ALERT-0923
 * in the Alerts card and click "Save alert focus".
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Typography, Button } from 'antd';
import VirtualList from 'rc-virtual-list';
import type { TaskComponentProps } from '../../types';

const { Text } = Typography;

interface RowItem { key: string; code: string; label: string; }

const alertLabels = ['Disk full', 'CPU spike', 'Memory leak', 'Password expired', 'Token revoked', 'Cert expiring', 'Rate limit', 'DNS failure'];
const taskLabels = ['Code review', 'Deploy staging', 'Write tests', 'Update docs', 'Refactor DB', 'Fix pipeline', 'Triage bugs', 'Rotate secrets'];
const msgLabels = ['Welcome aboard', 'Standup notes', 'Release plan', 'Incident report', 'Team lunch', 'OOO notice', 'PR feedback', 'Sprint retro'];

function buildRows(prefix: string, labels: string[], count: number): RowItem[] {
  return Array.from({ length: count }, (_, i) => ({
    key: `${prefix.toLowerCase()}-${String(i).padStart(4, '0')}`,
    code: `${prefix}-${String(i).padStart(4, '0')}`,
    label: labels[i % labels.length],
  }));
}

const alerts = buildRows('ALERT', alertLabels, 1200);
const tasks = buildRows('TASK', taskLabels, 1200);
const messages = buildRows('MSG', msgLabels, 1200);

function DashCard({
  title, items, selected, onSelect, actionLabel, onAction, testId,
}: {
  title: string; items: RowItem[]; selected: string | null;
  onSelect: (k: string) => void; actionLabel: string; onAction: () => void; testId: string;
}) {
  return (
    <Card size="small" title={title} style={{ flex: 1, minWidth: 260 }} data-testid={testId}
      headStyle={{ background: '#1f1f1f', color: '#fff', borderBottom: '1px solid #333' }}
      bodyStyle={{ background: '#141414', padding: 8 }}
    >
      <div style={{ border: '1px solid #333', borderRadius: 4 }}>
        <VirtualList data={items} height={260} itemHeight={40} itemKey="key">
          {(item: RowItem) => (
            <div
              key={item.key}
              data-item-key={item.key}
              aria-selected={selected === item.key}
              onClick={() => onSelect(item.key)}
              style={{
                padding: '8px 10px',
                cursor: 'pointer',
                borderBottom: '1px solid #222',
                backgroundColor: selected === item.key ? '#177ddc33' : 'transparent',
                color: '#d9d9d9',
                fontSize: 12,
              }}
            >
              {item.code} — {item.label}
            </div>
          )}
        </VirtualList>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
        <Text style={{ color: '#666', fontSize: 11 }}>Selected: {selected ?? 'none'}</Text>
        <Button size="small" type="primary" onClick={onAction} disabled={!selected}>
          {actionLabel}
        </Button>
      </div>
    </Card>
  );
}

export default function T03({ onSuccess }: TaskComponentProps) {
  const [alertSel, setAlertSel] = useState<string | null>(null);
  const [taskSel, setTaskSel] = useState<string | null>(null);
  const [msgSel, setMsgSel] = useState<string | null>(null);
  const [alertSaved, setAlertSaved] = useState(false);
  const successRef = useRef(false);

  useEffect(() => {
    if (successRef.current) return;
    if (alertSaved && alertSel === 'alert-0923') {
      successRef.current = true;
      onSuccess();
    }
  }, [alertSaved, alertSel, onSuccess]);

  return (
    <div style={{ background: '#0a0a0a', padding: 16, borderRadius: 8, minWidth: 840 }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <div style={{ background: '#1f1f1f', borderRadius: 6, padding: '6px 14px' }}>
          <Text style={{ color: '#999', fontSize: 11 }}>Uptime</Text>
          <Text style={{ color: '#fff', display: 'block', fontWeight: 600 }}>99.7%</Text>
        </div>
        <div style={{ background: '#1f1f1f', borderRadius: 6, padding: '6px 14px' }}>
          <Text style={{ color: '#999', fontSize: 11 }}>Open issues</Text>
          <Text style={{ color: '#fff', display: 'block', fontWeight: 600 }}>42</Text>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <DashCard
          title="Alerts" items={alerts}
          selected={alertSel} onSelect={setAlertSel}
          actionLabel="Save alert focus"
          onAction={() => setAlertSaved(true)}
          testId="alerts-card"
        />
        <DashCard
          title="Tasks" items={tasks}
          selected={taskSel} onSelect={setTaskSel}
          actionLabel="Save task focus"
          onAction={() => {}}
          testId="tasks-card"
        />
        <DashCard
          title="Messages" items={messages}
          selected={msgSel} onSelect={setMsgSel}
          actionLabel="Save message focus"
          onAction={() => {}}
          testId="messages-card"
        />
      </div>
    </div>
  );
}
