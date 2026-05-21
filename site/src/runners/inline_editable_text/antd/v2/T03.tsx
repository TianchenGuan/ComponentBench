'use client';

/**
 * inline_editable_text-antd-v2-T03: Approval tag at max-length boundary inside drawer
 *
 * A button opens a left-side AntD Drawer titled "Edit approval tags". Inside are three
 * inline editable rows: "Approval tag" (initial "pending"), "Queue tag" ("triage"),
 * "Escalation tag" ("manual"). The target row uses editable maxLength=12.
 * "needs-review" (12 chars) is the exact boundary value.
 *
 * Success: "Approval tag" committed value === "needs-review", display mode, via Save,
 * other rows unchanged. Dark theme.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Button, Drawer, Typography, ConfigProvider, theme, Space } from 'antd';
import { EditOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../../types';

const { Text, Title } = Typography;

interface TagRow {
  label: string;
  value: string;
  editingValue: string;
  isEditing: boolean;
}

const INITIAL: Omit<TagRow, 'editingValue' | 'isEditing'>[] = [
  { label: 'Approval tag', value: 'pending' },
  { label: 'Queue tag', value: 'triage' },
  { label: 'Escalation tag', value: 'manual' },
];

const NON_TARGET: Record<string, string> = {
  'Queue tag': 'triage',
  'Escalation tag': 'manual',
};

const MAX_LENGTH = 12;

export default function T03({ onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState<TagRow[]>(
    INITIAL.map((r) => ({ ...r, editingValue: r.value, isEditing: false })),
  );
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    const target = rows.find((r) => r.label === 'Approval tag');
    if (!target || target.isEditing) return;

    const nonTargetOk = rows
      .filter((r) => r.label !== 'Approval tag')
      .every((r) => NON_TARGET[r.label] === r.value);

    if (target.value === 'needs-review' && nonTargetOk) {
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
    const row = rows[idx];
    if (row.label === 'Approval tag' && v.length > MAX_LENGTH) return;
    setRows((prev) =>
      prev.map((r, i) => (i === idx ? { ...r, editingValue: v } : r)),
    );
  };

  return (
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      <div
        style={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          padding: 24,
          background: '#141414',
        }}
      >
        <Button type="primary" onClick={() => setOpen(true)} data-testid="open-drawer-btn">
          Edit approval tags
        </Button>

        <Drawer
          title="Edit approval tags"
          placement="left"
          open={open}
          onClose={() => setOpen(false)}
          width={380}
          data-testid="approval-drawer"
        >
          <div style={{ marginBottom: 16 }}>
            <Text type="secondary" style={{ fontSize: 12 }}>Owner: Risk Ops</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>Updated 2h ago</Text>
          </div>

          {rows.map((row, idx) => (
            <div
              key={row.label}
              style={{ display: 'flex', alignItems: 'center', marginBottom: 12, gap: 8 }}
              data-testid={`row-${row.label.toLowerCase().replace(/\s+/g, '-')}`}
              data-mode={row.isEditing ? 'editing' : 'display'}
              data-value={row.value}
            >
              <Text style={{ width: 120, flexShrink: 0, fontSize: 13 }}>{row.label}</Text>
              <div style={{ flex: 1 }}>
                {row.isEditing ? (
                  <Space.Compact size="small" style={{ width: '100%' }}>
                    <input
                      autoFocus
                      value={row.editingValue}
                      onChange={(e) => updateDraft(idx, e.target.value)}
                      maxLength={row.label === 'Approval tag' ? MAX_LENGTH : undefined}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveRow(idx);
                        if (e.key === 'Escape') cancelRow(idx);
                      }}
                      style={{
                        flex: 1,
                        border: '1px solid #434343',
                        borderRadius: 4,
                        padding: '2px 8px',
                        fontSize: 13,
                        background: '#1f1f1f',
                        color: '#fff',
                        outline: 'none',
                      }}
                      data-testid={`input-${row.label.toLowerCase().replace(/\s+/g, '-')}`}
                    />
                    {row.label === 'Approval tag' && (
                      <Text type="secondary" style={{ fontSize: 11, padding: '0 4px', whiteSpace: 'nowrap' }}>
                        {row.editingValue.length}/{MAX_LENGTH}
                      </Text>
                    )}
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
        </Drawer>
      </div>
    </ConfigProvider>
  );
}
