'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mentions, Table, Button, Typography, Tag, Space } from 'antd';
import type { TaskComponentProps } from '../../types';
import { deriveMentionsFromText, normalizeWhitespace } from '../../types';

const { Text, Title } = Typography;

const USERS = [
  { id: 'ava', label: 'Ava Chen' },
  { id: 'noah', label: 'Noah Patel' },
  { id: 'maya', label: 'Maya Rivera' },
  { id: 'emma', label: 'Emma Johnson' },
  { id: 'ethan', label: 'Ethan Brooks' },
  { id: 'priya', label: 'Priya Singh' },
  { id: 'olivia', label: 'Olivia Kim' },
  { id: 'liam', label: 'Liam Ortiz' },
];

interface RowState {
  noteValue: string;
  saved: boolean;
}

const INITIAL_ROWS: Record<string, RowState> = {
  '104': { noteValue: 'Waiting on logs.', saved: false },
  '105': { noteValue: '', saved: false },
  '106': { noteValue: 'Escalated yesterday.', saved: false },
};

const FILTER_CHIPS = ['All', 'P0', 'P1', 'Open', 'Resolved'];

export default function T03({ onSuccess }: TaskComponentProps) {
  const [rows, setRows] = useState<Record<string, RowState>>(INITIAL_ROWS);
  const hasSucceeded = useRef(false);

  const updateRow = (id: string, patch: Partial<RowState>) => {
    setRows(prev => ({ ...prev, [id]: { ...prev[id], ...patch } }));
  };

  const handleRowSave = (rowId: string) => {
    updateRow(rowId, { saved: true });
  };

  useEffect(() => {
    if (hasSucceeded.current) return;
    const r105 = rows['105'];
    const r104 = rows['104'];
    const r106 = rows['106'];
    if (!r105.saved) return;

    const normalizedNote = normalizeWhitespace(r105.noteValue);
    const target = 'Assign @Priya Singh and unblock @Liam Ortiz.';
    const r105Mentions = deriveMentionsFromText(r105.noteValue, USERS);
    const r104Unchanged =
      normalizeWhitespace(r104.noteValue) === normalizeWhitespace(INITIAL_ROWS['104'].noteValue);
    const r106Unchanged =
      normalizeWhitespace(r106.noteValue) === normalizeWhitespace(INITIAL_ROWS['106'].noteValue);

    if (
      normalizedNote === target &&
      r105Mentions.length === 2 &&
      r105Mentions[0].id === 'priya' &&
      r105Mentions[1].id === 'liam' &&
      r104Unchanged &&
      r106Unchanged
    ) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [rows, onSuccess]);

  const incidents = [
    { id: '104', severity: 'P1', service: 'Auth', status: 'Investigating' },
    { id: '105', severity: 'P0', service: 'Payments', status: 'Open' },
    { id: '106', severity: 'P2', service: 'Notifications', status: 'Mitigated' },
  ];

  const columns = [
    {
      title: 'Incident',
      dataIndex: 'id',
      key: 'id',
      sorter: true,
      render: (id: string) => <Text strong>#{id}</Text>,
    },
    {
      title: 'Severity',
      dataIndex: 'severity',
      key: 'severity',
      sorter: true,
      render: (sev: string) => (
        <Tag color={sev === 'P0' ? 'red' : sev === 'P1' ? 'orange' : 'blue'}>{sev}</Tag>
      ),
    },
    {
      title: 'Service',
      dataIndex: 'service',
      key: 'service',
      sorter: true,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Note',
      key: 'note',
      width: 300,
      render: (_: unknown, record: (typeof incidents)[0]) => (
        <div>
          <Mentions
            value={rows[record.id].noteValue}
            onChange={val => updateRow(record.id, { noteValue: val })}
            autoSize={{ minRows: 1, maxRows: 3 }}
            placeholder="Add note..."
            style={{ width: '100%' }}
          >
            {USERS.map(u => (
              <Mentions.Option key={u.id} value={u.label}>{u.label}</Mentions.Option>
            ))}
          </Mentions>
          <Text type="secondary" style={{ fontSize: 11, display: 'block', marginTop: 2 }}>
            Mentions: {deriveMentionsFromText(rows[record.id].noteValue, USERS).length > 0 ? deriveMentionsFromText(rows[record.id].noteValue, USERS).map(m => m.label).join(', ') : '(none)'}
          </Text>
        </div>
      ),
    },
    {
      title: '',
      key: 'action',
      width: 80,
      render: (_: unknown, record: (typeof incidents)[0]) => (
        <Button
          size="small"
          type="primary"
          onClick={() => handleRowSave(record.id)}
          disabled={rows[record.id].saved}
        >
          {rows[record.id].saved ? 'Saved' : 'Save'}
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={4} style={{ marginBottom: 12 }}>Incident Tracker</Title>

      <Space style={{ marginBottom: 12 }}>
        {FILTER_CHIPS.map(chip => (
          <Tag key={chip} style={{ cursor: 'pointer' }}>{chip}</Tag>
        ))}
      </Space>

      <Table
        dataSource={incidents}
        columns={columns}
        rowKey="id"
        pagination={false}
        size="small"
        bordered
      />
    </div>
  );
}
