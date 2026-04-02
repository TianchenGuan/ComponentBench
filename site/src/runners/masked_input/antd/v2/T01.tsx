'use client';

/**
 * masked_input-antd-v2-T01: Backup phone among three rows with row-local apply
 *
 * Compact settings_panel anchored bottom-right with high clutter. Three masked
 * US phone inputs under "Contact routing": Primary phone (212) 555-0147,
 * Backup phone (empty), Escalation phone (917) 555-0199. Each row has a
 * row-local Apply button. Only Backup phone should change to (646) 555-0110.
 *
 * Success: Backup phone committed value equals '(646) 555-0110' via Apply,
 * non-targets unchanged.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, Button, Switch, Select, Tag, Typography, Space } from 'antd';
import { IMaskInput } from 'react-imask';
import type { TaskComponentProps } from '../../types';

const { Text } = Typography;

interface PhoneRow {
  label: string;
  initial: string;
}

const rows: PhoneRow[] = [
  { label: 'Primary phone', initial: '(212) 555-0147' },
  { label: 'Backup phone', initial: '' },
  { label: 'Escalation phone', initial: '(917) 555-0199' },
];

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '2px 8px',
  fontSize: 13,
  lineHeight: 1.5,
  border: '1px solid #d9d9d9',
  borderRadius: 4,
  outline: 'none',
};

export default function T01({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);
  const [drafts, setDrafts] = useState<string[]>(rows.map(r => r.initial));
  const [saved, setSaved] = useState<string[]>(rows.map(r => r.initial));

  const handleApply = (idx: number) => {
    setSaved(prev => {
      const next = [...prev];
      next[idx] = drafts[idx];
      return next;
    });
  };

  useEffect(() => {
    if (successFired.current) return;
    if (
      saved[1] === '(646) 555-0110' &&
      saved[0] === '(212) 555-0147' &&
      saved[2] === '(917) 555-0199'
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, onSuccess]);

  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, width: 370 }}>
      {/* clutter */}
      <Card size="small" style={{ marginBottom: 8 }}>
        <Space size="small" wrap>
          <Switch size="small" defaultChecked /> <Text style={{ fontSize: 12 }}>Auto-retry</Text>
          <Select size="small" defaultValue="us-east" style={{ width: 100 }} options={[{ value: 'us-east', label: 'US-East' }, { value: 'eu-west', label: 'EU-West' }]} />
          <Tag color="orange">Degraded</Tag>
          <Tag color="green">Active</Tag>
        </Space>
      </Card>

      <Card title="Contact routing" size="small" styles={{ header: { fontSize: 13 }, body: { padding: '8px 12px' } }}>
        {rows.map((row, idx) => (
          <div key={row.label} style={{ marginBottom: idx < rows.length - 1 ? 10 : 0 }}>
            <Text style={{ fontSize: 12, fontWeight: 500, display: 'block', marginBottom: 2 }}>{row.label}</Text>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <IMaskInput
                mask="(000) 000-0000"
                definitions={{ '0': /[0-9]/ }}
                placeholder="(###) ###-####"
                value={drafts[idx]}
                onAccept={(val: string) => setDrafts(prev => { const n = [...prev]; n[idx] = val; return n; })}
                data-testid={`phone-${idx}`}
                style={inputStyle}
              />
              <Button size="small" type="primary" onClick={() => handleApply(idx)}>Apply</Button>
            </div>
            <Text style={{ fontSize: 11, color: '#999' }}>
              {saved[idx] === drafts[idx] && saved[idx] ? 'Applied' : 'Not applied'}
            </Text>
          </div>
        ))}
      </Card>
    </div>
  );
}
