'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Select, Typography, Button, Table, Space, Input } from 'antd';
import type { TaskComponentProps } from '../../types';

const { Text } = Typography;
const { Search } = Input;

const suggestions = [
  { label: 'Status', options: [{ label: 'pending', value: 'pending' }, { label: 'review', value: 'review' }, { label: 'overdue', value: 'overdue' }, { label: 'paid', value: 'paid' }] },
  { label: 'Visibility', options: [{ label: 'internal', value: 'internal' }, { label: 'archived', value: 'archived' }, { label: 'client-visible', value: 'client-visible' }] },
  { label: 'Action', options: [{ label: 'do-not-edit', value: 'do-not-edit' }, { label: 'escalate', value: 'escalate' }, { label: 'follow-up', value: 'follow-up' }] },
];

function setsEqual(a: string[], b: string[]): boolean {
  const sa = new Set(a.map(s => s.toLowerCase().trim()));
  const sb = new Set(b.map(s => s.toLowerCase().trim()));
  if (sa.size !== sb.size) return false;
  const arr = Array.from(sa);
  for (let i = 0; i < arr.length; i++) {
    if (!sb.has(arr[i])) return false;
  }
  return true;
}

interface RowData {
  key: string;
  invoice: string;
  tags: string[];
  saved: string[];
}

export default function T07({ onSuccess }: TaskComponentProps) {
  const hasSucceeded = useRef(false);
  const [rows, setRows] = useState<RowData[]>([
    { key: '1041', invoice: 'Invoice #1041', tags: ['review'], saved: ['review'] },
    { key: '1042', invoice: 'Invoice #1042', tags: ['pending'], saved: ['pending'] },
    { key: '1043', invoice: 'Invoice #1043', tags: ['paid', 'do-not-edit'], saved: ['paid', 'do-not-edit'] },
  ]);

  const updateTags = (key: string, newTags: string[]) => {
    setRows(prev => prev.map(r => r.key === key ? { ...r, tags: newTags } : r));
  };

  const saveRow = (key: string) => {
    setRows(prev => prev.map(r => r.key === key ? { ...r, saved: [...r.tags] } : r));
  };

  useEffect(() => {
    const row1041 = rows.find(r => r.key === '1041')!;
    const row1042 = rows.find(r => r.key === '1042')!;
    const row1043 = rows.find(r => r.key === '1043')!;

    if (
      !hasSucceeded.current &&
      setsEqual(row1042.saved, ['paid', 'archived', 'client-visible']) &&
      setsEqual(row1041.saved, ['review']) &&
      setsEqual(row1043.saved, ['paid', 'do-not-edit'])
    ) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [rows, onSuccess]);

  const columns = [
    { title: 'Invoice', dataIndex: 'invoice', key: 'invoice', sorter: true },
    {
      title: 'Labels',
      key: 'labels',
      render: (_: unknown, record: RowData) => (
        <Select
          mode="tags"
          size="small"
          style={{ width: 220 }}
          value={record.tags}
          onChange={(val: string[]) => updateTags(record.key, val)}
          options={suggestions}
          placeholder="Select labels"
        />
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: unknown, record: RowData) => (
        <Button size="small" type="primary" onClick={() => saveRow(record.key)}>
          Save
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 16 }}>
      <Space style={{ marginBottom: 12, width: '100%', justifyContent: 'space-between' }}>
        <Text strong>Invoices</Text>
        <Search placeholder="Filter invoices…" size="small" style={{ width: 180 }} />
      </Space>
      <Table
        dataSource={rows}
        columns={columns}
        pagination={false}
        size="small"
        bordered
      />
    </div>
  );
}
