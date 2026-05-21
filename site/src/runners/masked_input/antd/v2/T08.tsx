'use client';

/**
 * masked_input-antd-v2-T08: Vehicle plate in inline surface with confirm popconfirm
 *
 * inline_surface layout top-left, high-contrast theme, compact spacing. Two
 * masked vehicle-plate rows in "Fleet aliases": Primary vehicle plate
 * (QPX-0421) and Backup vehicle plate (QPX-0401). Pattern AAA-####. Each row
 * has a row-local Save; clicking Save opens an AntD Popconfirm with Confirm /
 * Cancel. Only Confirm commits. Only Backup should become QPX-0471.
 *
 * Success: Backup vehicle plate committed = 'QPX-0471' via Confirm in
 * popconfirm, Primary unchanged at 'QPX-0421'.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, Button, Popconfirm, Tag, Typography, Space } from 'antd';
import { IMaskInput } from 'react-imask';
import type { TaskComponentProps } from '../../types';

const { Text } = Typography;

interface PlateRow {
  label: string;
  initial: string;
  key: string;
}

const rows: PlateRow[] = [
  { label: 'Primary vehicle plate', initial: 'QPX-0421', key: 'primary' },
  { label: 'Backup vehicle plate', initial: 'QPX-0401', key: 'backup' },
];

const inputStyle: React.CSSProperties = {
  width: 120,
  padding: '1px 6px',
  fontSize: 13,
  lineHeight: 1.5,
  border: '2px solid #333',
  borderRadius: 4,
  outline: 'none',
  fontFamily: 'monospace',
  fontWeight: 600,
  background: '#fff',
};

export default function T08({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);
  const [drafts, setDrafts] = useState<Record<string, string>>(
    Object.fromEntries(rows.map(r => [r.key, r.initial]))
  );
  const [saved, setSaved] = useState<Record<string, string>>(
    Object.fromEntries(rows.map(r => [r.key, r.initial]))
  );

  const handleConfirm = (key: string) => {
    setSaved(prev => ({ ...prev, [key]: drafts[key] }));
  };

  useEffect(() => {
    if (successFired.current) return;
    if (saved.backup === 'QPX-0471' && saved.primary === 'QPX-0421') {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, onSuccess]);

  return (
    <div style={{ position: 'fixed', top: 24, left: 24, width: 400 }}>
      <Card
        title={<Text style={{ fontWeight: 700 }}>Fleet aliases</Text>}
        size="small"
        style={{ border: '2px solid #222' }}
        styles={{ body: { padding: '8px 12px' } }}
      >
        {/* clutter chips */}
        <Space size="small" style={{ marginBottom: 10 }} wrap>
          <Tag style={{ fontSize: 11 }}>Zone: A-12</Tag>
          <Tag color="blue" style={{ fontSize: 11 }}>Active fleet</Tag>
        </Space>

        {rows.map(row => (
          <div key={row.key} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Text style={{ fontSize: 12, fontWeight: 500, minWidth: 140 }}>{row.label}</Text>
            <IMaskInput
              mask="aaa-0000"
              definitions={{ a: /[A-Za-z]/, '0': /[0-9]/ }}
              prepare={(s: string) => s.toUpperCase()}
              placeholder="AAA-####"
              value={drafts[row.key]}
              onAccept={(val: string) => setDrafts(prev => ({ ...prev, [row.key]: val }))}
              data-testid={`plate-${row.key}`}
              style={inputStyle}
            />
            <Popconfirm
              title="Confirm plate change?"
              description={`Set ${row.label} to ${drafts[row.key]}?`}
              onConfirm={() => handleConfirm(row.key)}
              okText="Confirm"
              cancelText="Cancel"
            >
              <Button size="small" type="primary">Save</Button>
            </Popconfirm>
          </div>
        ))}
      </Card>
    </div>
  );
}
