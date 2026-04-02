'use client';

/**
 * inline_editable_text-antd-v2-T05: Nested-scroll footer stamp offscreen in branding panel
 *
 * A settings shell with its own outer scroll contains a right-side "Branding" panel that
 * scrolls independently. Four inline editable rows live inside: "Portal title" ("Northwind Portal"),
 * "Navigation label" ("Home"), "Footer stamp" ("© 2026 Northwind"), and "Help footer" ("Need help?").
 * "Footer stamp" is below the fold and must be scrolled into view within the panel.
 *
 * Success: "Footer stamp" committed value === "Managed by Platform", display mode, via Save,
 * other rows unchanged.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Typography, Switch, Select, Divider, Space } from 'antd';
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
  { label: 'Portal title', value: 'Northwind Portal' },
  { label: 'Navigation label', value: 'Home' },
  { label: 'Footer stamp', value: '© 2026 Northwind' },
  { label: 'Help footer', value: 'Need help?' },
];

const NON_TARGET: Record<string, string> = {
  'Portal title': 'Northwind Portal',
  'Navigation label': 'Home',
  'Help footer': 'Need help?',
};

function EditableRow({
  row,
  onStartEdit,
  onSave,
  onCancel,
  onDraftChange,
}: {
  row: RowData;
  onStartEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDraftChange: (v: string) => void;
}) {
  return (
    <div
      style={{ display: 'flex', alignItems: 'center', marginBottom: 10, gap: 8 }}
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
              onChange={(e) => onDraftChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onSave();
                if (e.key === 'Escape') onCancel();
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
              onClick={onSave}
              style={{ cursor: 'pointer', padding: '0 4px', color: '#1677ff' }}
              data-testid={`save-${row.label.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <CheckOutlined style={{ fontSize: 13 }} />
            </span>
            <span
              role="button"
              aria-label="Cancel"
              onClick={onCancel}
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
              onClick={onStartEdit}
              style={{ fontSize: 12, color: '#1677ff', cursor: 'pointer' }}
              aria-label={`Edit ${row.label}`}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default function T05({ onSuccess }: TaskComponentProps) {
  const [rows, setRows] = useState<RowData[]>(
    INITIAL.map((r) => ({ ...r, editingValue: r.value, isEditing: false })),
  );
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    const target = rows.find((r) => r.label === 'Footer stamp');
    if (!target || target.isEditing) return;

    const nonTargetOk = rows
      .filter((r) => r.label !== 'Footer stamp')
      .every((r) => NON_TARGET[r.label] === r.value);

    if (target.value === 'Managed by Platform' && nonTargetOk) {
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
    <div style={{ width: '100vw', height: '100vh', display: 'flex', background: '#f5f5f5' }}>
      {/* Left sidebar (outer scroll filler) */}
      <div
        style={{
          width: 220,
          background: '#fff',
          borderRight: '1px solid #f0f0f0',
          padding: 16,
          overflowY: 'auto',
        }}
      >
        <Title level={5}>Settings</Title>
        {['General', 'Security', 'Notifications', 'Branding', 'Billing', 'Integrations', 'API keys', 'Audit log'].map(
          (item) => (
            <div
              key={item}
              style={{
                padding: '8px 12px',
                cursor: 'pointer',
                borderRadius: 6,
                fontSize: 13,
                background: item === 'Branding' ? '#e6f4ff' : 'transparent',
                fontWeight: item === 'Branding' ? 600 : 400,
                marginBottom: 2,
              }}
            >
              {item}
            </div>
          ),
        )}
      </div>

      {/* Main area with outer scroll */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
        <Title level={4}>Branding</Title>
        <Text type="secondary">Customize portal appearance and messaging.</Text>
        <Divider />

        {/* Non-editable clutter above the scroll panel */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text style={{ fontSize: 13 }}>Logo upload</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>northwind-logo.svg</Text>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text style={{ fontSize: 13 }}>Dark mode</Text>
            <Switch size="small" />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text style={{ fontSize: 13 }}>Accent color</Text>
            <Select size="small" defaultValue="blue" style={{ width: 90 }} options={[{ label: 'Blue', value: 'blue' }, { label: 'Green', value: 'green' }]} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text style={{ fontSize: 13 }}>Favicon</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>favicon.ico</Text>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text style={{ fontSize: 13 }}>Locale</Text>
            <Select size="small" defaultValue="en" style={{ width: 90 }} options={[{ label: 'English', value: 'en' }, { label: 'Español', value: 'es' }]} />
          </div>
        </div>

        {/* Branding panel with its own scroll */}
        <Card
          size="small"
          title="Portal text overrides"
          style={{ maxHeight: 180, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
          bodyStyle={{ overflowY: 'auto', flex: 1 }}
          data-testid="branding-panel"
        >
          {/* Non-editable filler to push Footer stamp offscreen */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text style={{ fontSize: 13 }}>Welcome banner</Text>
              <Text type="secondary" style={{ fontSize: 12 }}>Enabled</Text>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text style={{ fontSize: 13 }}>Support email shown</Text>
              <Switch size="small" defaultChecked />
            </div>
          </div>

          {rows.map((row, idx) => (
            <EditableRow
              key={row.label}
              row={row}
              onStartEdit={() => startEdit(idx)}
              onSave={() => saveRow(idx)}
              onCancel={() => cancelRow(idx)}
              onDraftChange={(v) => updateDraft(idx, v)}
            />
          ))}

          {/* Filler after editable rows */}
          <Divider style={{ margin: '8px 0' }} />
          <Text type="secondary" style={{ fontSize: 11 }}>Changes take effect after next deploy.</Text>
        </Card>
      </div>
    </div>
  );
}
