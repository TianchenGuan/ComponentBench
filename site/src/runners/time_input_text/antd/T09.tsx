'use client';

/**
 * time_input_text-antd-T09: Edit a time value inside a table cell
 * 
 * Layout: table_cell anchored near the top-left of the viewport (a dense scheduling table).
 * The table is titled "Delivery slots" and has three rows: Slot A, Slot B, Slot C.
 * There is a "Cutoff time" column; each cell contains an AntD TimePicker (size='small'):
 * - Slot A cutoff is prefilled 22:00
 * - Slot B cutoff is prefilled 21:00  ← TARGET ROW
 * - Slot C cutoff is prefilled 20:00
 * Configuration: format='HH:mm', allowClear=true, needConfirm=false.
 * Clutter=high: the table also includes a "Status" column (tags), a "Notes" text column, and per-row action buttons (Edit/Delete) that are distractors.
 * Only the Slot B TimePicker value in the Cutoff time column determines success.
 * 
 * Success: In the "Delivery slots" table, the TimePicker in row "Slot B" under the "Cutoff time" column has committed value 23:55.
 */

import React, { useState, useEffect } from 'react';
import { Card, Table, TimePicker, Tag, Button, Space } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

interface SlotRow {
  key: string;
  slot: string;
  cutoffTime: Dayjs | null;
  status: string;
  notes: string;
}

export default function T09({ onSuccess }: TaskComponentProps) {
  const [data, setData] = useState<SlotRow[]>([
    { key: 'slot-a', slot: 'Slot A', cutoffTime: dayjs('22:00', 'HH:mm'), status: 'Active', notes: 'Morning delivery' },
    { key: 'slot-b', slot: 'Slot B', cutoffTime: dayjs('21:00', 'HH:mm'), status: 'Active', notes: 'Afternoon delivery' },
    { key: 'slot-c', slot: 'Slot C', cutoffTime: dayjs('20:00', 'HH:mm'), status: 'Pending', notes: 'Evening delivery' },
  ]);

  useEffect(() => {
    const slotB = data.find(d => d.key === 'slot-b');
    if (slotB && slotB.cutoffTime && slotB.cutoffTime.format('HH:mm') === '23:55') {
      onSuccess();
    }
  }, [data, onSuccess]);

  const handleTimeChange = (key: string, time: Dayjs | null) => {
    setData(prev => prev.map(row => 
      row.key === key ? { ...row, cutoffTime: time } : row
    ));
  };

  const columns = [
    {
      title: 'Slot',
      dataIndex: 'slot',
      key: 'slot',
      width: 80,
    },
    {
      title: 'Cutoff time',
      dataIndex: 'cutoffTime',
      key: 'cutoffTime',
      width: 140,
      render: (time: Dayjs | null, record: SlotRow) => (
        <TimePicker
          value={time}
          onChange={(newTime) => handleTimeChange(record.key, newTime)}
          format="HH:mm"
          allowClear
          needConfirm={false}
          size="small"
          data-testid={`cutoff-${record.key}`}
          data-row={record.key}
          data-col="cutoff"
        />
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={status === 'Active' ? 'green' : 'orange'}>{status}</Tag>
      ),
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
      key: 'notes',
      width: 150,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      render: () => (
        <Space size="small">
          <Button type="text" size="small" icon={<EditOutlined />} />
          <Button type="text" size="small" danger icon={<DeleteOutlined />} />
        </Space>
      ),
    },
  ];

  return (
    <Card title="Delivery slots" style={{ width: 650 }}>
      <Table
        dataSource={data}
        columns={columns}
        pagination={false}
        size="small"
      />
    </Card>
  );
}
