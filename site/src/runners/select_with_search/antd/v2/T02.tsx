'use client';

/**
 * select_with_search-antd-v2-T02: Pipeline B region in compact row editor
 *
 * Table with 3 rows: Pipeline A (read-only), Pipeline B (editable), Pipeline C (editable).
 * Pipeline B and C have Ant Design Select with showSearch in the Region column plus row-local Save.
 * Region options: South Asia, Southeast Asia, East Asia, Middle East, Africa.
 * Initial: Pipeline B = Europe, Pipeline C = East Asia.
 * Success: Pipeline B Region = "South Asia", Pipeline C still "East Asia", Save for Pipeline B clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Table, Select, Button, Card, Typography } from 'antd';
import type { TaskComponentProps } from '../../types';

const { Text } = Typography;

const regionOptions = [
  { value: 'South Asia', label: 'South Asia' },
  { value: 'Southeast Asia', label: 'Southeast Asia' },
  { value: 'East Asia', label: 'East Asia' },
  { value: 'Middle East', label: 'Middle East' },
  { value: 'Africa', label: 'Africa' },
  { value: 'Europe', label: 'Europe' },
  { value: 'North America', label: 'North America' },
];

export default function T02({ onSuccess }: TaskComponentProps) {
  const [pipelineBRegion, setPipelineBRegion] = useState<string>('Europe');
  const [pipelineCRegion, setPipelineCRegion] = useState<string>('East Asia');
  const [savedB, setSavedB] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (savedB && pipelineBRegion === 'South Asia' && pipelineCRegion === 'East Asia') {
      successFired.current = true;
      onSuccess();
    }
  }, [savedB, pipelineBRegion, pipelineCRegion, onSuccess]);

  const columns = [
    {
      title: 'Pipeline',
      dataIndex: 'name',
      key: 'name',
      width: 120,
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 90,
    },
    {
      title: 'Region',
      key: 'region',
      width: 200,
      render: (_: unknown, record: { key: string; editable: boolean }) => {
        if (!record.editable) return <Text type="secondary">—</Text>;
        const value = record.key === 'b' ? pipelineBRegion : pipelineCRegion;
        const setter = record.key === 'b' ? setPipelineBRegion : setPipelineCRegion;
        return (
          <Select
            showSearch
            optionFilterProp="label"
            size="small"
            style={{ width: '100%' }}
            value={value}
            onChange={(val) => { setter(val); if (record.key === 'b') setSavedB(false); }}
            options={regionOptions}
          />
        );
      },
    },
    {
      title: '',
      key: 'action',
      width: 80,
      render: (_: unknown, record: { key: string; editable: boolean }) => {
        if (!record.editable) return null;
        return (
          <Button
            size="small"
            type="primary"
            data-testid={`save-pipeline-${record.key}`}
            onClick={() => { if (record.key === 'b') setSavedB(true); }}
          >
            Save
          </Button>
        );
      },
    },
  ];

  const data = [
    { key: 'a', name: 'Pipeline A', status: 'Active', editable: false },
    { key: 'b', name: 'Pipeline B', status: 'Active', editable: true },
    { key: 'c', name: 'Pipeline C', status: 'Paused', editable: true },
  ];

  return (
    <div style={{ padding: 24, display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', minHeight: '60vh' }}>
      <Card title="Pipelines" size="small" style={{ width: 540 }}>
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          size="small"
        />
      </Card>
    </div>
  );
}
