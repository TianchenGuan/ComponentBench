'use client';

/**
 * date_picker_single-antd-v2-T03: Milestone B due date from reference chip + row Save
 */

import React, { useState, useEffect } from 'react';
import { Table, DatePicker, Button, Tag, Space, Typography } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../../types';

const { Text } = Typography;

type RowKey = 'a' | 'b' | 'c';

export default function T03({ onSuccess }: TaskComponentProps) {
  const [draftA, setDraftA] = useState<Dayjs>(dayjs('2027-03-22'));
  const [draftB, setDraftB] = useState<Dayjs | null>(null);
  const [draftC, setDraftC] = useState<Dayjs>(dayjs('2027-05-11'));
  const [committedA, setCommittedA] = useState('2027-03-22');
  const [committedB, setCommittedB] = useState<string | null>(null);
  const [committedC, setCommittedC] = useState('2027-05-11');

  useEffect(() => {
    if (
      committedB === '2027-04-06' &&
      committedA === '2027-03-22' &&
      committedC === '2027-05-11'
    ) {
      onSuccess();
    }
  }, [committedA, committedB, committedC, onSuccess]);

  const saveRow = (key: RowKey) => {
    if (key === 'a') setCommittedA(draftA.format('YYYY-MM-DD'));
    if (key === 'b') setCommittedB(draftB ? draftB.format('YYYY-MM-DD') : null);
    if (key === 'c') setCommittedC(draftC.format('YYYY-MM-DD'));
  };

  const columns = [
    { title: 'Milestone', dataIndex: 'label', width: 120 },
    {
      title: 'Due date',
      dataIndex: 'due',
      render: (_: unknown, record: { key: RowKey }) => {
        const picker =
          record.key === 'a' ? (
            <DatePicker
              value={draftA}
              onChange={(d) => d && setDraftA(d)}
              format="YYYY-MM-DD"
              size="small"
              style={{ width: 140 }}
              data-testid="due-milestone-a"
              defaultPickerValue={dayjs('2027-03-01')}
            />
          ) : record.key === 'b' ? (
            <DatePicker
              value={draftB}
              onChange={(d) => setDraftB(d)}
              format="YYYY-MM-DD"
              placeholder="Select"
              size="small"
              style={{ width: 140 }}
              data-testid="due-milestone-b"
              defaultPickerValue={dayjs('2027-03-01')}
            />
          ) : (
            <DatePicker
              value={draftC}
              onChange={(d) => d && setDraftC(d)}
              format="YYYY-MM-DD"
              size="small"
              style={{ width: 140 }}
              data-testid="due-milestone-c"
              defaultPickerValue={dayjs('2027-05-01')}
            />
          );
        return picker;
      },
    },
    {
      title: '',
      key: 'save',
      width: 100,
      render: (_: unknown, record: { key: RowKey }) => (
        <Button
          size="small"
          type="primary"
          onClick={() => saveRow(record.key)}
          data-testid={`save-milestone-${record.key}`}
        >
          Save
        </Button>
      ),
    },
  ];

  const dataSource = [
    { key: 'a' as RowKey, label: 'Milestone A' },
    { key: 'b' as RowKey, label: 'Milestone B' },
    { key: 'c' as RowKey, label: 'Milestone C' },
  ];

  return (
    <div style={{ maxWidth: 640 }}>
      <Space style={{ marginBottom: 12 }} wrap>
        <Tag>RC</Tag>
        <Tag color="processing">Train</Tag>
        <Button size="small">Filter</Button>
        <Button size="small">Export</Button>
      </Space>
      <div style={{ marginBottom: 12 }}>
        <Tag color="blue" style={{ padding: '6px 12px', fontSize: 13 }} data-testid="reference-chip">
          Target date: 2027-04-06
        </Tag>
      </div>
      <Text strong style={{ display: 'block', marginBottom: 8 }}>
        Release milestones
      </Text>
      <Table
        size="small"
        pagination={false}
        dataSource={dataSource}
        columns={columns as any}
        bordered
      />
    </div>
  );
}
