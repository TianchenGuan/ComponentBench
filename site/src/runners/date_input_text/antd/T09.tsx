'use client';

/**
 * date_input_text-antd-T09: AntD edit a date field inside a dense table row
 * 
 * Layout: table_cell scene with the table centered in the viewport.
 * Component instances: three Ant Design DatePicker inputs rendered directly inside the "Milestone date" column cells (one per row).
 * Rows: "Alpha", "Beta", "Gamma".
 * Each cell shows a small DatePicker input (size=small, format YYYY-MM-DD) with a calendar icon; manual typing is enabled.
 * Initial state:
 *   - Alpha milestone date: 2026-03-15
 *   - Beta milestone date: empty
 *   - Gamma milestone date: 2026-05-10
 * Clutter (high): table also includes an "Owner" dropdown and a "Status" tag column; these are distractors and not required.
 * Feedback: the edited cell updates immediately after commit and the table highlights the changed cell briefly (1s).
 * 
 * Success: In the "Beta" row, the "Milestone date" cell's DatePicker value equals 2026-04-01.
 */

import React, { useState, useEffect } from 'react';
import { Card, Table, DatePicker, Select, Tag } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

interface MilestoneRow {
  key: string;
  name: string;
  date: Dayjs | null;
  owner: string;
  status: string;
}

export default function T09({ onSuccess }: TaskComponentProps) {
  const [data, setData] = useState<MilestoneRow[]>([
    { key: 'Alpha', name: 'Alpha', date: dayjs('2026-03-15'), owner: 'Alice', status: 'complete' },
    { key: 'Beta', name: 'Beta', date: null, owner: 'Bob', status: 'in_progress' },
    { key: 'Gamma', name: 'Gamma', date: dayjs('2026-05-10'), owner: 'Carol', status: 'planned' },
  ]);
  const [highlightedRow, setHighlightedRow] = useState<string | null>(null);

  useEffect(() => {
    const betaRow = data.find(row => row.key === 'Beta');
    if (betaRow?.date && betaRow.date.format('YYYY-MM-DD') === '2026-04-01') {
      onSuccess();
    }
  }, [data, onSuccess]);

  const handleDateChange = (key: string, newDate: Dayjs | null) => {
    setData(prev => prev.map(row => 
      row.key === key ? { ...row, date: newDate } : row
    ));
    setHighlightedRow(key);
    setTimeout(() => setHighlightedRow(null), 1000);
  };

  const columns = [
    {
      title: 'Milestone',
      dataIndex: 'name',
      key: 'name',
      width: 100,
      render: (name: string, record: MilestoneRow) => (
        <span data-row-key={record.key}>{name}</span>
      ),
    },
    {
      title: 'Milestone date',
      dataIndex: 'date',
      key: 'date',
      width: 180,
      render: (date: Dayjs | null, record: MilestoneRow) => (
        <DatePicker
          value={date}
          onChange={(newDate) => handleDateChange(record.key, newDate)}
          format="YYYY-MM-DD"
          placeholder="YYYY-MM-DD"
          size="small"
          data-testid={`milestone-date-${record.key.toLowerCase()}`}
          style={{
            width: '100%',
            background: highlightedRow === record.key ? '#e6f7ff' : undefined,
            transition: 'background 0.3s',
          }}
          allowClear
        />
      ),
    },
    {
      title: 'Owner',
      dataIndex: 'owner',
      key: 'owner',
      width: 120,
      render: (owner: string) => (
        <Select
          value={owner}
          size="small"
          style={{ width: '100%' }}
          options={[
            { value: 'Alice', label: 'Alice' },
            { value: 'Bob', label: 'Bob' },
            { value: 'Carol', label: 'Carol' },
          ]}
          disabled
        />
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const colors: Record<string, string> = {
          complete: 'green',
          in_progress: 'blue',
          planned: 'gray',
        };
        return <Tag color={colors[status]}>{status.replace('_', ' ')}</Tag>;
      },
    },
  ];

  return (
    <Card title="Milestones" style={{ width: 600 }}>
      <Table
        dataSource={data}
        columns={columns}
        pagination={false}
        size="small"
        rowKey="key"
      />
    </Card>
  );
}
