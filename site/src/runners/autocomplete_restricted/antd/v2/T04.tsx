'use client';

/**
 * autocomplete_restricted-antd-v2-T04
 *
 * Compact editable server table. Server A is read-only; Server B and Server C have
 * editable Region selects with row-local Save buttons.
 * Success: Server B Region = eu-central-1, Server C unchanged (eu-west-3), Server B Save clicked.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Table, Select, Button, Typography, Tag } from 'antd';
import type { TaskComponentProps } from '../../types';

const { Text } = Typography;

const regionOptions = [
  'us-east-1',
  'us-west-2',
  'eu-central-1',
  'eu-west-3',
].map((r) => ({ label: r, value: r }));

interface ServerRow {
  key: string;
  name: string;
  status: string;
  region: string;
  editable: boolean;
}

export default function T04({ onSuccess }: TaskComponentProps) {
  const [serverB, setServerB] = useState('us-east-1');
  const [serverC, setServerC] = useState('eu-west-3');
  const [serverBSaved, setServerBSaved] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (serverBSaved && serverB === 'eu-central-1' && serverC === 'eu-west-3') {
      successFired.current = true;
      onSuccess();
    }
  }, [serverBSaved, serverB, serverC, onSuccess]);

  const data: ServerRow[] = [
    { key: 'a', name: 'Server A', status: 'healthy', region: 'us-west-2', editable: false },
    { key: 'b', name: 'Server B', status: 'healthy', region: serverB, editable: true },
    { key: 'c', name: 'Server C', status: 'degraded', region: serverC, editable: true },
  ];

  const columns = [
    {
      title: 'Server',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, row: ServerRow) => (
        <Text strong>{name} <Tag color={row.status === 'healthy' ? 'green' : 'orange'} style={{ fontSize: 11 }}>{row.status}</Tag></Text>
      ),
    },
    {
      title: 'Region',
      dataIndex: 'region',
      key: 'region',
      render: (_: string, row: ServerRow) => {
        if (!row.editable) return <Text>{row.region}</Text>;
        return (
          <Select
            size="small"
            style={{ width: 160 }}
            value={row.region}
            onChange={(v) => {
              if (row.key === 'b') { setServerB(v); setServerBSaved(false); }
              if (row.key === 'c') { setServerC(v); }
            }}
            showSearch
            filterOption={(input, opt) => (opt?.label ?? '').toLowerCase().includes(input.toLowerCase())}
            options={regionOptions}
          />
        );
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: unknown, row: ServerRow) => {
        if (!row.editable) return null;
        return (
          <Button
            size="small"
            type="primary"
            data-testid={`save-server-${row.key}`}
            onClick={() => {
              if (row.key === 'b') setServerBSaved(true);
            }}
          >
            Save
          </Button>
        );
      },
    },
  ];

  return (
    <div style={{ padding: '24px 48px' }}>
      <Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>
        Server fleet — click Save on individual rows to commit region changes.
      </Text>
      <Table
        dataSource={data}
        columns={columns}
        pagination={false}
        size="small"
        bordered
        style={{ maxWidth: 600 }}
      />
    </div>
  );
}
