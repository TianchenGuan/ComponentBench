'use client';

/**
 * slider_single-antd-T06: Set CPU limit to 70% in a table
 * 
 * Layout: table_cell scene centered on the viewport: a Resource Limits table with three rows and a slider in each row.
 * Columns: "Resource" (text) and "Limit" (slider + percent readout).
 * Rows (and sliders) are labeled: "CPU limit", "Memory limit", and "IO limit". All sliders share the same configuration: range 0–100, step=5.
 * Initial state: CPU=50%, Memory=70%, IO=40% (each row shows a small "Current: XX%" to the right of its slider).
 * The sliders are slightly smaller than the default because they are inside table cells; thumbs are closer together visually.
 * Clutter: the table header includes non-required controls like a search input and a "Reset filters" button, but they do not affect success.
 * There is no Apply button; changing a row updates its percent readout immediately.
 * 
 * Success: The slider in the 'CPU limit' row equals 70. The correct instance is required: only the CPU row counts.
 */

import React, { useState, useEffect } from 'react';
import { Card, Table, Slider, Typography, Input, Button, Space } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

export default function T06({ onSuccess }: TaskComponentProps) {
  const [cpuLimit, setCpuLimit] = useState(50);
  const [memoryLimit, setMemoryLimit] = useState(70);
  const [ioLimit, setIoLimit] = useState(40);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    if (cpuLimit === 70) {
      onSuccess();
    }
  }, [cpuLimit, onSuccess]);

  const columns = [
    {
      title: 'Resource',
      dataIndex: 'resource',
      key: 'resource',
      width: 150,
    },
    {
      title: 'Limit',
      dataIndex: 'limit',
      key: 'limit',
      render: (_: unknown, record: { key: string; value: number; setValue: (v: number) => void; testId: string }) => (
        <Space style={{ width: '100%' }}>
          <Slider
            min={0}
            max={100}
            step={5}
            value={record.value}
            onChange={record.setValue}
            style={{ width: 200 }}
            data-testid={record.testId}
          />
          <Text style={{ minWidth: 60 }}>Current: {record.value}%</Text>
        </Space>
      ),
    },
  ];

  const dataSource = [
    { key: 'cpu', resource: 'CPU limit', value: cpuLimit, setValue: setCpuLimit, testId: 'slider-limit-cpu' },
    { key: 'memory', resource: 'Memory limit', value: memoryLimit, setValue: setMemoryLimit, testId: 'slider-limit-memory' },
    { key: 'io', resource: 'IO limit', value: ioLimit, setValue: setIoLimit, testId: 'slider-limit-io' },
  ];

  return (
    <Card title="Resource Limits" style={{ width: 550 }}>
      <Space style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Input
          placeholder="Search resources..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 200 }}
        />
        <Button>Reset filters</Button>
      </Space>
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        size="small"
      />
    </Card>
  );
}
