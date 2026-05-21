'use client';

/**
 * password_input-antd-T09: Update the Staging password in a table row
 * 
 * The page is anchored near the top-right of the viewport and shows an Ant Design table titled
 * "Environment Secrets". The table has three rows: "Dev", "Staging", and "Prod". Each row contains
 * an inline Input.Password cell (masked by default with an eye toggle) and a small row action
 * button labeled "Apply".
 * Only the Staging row is the target. Clicking "Apply" on a row commits that row and shows a
 * subtle "Applied" tag in the same row.
 * Other table columns (Last updated, Owner) are present as visual clutter.
 * 
 * Success: In the "Staging" row, the password input value equals exactly "Stage!4400" AND the
 * "Apply" control for the Staging row has been activated.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Table, Input, Button, Tag, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

interface EnvRow {
  key: string;
  environment: string;
  password: string;
  lastUpdated: string;
  owner: string;
  applied: boolean;
}

export default function T09({ onSuccess }: TaskComponentProps) {
  const [data, setData] = useState<EnvRow[]>([
    { key: 'dev', environment: 'Dev', password: '', lastUpdated: '2026-01-15', owner: 'alice@acme.io', applied: false },
    { key: 'staging', environment: 'Staging', password: '', lastUpdated: '2026-01-20', owner: 'bob@acme.io', applied: false },
    { key: 'prod', environment: 'Prod', password: '', lastUpdated: '2026-01-25', owner: 'charlie@acme.io', applied: false },
  ]);
  const successTriggeredRef = useRef(false);

  useEffect(() => {
    const stagingRow = data.find(row => row.key === 'staging');
    if (stagingRow && stagingRow.password === 'Stage!4400' && stagingRow.applied && !successTriggeredRef.current) {
      successTriggeredRef.current = true;
      onSuccess();
    }
  }, [data, onSuccess]);

  const handlePasswordChange = (key: string, value: string) => {
    setData(prev => prev.map(row => 
      row.key === key ? { ...row, password: value } : row
    ));
  };

  const handleApply = (key: string) => {
    setData(prev => prev.map(row => 
      row.key === key ? { ...row, applied: true } : row
    ));
  };

  const columns = [
    {
      title: 'Environment',
      dataIndex: 'environment',
      key: 'environment',
      width: 100,
    },
    {
      title: 'Password',
      dataIndex: 'password',
      key: 'password',
      width: 180,
      render: (text: string, record: EnvRow) => (
        <Input.Password
          value={text}
          onChange={(e) => handlePasswordChange(record.key, e.target.value)}
          data-testid={`password-input-${record.key}`}
          data-row-key={record.key}
          size="small"
          style={{ width: 150 }}
        />
      ),
    },
    {
      title: 'Last Updated',
      dataIndex: 'lastUpdated',
      key: 'lastUpdated',
      width: 120,
    },
    {
      title: 'Owner',
      dataIndex: 'owner',
      key: 'owner',
      width: 150,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_: unknown, record: EnvRow) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Button
            size="small"
            type="primary"
            onClick={() => handleApply(record.key)}
            data-testid={`apply-${record.key}`}
          >
            Apply
          </Button>
          {record.applied && (
            <Tag color="green" data-applied="true">Applied</Tag>
          )}
        </div>
      ),
    },
  ];

  return (
    <div style={{ width: 700 }}>
      <Text strong style={{ display: 'block', marginBottom: 16, fontSize: 16 }}>
        Environment Secrets
      </Text>
      <Table 
        dataSource={data} 
        columns={columns} 
        pagination={false}
        size="small"
        data-testid="env-secrets-table"
      />
    </div>
  );
}
