'use client';

/**
 * masked_input-antd-v2-T07: Backup VAT ID with visible validation in dark panel
 *
 * Dark settings_panel bottom-right, compact spacing, high clutter. Three masked
 * VAT-ID rows: Primary VAT ID (EU-1024-11), Backup VAT ID (empty), Legacy
 * VAT ID (US-9000-00). Pattern AA-####-## with row-local Save. Incomplete
 * entries show error status and disable Save. Only Backup VAT ID should become
 * EU-2048-77.
 *
 * Success: Backup VAT ID committed = 'EU-2048-77' via row Save,
 * non-targets unchanged.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, Button, Switch, Tag, Typography, Space } from 'antd';
import { IMaskInput } from 'react-imask';
import type { TaskComponentProps } from '../../types';

const { Text } = Typography;

interface VatRow {
  label: string;
  initial: string;
}

const rows: VatRow[] = [
  { label: 'Primary VAT ID', initial: 'EU-1024-11' },
  { label: 'Backup VAT ID', initial: '' },
  { label: 'Legacy VAT ID', initial: 'US-9000-00' },
];

const VAT_COMPLETE_RE = /^[A-Z]{2}-\d{4}-\d{2}$/;

const inputStyle = (hasError: boolean): React.CSSProperties => ({
  width: '100%',
  padding: '2px 8px',
  fontSize: 13,
  lineHeight: 1.5,
  border: `1px solid ${hasError ? '#ff4d4f' : '#434343'}`,
  borderRadius: 4,
  outline: 'none',
  background: '#141414',
  color: '#fff',
  fontFamily: 'monospace',
});

export default function T07({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);
  const [drafts, setDrafts] = useState<string[]>(rows.map(r => r.initial));
  const [saved, setSaved] = useState<string[]>(rows.map(r => r.initial));

  const handleSave = (idx: number) => {
    setSaved(prev => {
      const next = [...prev];
      next[idx] = drafts[idx];
      return next;
    });
  };

  useEffect(() => {
    if (successFired.current) return;
    if (
      saved[1] === 'EU-2048-77' &&
      saved[0] === 'EU-1024-11' &&
      saved[2] === 'US-9000-00'
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, onSuccess]);

  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, width: 370 }}>
      {/* clutter */}
      <Card size="small" style={{ marginBottom: 8, background: '#1f1f1f', borderColor: '#303030' }}>
        <Space size="small" wrap>
          <Switch size="small" defaultChecked /> <Text style={{ fontSize: 11, color: '#aaa' }}>Auto-sync</Text>
          <Tag color="red">2 overdue</Tag>
          <Tag color="green">Active</Tag>
        </Space>
      </Card>

      <Card
        title={<Text style={{ color: '#fff' }}>Tax IDs</Text>}
        size="small"
        style={{ background: '#1f1f1f', borderColor: '#303030' }}
        styles={{ header: { borderColor: '#303030' }, body: { padding: '8px 12px' } }}
      >
        {rows.map((row, idx) => {
          const val = drafts[idx];
          const incomplete = val.length > 0 && !VAT_COMPLETE_RE.test(val);
          return (
            <div key={row.label} style={{ marginBottom: idx < rows.length - 1 ? 10 : 0 }}>
              <Text style={{ fontSize: 12, fontWeight: 500, color: '#e0e0e0', display: 'block', marginBottom: 2 }}>{row.label}</Text>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <IMaskInput
                  mask="aa-0000-00"
                  definitions={{ a: /[A-Za-z]/, '0': /[0-9]/ }}
                  prepare={(s: string) => s.toUpperCase()}
                  placeholder="AA-####-##"
                  value={drafts[idx]}
                  onAccept={(v: string) => setDrafts(prev => { const n = [...prev]; n[idx] = v; return n; })}
                  data-testid={`vat-${idx}`}
                  style={inputStyle(incomplete)}
                />
                <Button
                  size="small"
                  type="primary"
                  disabled={incomplete || !val}
                  onClick={() => handleSave(idx)}
                >
                  Save
                </Button>
              </div>
              {incomplete && (
                <Text style={{ fontSize: 11, color: '#ff4d4f' }}>Incomplete — enter full VAT ID</Text>
              )}
              {!incomplete && val && saved[idx] === val && (
                <Text style={{ fontSize: 11, color: '#52c41a' }}>Saved</Text>
              )}
            </div>
          );
        })}
      </Card>
    </div>
  );
}
