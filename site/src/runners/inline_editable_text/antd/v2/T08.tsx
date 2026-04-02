'use client';

/**
 * inline_editable_text-antd-v2-T08: High-contrast reviewer alias with ambiguous sibling rows
 *
 * A compact "Reviewer aliases" card in high-contrast theme contains three inline editable rows:
 * "Primary reviewer" ("J. Carter"), "Secondary reviewer" ("J. Carter / US"),
 * "Backup reviewer" ("L. Singh"). Two rows start with "J. Carter", creating ambiguity.
 *
 * The user must change only "Secondary reviewer" to "J. Carter / APAC" and click Save.
 *
 * Success: "Secondary reviewer" committed value === "J. Carter / APAC", display mode,
 * other rows unchanged.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Typography, Tag, Space, Badge } from 'antd';
import { EditOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../../types';

const { Text, Title } = Typography;

interface RowData {
  label: string;
  value: string;
  editingValue: string;
  isEditing: boolean;
}

const INITIAL: Omit<RowData, 'editingValue' | 'isEditing'>[] = [
  { label: 'Primary reviewer', value: 'J. Carter' },
  { label: 'Secondary reviewer', value: 'J. Carter / US' },
  { label: 'Backup reviewer', value: 'L. Singh' },
];

const NON_TARGET: Record<string, string> = {
  'Primary reviewer': 'J. Carter',
  'Backup reviewer': 'L. Singh',
};

export default function T08({ onSuccess }: TaskComponentProps) {
  const [rows, setRows] = useState<RowData[]>(
    INITIAL.map((r) => ({ ...r, editingValue: r.value, isEditing: false })),
  );
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    const target = rows.find((r) => r.label === 'Secondary reviewer');
    if (!target || target.isEditing) return;

    const nonTargetOk = rows
      .filter((r) => r.label !== 'Secondary reviewer')
      .every((r) => NON_TARGET[r.label] === r.value);

    if (target.value === 'J. Carter / APAC' && nonTargetOk) {
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

  const HC_BG = '#000';
  const HC_TEXT = '#fff';
  const HC_ACCENT = '#ffcc00';
  const HC_BORDER = '#666';

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        padding: 24,
        background: HC_BG,
        display: 'flex',
        gap: 16,
        flexWrap: 'wrap',
        alignContent: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Approval badges clutter */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignSelf: 'flex-start' }}>
        <Badge count="Approved" style={{ backgroundColor: '#52c41a' }} />
        <Badge count="Pending" style={{ backgroundColor: '#faad14' }} />
        <Text style={{ color: HC_TEXT, fontSize: 11 }}>Updated: 14 Mar 10:42</Text>
        <Text style={{ color: HC_TEXT, fontSize: 11 }}>Created: 2 Jan 08:15</Text>
      </div>

      {/* Target card */}
      <Card
        size="small"
        title={<span style={{ color: HC_TEXT }}>Reviewer aliases</span>}
        style={{
          width: 380,
          background: '#1a1a1a',
          border: `1px solid ${HC_BORDER}`,
        }}
        headStyle={{ background: '#1a1a1a', borderBottom: `1px solid ${HC_BORDER}` }}
        bodyStyle={{ background: '#1a1a1a' }}
        data-testid="reviewer-aliases-card"
      >
        {rows.map((row, idx) => (
          <div
            key={row.label}
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: 10,
              gap: 8,
              padding: '4px 0',
              borderBottom: `1px solid ${HC_BORDER}`,
            }}
            data-testid={`row-${row.label.toLowerCase().replace(/\s+/g, '-')}`}
            data-mode={row.isEditing ? 'editing' : 'display'}
            data-value={row.value}
          >
            <Text style={{ width: 140, flexShrink: 0, fontSize: 13, color: HC_ACCENT }}>
              {row.label}
            </Text>
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
                      border: `1px solid ${HC_ACCENT}`,
                      borderRadius: 4,
                      padding: '2px 8px',
                      fontSize: 13,
                      background: '#000',
                      color: HC_TEXT,
                      outline: 'none',
                    }}
                    data-testid={`input-${row.label.toLowerCase().replace(/\s+/g, '-')}`}
                  />
                  <span
                    role="button"
                    aria-label="Save"
                    onClick={() => saveRow(idx)}
                    style={{ cursor: 'pointer', padding: '0 6px', color: HC_ACCENT }}
                    data-testid={`save-${row.label.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <CheckOutlined style={{ fontSize: 13 }} />
                  </span>
                  <span
                    role="button"
                    aria-label="Cancel"
                    onClick={() => cancelRow(idx)}
                    style={{ cursor: 'pointer', padding: '0 6px', color: '#999' }}
                    data-testid={`cancel-${row.label.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <CloseOutlined style={{ fontSize: 13 }} />
                  </span>
                </Space.Compact>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Text style={{ fontSize: 13, color: HC_TEXT }}>{row.value}</Text>
                  <EditOutlined
                    onClick={() => startEdit(idx)}
                    style={{ fontSize: 12, color: HC_ACCENT, cursor: 'pointer' }}
                    aria-label={`Edit ${row.label}`}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </Card>

      {/* Comments list clutter */}
      <Card
        size="small"
        title={<span style={{ color: HC_TEXT }}>Comments</span>}
        style={{
          width: 220,
          background: '#1a1a1a',
          border: `1px solid ${HC_BORDER}`,
          alignSelf: 'flex-start',
        }}
        headStyle={{ background: '#1a1a1a', borderBottom: `1px solid ${HC_BORDER}` }}
        bodyStyle={{ background: '#1a1a1a' }}
      >
        <div style={{ fontSize: 12 }}>
          <div style={{ marginBottom: 8 }}>
            <Text style={{ color: HC_ACCENT, fontSize: 11 }}>jcarter</Text>
            <br />
            <Text style={{ color: HC_TEXT, fontSize: 12 }}>LGTM, ship it</Text>
          </div>
          <div style={{ marginBottom: 8 }}>
            <Text style={{ color: HC_ACCENT, fontSize: 11 }}>lsingh</Text>
            <br />
            <Text style={{ color: HC_TEXT, fontSize: 12 }}>+1, approved</Text>
          </div>
        </div>
      </Card>
    </div>
  );
}
