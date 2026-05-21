'use client';

/**
 * listbox_single-antd-v2-T36: Visual cue listbox: set Backup action by icon and apply
 *
 * Dark settings panel with two AntD Menu listboxes: "Primary action" (initial: Export, must stay)
 * and "Backup action" (initial: Upload). Each row has icon+text: Upload (📤), Invoice (🧾),
 * Export (📊), Archive (📦). A reference chip shows only the invoice icon (🧾).
 * Footer: "Apply routing" and "Reset routing". Committed only on Apply.
 *
 * Success: Backup action = "invoice", Primary action still "export", "Apply routing" clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, Menu, Button, Typography, Space, Divider } from 'antd';
import type { MenuProps } from 'antd';
import type { TaskComponentProps } from '../../types';

const { Text } = Typography;

const actionOptions = [
  { key: 'upload', label: '📤 Upload', icon: '📤' },
  { key: 'invoice', label: '🧾 Invoice', icon: '🧾' },
  { key: 'export', label: '📊 Export', icon: '📊' },
  { key: 'archive', label: '📦 Archive', icon: '📦' },
];

export default function T36({ onSuccess }: TaskComponentProps) {
  const [primaryAction, setPrimaryAction] = useState<string>('export');
  const [backupAction, setBackupAction] = useState<string>('upload');
  const [applied, setApplied] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (applied && backupAction === 'invoice' && primaryAction === 'export') {
      successFired.current = true;
      onSuccess();
    }
  }, [applied, backupAction, primaryAction, onSuccess]);

  const handlePrimarySelect: MenuProps['onSelect'] = ({ key }) => {
    setPrimaryAction(key);
    setApplied(false);
  };

  const handleBackupSelect: MenuProps['onSelect'] = ({ key }) => {
    setBackupAction(key);
    setApplied(false);
  };

  return (
    <div style={{ padding: 24, display: 'flex', justifyContent: 'flex-start' }}>
      <div style={{ maxWidth: 500 }}>
        <div
          data-testid="invoice-reference-chip"
          style={{
            display: 'inline-block',
            padding: '10px 18px',
            background: '#2a2a2a',
            borderRadius: 8,
            fontSize: 28,
            textAlign: 'center',
            marginBottom: 12,
            border: '1px solid #444',
          }}
        >
          🧾
          <Text style={{ display: 'block', fontSize: 11, color: '#aaa' }}>Reference</Text>
        </div>

        <Card
          title={<span style={{ color: '#e0e0e0' }}>Action routing</span>}
          style={{ width: 460, background: '#1e1e1e', border: '1px solid #333' }}
          styles={{ header: { background: '#1e1e1e', borderBottom: '1px solid #333' }, body: { background: '#1e1e1e' } }}
        >
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
              <Text strong style={{ display: 'block', marginBottom: 4, color: '#ccc' }}>Primary action</Text>
              <Menu
                data-cb-listbox-root
                data-cb-instance="primary"
                data-cb-selected-value={primaryAction}
                mode="inline"
                selectedKeys={[primaryAction]}
                onSelect={handlePrimarySelect}
                items={actionOptions.map(opt => ({
                  key: opt.key,
                  label: <span>{opt.label}</span>,
                  'data-cb-option-value': opt.key,
                }))}
                style={{ border: 'none', background: '#2a2a2a', borderRadius: 4 }}
                theme="dark"
              />
            </div>

            <div>
              <Text strong style={{ display: 'block', marginBottom: 4, color: '#ccc' }}>Backup action</Text>
              <Menu
                data-cb-listbox-root
                data-cb-instance="backup"
                data-cb-selected-value={backupAction}
                mode="inline"
                selectedKeys={[backupAction]}
                onSelect={handleBackupSelect}
                items={actionOptions.map(opt => ({
                  key: opt.key,
                  label: <span>{opt.label}</span>,
                  'data-cb-option-value': opt.key,
                }))}
                style={{ border: 'none', background: '#2a2a2a', borderRadius: 4 }}
                theme="dark"
              />
            </div>

            <Divider style={{ margin: '4px 0', borderColor: '#444' }} />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <Button onClick={() => { setPrimaryAction('export'); setBackupAction('upload'); setApplied(false); }}>
                Reset routing
              </Button>
              <Button type="primary" onClick={() => setApplied(true)}>Apply routing</Button>
            </div>
          </Space>
        </Card>
      </div>
    </div>
  );
}
