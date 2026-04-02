'use client';

/**
 * datetime_picker_single-antd-T10: AntD table-cell match reference with OK
 *
 * Layout: table_cell scene — a compact table is centered, with the editable cell anchored near the bottom-right of the viewport.
 * Clutter (high, realistic): table has multiple columns (Campaign name, Status, Owner, Preview send time, Send at, Hold until) and one non-functional "Filter" input above it.
 * Instances: 2 AntD DatePicker(showTime) editors in the row "Campaign A":
 *   - "Send at" (editable cell)  ← TARGET
 *   - "Hold until" (editable cell) (distractor)
 * Guidance: the "Preview send time" column displays a pill: "Preview: Apr 1, 2026 · 9:00 AM".
 * Behavior: clicking an editable datetime cell opens a popover with calendar+time; needConfirm=true so OK must be clicked.
 * Initial state (Campaign A):
 *   - Preview send time: Apr 1, 2026 9:00 AM (reference)
 *   - Send at: Apr 1, 2026 8:00 AM (must match reference)
 *   - Hold until: Apr 1, 2026 9:00 AM (distractor already matches reference but NOT the target column)
 *
 * Success: The "Send at" cell for Campaign A is committed to the same datetime as the Preview pill (2026-04-01 09:00).
 */

import React, { useState, useEffect } from 'react';
import { Card, DatePicker, Table, Tag, Input } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

interface CampaignRow {
  key: string;
  name: string;
  status: string;
  owner: string;
  previewSendTime: string;
  sendAt: Dayjs | null;
  holdUntil: Dayjs | null;
}

export default function T10({ onSuccess }: TaskComponentProps) {
  const [data, setData] = useState<CampaignRow[]>([
    {
      key: 'a',
      name: 'Campaign A',
      status: 'Draft',
      owner: 'Alice',
      previewSendTime: 'Apr 1, 2026 · 9:00 AM',
      sendAt: dayjs('2026-04-01 08:00', 'YYYY-MM-DD HH:mm'),
      holdUntil: dayjs('2026-04-01 09:00', 'YYYY-MM-DD HH:mm'),
    },
  ]);

  useEffect(() => {
    const campaignA = data.find((row) => row.key === 'a');
    if (campaignA && campaignA.sendAt && campaignA.sendAt.format('YYYY-MM-DD HH:mm') === '2026-04-01 09:00') {
      onSuccess();
    }
  }, [data, onSuccess]);

  const handleSendAtChange = (key: string, datetime: Dayjs | null) => {
    setData((prev) =>
      prev.map((row) => (row.key === key ? { ...row, sendAt: datetime } : row))
    );
  };

  const handleHoldUntilChange = (key: string, datetime: Dayjs | null) => {
    setData((prev) =>
      prev.map((row) => (row.key === key ? { ...row, holdUntil: datetime } : row))
    );
  };

  const columns = [
    {
      title: 'Campaign name',
      dataIndex: 'name',
      key: 'name',
      width: 120,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: string) => <Tag>{status}</Tag>,
    },
    {
      title: 'Owner',
      dataIndex: 'owner',
      key: 'owner',
      width: 80,
    },
    {
      title: 'Preview send time',
      dataIndex: 'previewSendTime',
      key: 'previewSendTime',
      width: 180,
      render: (text: string) => (
        <Tag color="blue" data-testid="ref-preview-send">
          Preview: {text}
        </Tag>
      ),
    },
    {
      title: 'Send at',
      dataIndex: 'sendAt',
      key: 'sendAt',
      width: 200,
      render: (_: unknown, record: CampaignRow) => (
        <DatePicker
          size="small"
          showTime={{ format: 'HH:mm' }}
          format="YYYY-MM-DD HH:mm"
          value={record.sendAt}
          onChange={(datetime) => handleSendAtChange(record.key, datetime)}
          needConfirm
          data-testid={`dt-send-at-${record.key}`}
        />
      ),
    },
    {
      title: 'Hold until',
      dataIndex: 'holdUntil',
      key: 'holdUntil',
      width: 200,
      render: (_: unknown, record: CampaignRow) => (
        <DatePicker
          size="small"
          showTime={{ format: 'HH:mm' }}
          format="YYYY-MM-DD HH:mm"
          value={record.holdUntil}
          onChange={(datetime) => handleHoldUntilChange(record.key, datetime)}
          needConfirm
          data-testid={`dt-hold-until-${record.key}`}
        />
      ),
    },
  ];

  return (
    <Card title="Email Campaigns" style={{ width: 900 }}>
      <div style={{ marginBottom: 16 }}>
        <Input placeholder="Filter campaigns..." style={{ width: 200 }} />
      </div>
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
