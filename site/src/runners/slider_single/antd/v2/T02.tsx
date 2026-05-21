'use client';

/**
 * slider_single-antd-v2-T02: EU row tax rate in dense table
 *
 * Tax overrides table: US=7, EU=12, APAC=10. Row-local Save commits that row only.
 * Clutter: headers, search, export.
 *
 * Success (committed): EU / Tax rate === 18%, US=7, APAC=10; EU Save clicked path via committed state.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Button, Card, Input, Slider, Space, Table, Typography } from 'antd';
import type { TaskComponentProps } from '../../types';

const { Text } = Typography;

type RowKey = 'us' | 'eu' | 'apac';

export default function T02({ onSuccess }: TaskComponentProps) {
  const [draft, setDraft] = useState({ us: 7, eu: 12, apac: 10 });
  const [committed, setCommitted] = useState({ us: 7, eu: 12, apac: 10 });
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (committed.eu === 18 && committed.us === 7 && committed.apac === 10) {
      successFired.current = true;
      onSuccess();
    }
  }, [committed, onSuccess]);

  const saveRow = (key: RowKey) => {
    setCommitted((c) => ({ ...c, [key]: draft[key] }));
  };

  const columns = [
    { title: 'Region', dataIndex: 'region', key: 'region', width: 100 },
    {
      title: 'Tax rate',
      key: 'rate',
      render: (_: unknown, record: { key: RowKey; region: string }) => (
        <div style={{ minWidth: 200 }}>
          <Slider
            min={0}
            max={30}
            step={1}
            value={draft[record.key]}
            onChange={(v) => setDraft((d) => ({ ...d, [record.key]: v }))}
            style={{ marginBottom: 4 }}
            data-testid={`slider-tax-${record.key}`}
          />
          <Text type="secondary" style={{ fontSize: 12 }}>
            {draft[record.key]}% (saved {committed[record.key]}%)
          </Text>
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_: unknown, record: { key: RowKey }) => (
        <Button
          size="small"
          type="primary"
          onClick={() => saveRow(record.key)}
          data-testid={record.key === 'eu' ? 'save-eu-tax-rate' : `save-${record.key}-tax-rate`}
        >
          Save
        </Button>
      ),
    },
  ];

  const dataSource = [
    { key: 'us' as RowKey, region: 'US' },
    { key: 'eu' as RowKey, region: 'EU' },
    { key: 'apac' as RowKey, region: 'APAC' },
  ];

  return (
    <div style={{ padding: 12, maxWidth: 640 }}>
      <Card
        size="small"
        title="Tax overrides"
        extra={
          <Space>
            <Input.Search placeholder="Filter regions" allowClear style={{ width: 160 }} />
            <Button size="small">Export</Button>
          </Space>
        }
      >
        <Table
          size="small"
          pagination={false}
          columns={columns}
          dataSource={dataSource}
          style={{ fontSize: 12 }}
        />
      </Card>
    </div>
  );
}
