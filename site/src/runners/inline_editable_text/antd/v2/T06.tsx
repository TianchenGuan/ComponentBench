'use client';

/**
 * inline_editable_text-antd-v2-T06: Region label with inline save followed by Popconfirm
 *
 * A card near the bottom-left shows two inline editable rows: "Region label" ("Asia Pacific")
 * and "Region note" ("Ops only"). When Region label is saved, an AntD Popconfirm asks
 * "Apply label change?" with Confirm/Cancel. Only clicking Confirm commits the value.
 *
 * Success: "Region label" committed value === "APAC / Core", display mode,
 * confirmed via Popconfirm, "Region note" unchanged. Dark theme.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Typography, Popconfirm, Tag, Timeline, ConfigProvider, theme, Space } from 'antd';
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
  { label: 'Region label', value: 'Asia Pacific' },
  { label: 'Region note', value: 'Ops only' },
];

export default function T06({ onSuccess }: TaskComponentProps) {
  const [rows, setRows] = useState<RowData[]>(
    INITIAL.map((r) => ({ ...r, editingValue: r.value, isEditing: false })),
  );
  const [pendingSaveIdx, setPendingSaveIdx] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    const target = rows.find((r) => r.label === 'Region label');
    const note = rows.find((r) => r.label === 'Region note');
    if (!target || target.isEditing || !note) return;

    if (target.value === 'APAC / Core' && note.value === 'Ops only' && !showConfirm) {
      successFired.current = true;
      onSuccess();
    }
  }, [rows, showConfirm, onSuccess]);

  const startEdit = (idx: number) => {
    setRows((prev) =>
      prev.map((r, i) => (i === idx ? { ...r, isEditing: true, editingValue: r.value } : r)),
    );
  };

  const requestSave = (idx: number) => {
    if (rows[idx].label === 'Region label') {
      setPendingSaveIdx(idx);
      setShowConfirm(true);
      setRows((prev) =>
        prev.map((r, i) => (i === idx ? { ...r, isEditing: false } : r)),
      );
    } else {
      setRows((prev) =>
        prev.map((r, i) => (i === idx ? { ...r, value: r.editingValue, isEditing: false } : r)),
      );
    }
  };

  const handleConfirm = () => {
    if (pendingSaveIdx !== null) {
      setRows((prev) =>
        prev.map((r, i) =>
          i === pendingSaveIdx ? { ...r, value: r.editingValue, isEditing: false } : r,
        ),
      );
    }
    setShowConfirm(false);
    setPendingSaveIdx(null);
  };

  const handlePopCancel = () => {
    setShowConfirm(false);
    setPendingSaveIdx(null);
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
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      <div
        style={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'flex-end',
          padding: 24,
          background: '#141414',
        }}
      >
        <Card
          size="small"
          title="Region settings"
          style={{ width: 380 }}
          data-testid="region-card"
        >
          {rows.map((row, idx) => (
            <div
              key={row.label}
              style={{ display: 'flex', alignItems: 'center', marginBottom: 10, gap: 8 }}
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
                        if (e.key === 'Enter') requestSave(idx);
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
                    <span
                      role="button"
                      aria-label="Save"
                      onClick={() => requestSave(idx)}
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
                    {row.label === 'Region label' && showConfirm && pendingSaveIdx === idx ? (
                      <Tag color="orange" style={{ fontSize: 11 }}>Unsaved</Tag>
                    ) : null}
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

          {showConfirm && (
            <Popconfirm
              title="Apply label change?"
              open={showConfirm}
              onConfirm={handleConfirm}
              onCancel={handlePopCancel}
              okText="Confirm"
              cancelText="Cancel"
              data-testid="popconfirm"
            >
              <div
                style={{ padding: '4px 0', fontSize: 12, color: '#faad14', cursor: 'pointer' }}
                data-testid="popconfirm-anchor"
              >
                Pending change — click to review
              </div>
            </Popconfirm>
          )}

          {/* Audit trail clutter */}
          <div style={{ marginTop: 16 }}>
            <Text type="secondary" style={{ fontSize: 11, marginBottom: 8, display: 'block' }}>Audit trail</Text>
            <Timeline
              items={[
                { children: <Text style={{ fontSize: 11 }}>Region created — 12 Jan</Text> },
                { children: <Text style={{ fontSize: 11 }}>Label updated — 28 Feb</Text> },
                { children: <Text style={{ fontSize: 11 }}>Note added — 5 Mar</Text> },
              ]}
              style={{ paddingTop: 4 }}
            />
          </div>
        </Card>
      </div>
    </ConfigProvider>
  );
}
