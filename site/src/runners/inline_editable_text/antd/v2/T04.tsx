'use client';

/**
 * inline_editable_text-antd-v2-T04: Match the blue reference chip in a three-row dashboard card
 *
 * An "Incident labels" card in a cluttered dashboard contains three inline editable rows:
 * "Pager label" ("On-call"), "Email label" ("Incidents"), "Slack label" ("sev2-router").
 * A non-interactive blue Tag labeled "Reference" shows the text "SEV-2 / Router".
 * The user must copy that text exactly into "Pager label" and click Save.
 *
 * Success: "Pager label" committed value === "SEV-2 / Router", display mode,
 * other rows unchanged.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Typography, Tag, Statistic, Space, List } from 'antd';
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
  { label: 'Pager label', value: 'On-call' },
  { label: 'Email label', value: 'Incidents' },
  { label: 'Slack label', value: 'sev2-router' },
];

const NON_TARGET: Record<string, string> = {
  'Email label': 'Incidents',
  'Slack label': 'sev2-router',
};

const REFERENCE_TEXT = 'SEV-2 / Router';

export default function T04({ onSuccess }: TaskComponentProps) {
  const [rows, setRows] = useState<RowData[]>(
    INITIAL.map((r) => ({ ...r, editingValue: r.value, isEditing: false })),
  );
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    const target = rows.find((r) => r.label === 'Pager label');
    if (!target || target.isEditing) return;

    const nonTargetOk = rows
      .filter((r) => r.label !== 'Pager label')
      .every((r) => NON_TARGET[r.label] === r.value);

    if (target.value === REFERENCE_TEXT && nonTargetOk) {
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
        padding: 24,
        background: '#f5f5f5',
        display: 'flex',
        gap: 16,
        flexWrap: 'wrap',
        alignContent: 'flex-start',
      }}
    >
      {/* KPI clutter */}
      <Card size="small" style={{ width: 150 }}>
        <Statistic title="Open incidents" value={42} />
      </Card>
      <Card size="small" style={{ width: 150 }}>
        <Statistic title="Avg response" value="4.2m" />
      </Card>
      <Card size="small" style={{ width: 150 }}>
        <Statistic title="Resolved today" value={18} />
      </Card>

      {/* Recent events clutter */}
      <Card size="small" title="Recent events" style={{ width: 200 }}>
        <List
          size="small"
          dataSource={['Deploy v3.1', 'Rollback v3.0', 'Config update']}
          renderItem={(item) => <List.Item style={{ fontSize: 12, padding: '4px 0' }}>{item}</List.Item>}
        />
      </Card>

      {/* Target card */}
      <Card
        size="small"
        title="Incident labels"
        style={{ width: 380 }}
        data-testid="incident-labels-card"
        extra={<Tag color="blue" data-testid="reference-chip">Reference: {REFERENCE_TEXT}</Tag>}
      >
        {rows.map((row, idx) => (
          <div
            key={row.label}
            style={{ display: 'flex', alignItems: 'center', marginBottom: 10, gap: 8 }}
            data-testid={`row-${row.label.toLowerCase().replace(/\s+/g, '-')}`}
            data-mode={row.isEditing ? 'editing' : 'display'}
            data-value={row.value}
          >
            <Text style={{ width: 100, flexShrink: 0, fontSize: 13 }}>{row.label}</Text>
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
      </Card>

      {/* Alert table clutter */}
      <Card size="small" title="Active alerts" style={{ width: 280 }}>
        <div style={{ fontSize: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #f0f0f0' }}>
            <Text>CPU &gt; 90%</Text><Tag color="red" style={{ fontSize: 11 }}>Critical</Tag>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #f0f0f0' }}>
            <Text>Disk 85%</Text><Tag color="orange" style={{ fontSize: 11 }}>Warning</Tag>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
            <Text>Latency spike</Text><Tag color="orange" style={{ fontSize: 11 }}>Warning</Tag>
          </div>
        </div>
      </Card>
    </div>
  );
}
