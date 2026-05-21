'use client';

/**
 * inline_editable_text-antd-v2-T07: Autosize support note localized two-line edit
 *
 * A "Support note" card in a dashboard contains two AntD Typography.Paragraph editable blocks:
 * "Customer note" ("Thank the customer before closing.") and "Escalation note"
 * (two lines: "Owner: support\nEscalate: none"). Escalation note uses autoSize { minRows: 2, maxRows: 4 }.
 *
 * The user must change only the second line of Escalation note to "Escalate: Sev2 queue"
 * while keeping the first line "Owner: support" intact, then click Save.
 *
 * Success: "Escalation note" committed value === "Owner: support\nEscalate: Sev2 queue",
 * display mode, "Customer note" unchanged.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Typography, Statistic, List, Space } from 'antd';
import { EditOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../../types';

const { Text, Title, Paragraph } = Typography;

interface NoteBlock {
  label: string;
  value: string;
  editingValue: string;
  isEditing: boolean;
}

const INITIAL_ESCALATION = 'Owner: support\nEscalate: none';
const TARGET_ESCALATION = 'Owner: support\nEscalate: Sev2 queue';
const CUSTOMER_NOTE = 'Thank the customer before closing.';

export default function T07({ onSuccess }: TaskComponentProps) {
  const [notes, setNotes] = useState<NoteBlock[]>([
    { label: 'Customer note', value: CUSTOMER_NOTE, editingValue: CUSTOMER_NOTE, isEditing: false },
    { label: 'Escalation note', value: INITIAL_ESCALATION, editingValue: INITIAL_ESCALATION, isEditing: false },
  ]);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    const escalation = notes.find((n) => n.label === 'Escalation note');
    const customer = notes.find((n) => n.label === 'Customer note');
    if (!escalation || escalation.isEditing || !customer) return;

    const normalizedValue = escalation.value.replace(/\r\n/g, '\n').trim();
    if (normalizedValue === TARGET_ESCALATION && customer.value === CUSTOMER_NOTE) {
      successFired.current = true;
      onSuccess();
    }
  }, [notes, onSuccess]);

  const startEdit = (idx: number) => {
    setNotes((prev) =>
      prev.map((n, i) => (i === idx ? { ...n, isEditing: true, editingValue: n.value } : n)),
    );
  };

  const saveNote = (idx: number) => {
    setNotes((prev) =>
      prev.map((n, i) => (i === idx ? { ...n, value: n.editingValue, isEditing: false } : n)),
    );
  };

  const cancelNote = (idx: number) => {
    setNotes((prev) =>
      prev.map((n, i) => (i === idx ? { ...n, editingValue: n.value, isEditing: false } : n)),
    );
  };

  const updateDraft = (idx: number, v: string) => {
    setNotes((prev) =>
      prev.map((n, i) => (i === idx ? { ...n, editingValue: v } : n)),
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
      {/* Dashboard clutter */}
      <Card size="small" style={{ width: 140 }}>
        <Statistic title="Open tickets" value={27} />
      </Card>
      <Card size="small" style={{ width: 140 }}>
        <Statistic title="Avg wait" value="6m" />
      </Card>

      <Card size="small" title="Recent incidents" style={{ width: 200 }}>
        <List
          size="small"
          dataSource={['Outage EU-west', 'Latency spike US', 'Deploy fail']}
          renderItem={(item) => <List.Item style={{ fontSize: 12, padding: '4px 0' }}>{item}</List.Item>}
        />
      </Card>

      {/* Target card */}
      <Card
        size="small"
        title="Support note"
        style={{ width: 400 }}
        data-testid="support-note-card"
      >
        {notes.map((note, idx) => (
          <div
            key={note.label}
            style={{ marginBottom: 16 }}
            data-testid={`block-${note.label.toLowerCase().replace(/\s+/g, '-')}`}
            data-mode={note.isEditing ? 'editing' : 'display'}
            data-value={note.value}
          >
            <Text strong style={{ fontSize: 13, display: 'block', marginBottom: 4 }}>
              {note.label}
            </Text>
            {note.isEditing ? (
              <div>
                <textarea
                  autoFocus
                  value={note.editingValue}
                  onChange={(e) => updateDraft(idx, e.target.value)}
                  rows={note.label === 'Escalation note' ? 2 : 1}
                  style={{
                    width: '100%',
                    border: '1px solid #d9d9d9',
                    borderRadius: 4,
                    padding: '4px 8px',
                    fontSize: 13,
                    resize: 'vertical',
                    minHeight: note.label === 'Escalation note' ? 52 : 32,
                    maxHeight: note.label === 'Escalation note' ? 100 : undefined,
                    outline: 'none',
                    fontFamily: 'inherit',
                  }}
                  data-testid={`textarea-${note.label.toLowerCase().replace(/\s+/g, '-')}`}
                />
                <Space size="small" style={{ marginTop: 4 }}>
                  <span
                    role="button"
                    aria-label="Save"
                    onClick={() => saveNote(idx)}
                    style={{ cursor: 'pointer', color: '#1677ff' }}
                    data-testid={`save-${note.label.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <CheckOutlined style={{ fontSize: 13 }} /> Save
                  </span>
                  <span
                    role="button"
                    aria-label="Cancel"
                    onClick={() => cancelNote(idx)}
                    style={{ cursor: 'pointer', color: '#999' }}
                    data-testid={`cancel-${note.label.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <CloseOutlined style={{ fontSize: 13 }} /> Cancel
                  </span>
                </Space>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                <Paragraph style={{ fontSize: 13, margin: 0, whiteSpace: 'pre-line' }}>
                  {note.value}
                </Paragraph>
                <EditOutlined
                  onClick={() => startEdit(idx)}
                  style={{ fontSize: 12, color: '#1677ff', cursor: 'pointer', marginTop: 2 }}
                  aria-label={`Edit ${note.label}`}
                />
              </div>
            )}
          </div>
        ))}
      </Card>
    </div>
  );
}
