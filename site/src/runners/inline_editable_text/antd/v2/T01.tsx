'use client';

/**
 * inline_editable_text-antd-v2-T01: Billing alias among four icon-only rows
 *
 * A compact "Billing identities" settings panel near the bottom-right contains four inline
 * editable rows: "Legal alias", "Billing alias", "Invoice label", and "Receipt footer".
 * All use AntD Typography.Text with editable triggerType=['icon']. Only "Billing alias"
 * should be changed to "North Division" via its row-local Save control.
 *
 * Success: "Billing alias" committed value === "North Division", display mode,
 * and all non-target rows remain unchanged.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Typography, Switch, Select, Tag, Space } from 'antd';
import { EditOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../../types';

const { Text, Title } = Typography;

interface RowState {
  label: string;
  value: string;
  editingValue: string;
  isEditing: boolean;
}

const INITIAL_ROWS: Omit<RowState, 'editingValue' | 'isEditing'>[] = [
  { label: 'Legal alias', value: 'Northwind LLC' },
  { label: 'Billing alias', value: 'Northwind Billing' },
  { label: 'Invoice label', value: 'Invoice' },
  { label: 'Receipt footer', value: 'Thanks for your order' },
];

const NON_TARGET: Record<string, string> = {
  'Legal alias': 'Northwind LLC',
  'Invoice label': 'Invoice',
  'Receipt footer': 'Thanks for your order',
};

export default function T01({ onSuccess }: TaskComponentProps) {
  const [rows, setRows] = useState<RowState[]>(
    INITIAL_ROWS.map((r) => ({ ...r, editingValue: r.value, isEditing: false })),
  );
  const successFired = useRef(false);

  useEffect(() => {
    const billing = rows.find((r) => r.label === 'Billing alias');
    if (!billing || billing.isEditing || successFired.current) return;

    const nonTargetOk = rows
      .filter((r) => r.label !== 'Billing alias')
      .every((r) => NON_TARGET[r.label] === r.value);

    if (billing.value === 'North Division' && nonTargetOk) {
      successFired.current = true;
      onSuccess();
    }
  }, [rows, onSuccess]);

  const startEdit = (idx: number) => {
    setRows((prev) =>
      prev.map((r, i) => (i === idx ? { ...r, isEditing: true, editingValue: r.value } : r)),
    );
  };

  const saveRow = (idx: number) => {
    setRows((prev) =>
      prev.map((r, i) => (i === idx ? { ...r, value: r.editingValue, isEditing: false } : r)),
    );
  };

  const cancelRow = (idx: number) => {
    setRows((prev) =>
      prev.map((r, i) => (i === idx ? { ...r, editingValue: r.value, isEditing: false } : r)),
    );
  };

  const updateDraft = (idx: number, v: string) => {
    setRows((prev) =>
      prev.map((r, i) => (i === idx ? { ...r, editingValue: v } : r)),
    );
  };

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        padding: 24,
        background: '#f5f5f5',
      }}
    >
      <Card
        size="small"
        style={{ width: 420 }}
        data-testid="settings-panel"
      >
        {/* Unrelated clutter */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <Text type="secondary" style={{ fontSize: 12 }}>Auto-renew</Text>
          <Switch size="small" defaultChecked />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <Text type="secondary" style={{ fontSize: 12 }}>Currency</Text>
          <Select size="small" defaultValue="USD" style={{ width: 90 }} options={[{ label: 'USD', value: 'USD' }, { label: 'EUR', value: 'EUR' }]} />
        </div>

        <Title level={5} style={{ margin: '8px 0 12px' }}>Billing identities</Title>

        {rows.map((row, idx) => (
          <div
            key={row.label}
            style={{ display: 'flex', alignItems: 'center', marginBottom: 8, gap: 8 }}
            data-testid={`row-${row.label.toLowerCase().replace(/\s+/g, '-')}`}
            data-mode={row.isEditing ? 'editing' : 'display'}
            data-value={row.value}
          >
            <Text style={{ width: 110, flexShrink: 0, fontSize: 13 }}>{row.label}</Text>
            <div style={{ flex: 1 }}>
              {row.isEditing ? (
                <Space.Compact size="small" style={{ width: '100%' }}>
                  <input
                    autoFocus
                    value={row.editingValue}
                    onChange={(e) => updateDraft(idx, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveRow(idx);
                      if (e.key === 'Escape') cancelRow(idx);
                    }}
                    style={{
                      flex: 1,
                      border: '1px solid #d9d9d9',
                      borderRadius: 4,
                      padding: '2px 8px',
                      fontSize: 13,
                      outline: 'none',
                    }}
                    data-testid={`input-${row.label.toLowerCase().replace(/\s+/g, '-')}`}
                  />
                  <span
                    role="button"
                    aria-label="Save"
                    onClick={() => saveRow(idx)}
                    style={{ cursor: 'pointer', padding: '0 4px', color: '#1677ff' }}
                    data-testid={`save-${row.label.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <CheckOutlined style={{ fontSize: 13 }} />
                  </span>
                  <span
                    role="button"
                    aria-label="Cancel"
                    onClick={() => cancelRow(idx)}
                    style={{ cursor: 'pointer', padding: '0 4px', color: '#999' }}
                    data-testid={`cancel-${row.label.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <CloseOutlined style={{ fontSize: 13 }} />
                  </span>
                </Space.Compact>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Text style={{ fontSize: 13 }}>{row.value}</Text>
                  <EditOutlined
                    onClick={() => startEdit(idx)}
                    style={{ fontSize: 12, color: '#1677ff', cursor: 'pointer' }}
                    aria-label={`Edit ${row.label}`}
                  />
                </div>
              )}
            </div>
          </div>
        ))}

        {/* More clutter */}
        <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
          <Tag color="green">Active</Tag>
          <Tag>Tier 2</Tag>
          <Text type="secondary" style={{ fontSize: 11 }}>Last sync 3m ago</Text>
        </div>
      </Card>
    </div>
  );
}
