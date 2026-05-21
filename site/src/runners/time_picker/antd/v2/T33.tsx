'use client';

/**
 * time_picker-antd-v2-T33: Region B escalation time in a row-scoped table
 *
 * Three regions with TimePicker (minuteStep 5) and row Save. Only Region B should become 23:55; A and C stay 23:00.
 *
 * Success: After Save on Region B row, B is 23:55; A and C committed 23:00.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Button, TimePicker, Table, Tag, Space, Switch, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../../types';

const { Text } = Typography;

type RowKey = 'A' | 'B' | 'C';

interface EscRow {
  key: RowKey;
  region: string;
}

const ROWS: EscRow[] = [
  { key: 'A', region: 'Region A' },
  { key: 'B', region: 'Region B' },
  { key: 'C', region: 'Region C' },
];

function timeKey(d: Dayjs | null): string {
  return d ? d.format('HH:mm') : '';
}

export default function T33({ onSuccess }: TaskComponentProps) {
  const initial = dayjs('23:00', 'HH:mm');
  const [drafts, setDrafts] = useState<Record<RowKey, Dayjs | null>>({
    A: initial,
    B: initial,
    C: initial,
  });
  const [committed, setCommitted] = useState<Record<RowKey, Dayjs | null>>({
    A: initial,
    B: initial,
    C: initial,
  });
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    if (
      timeKey(committed.A) === '23:00' &&
      timeKey(committed.B) === '23:55' &&
      timeKey(committed.C) === '23:00'
    ) {
      fired.current = true;
      onSuccess();
    }
  }, [committed, onSuccess]);

  const columns: ColumnsType<EscRow> = [
    {
      title: 'Region',
      dataIndex: 'region',
      width: 110,
      render: (region: string, record) => (
        <Space direction="vertical" size={2}>
          <Text strong style={{ fontSize: 12 }}>
            {region}
          </Text>
          <Space size={4} wrap>
            <Tag style={{ margin: 0 }}>SLA</Tag>
            <Switch size="small" defaultChecked={record.key === 'B'} />
          </Space>
        </Space>
      ),
    },
    {
      title: 'Escalation time',
      key: 'time',
      render: (_, record) => (
        <TimePicker
          value={drafts[record.key]}
          onChange={(t) => setDrafts((d) => ({ ...d, [record.key]: t }))}
          format="HH:mm"
          minuteStep={5}
          needConfirm={false}
          size="small"
          style={{ width: 128 }}
          data-testid={`tp-esc-${record.key}`}
        />
      ),
    },
    {
      title: '',
      key: 'save',
      width: 88,
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          onClick={() => setCommitted((c) => ({ ...c, [record.key]: drafts[record.key] }))}
          data-testid={`save-region-${record.key.toLowerCase()}`}
        >
          Save
        </Button>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 520 }}>
      <Text strong style={{ display: 'block', marginBottom: 8, fontSize: 13 }}>
        Escalation times
      </Text>
      <Table<EscRow>
        size="small"
        pagination={false}
        dataSource={ROWS}
        columns={columns}
        bordered
      />
      <Text type="secondary" style={{ fontSize: 11, marginTop: 8, display: 'block' }}>
        Edit only Region B to 23:55, then Save that row.
      </Text>
    </div>
  );
}
