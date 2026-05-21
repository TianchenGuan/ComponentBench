'use client';

/**
 * inline_editable_text-antd-v2-T02: Gateway public code in table with Enter-only commit
 *
 * A compact "Service aliases" table near the top-right has two rows: "Gateway" and "Billing".
 * The "Public code" cells use AntD Typography.Text with editable triggerType=['text'] and
 * enterIcon=null — clicking the text opens an input and only Enter commits.
 * Gateway starts as "AP-042"; Billing starts as "AP-550".
 *
 * Success: Gateway/Public code committed value === "AP-137", display mode,
 * Billing/Public code unchanged at "AP-550".
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Typography, Table } from 'antd';
import type { TaskComponentProps } from '../../types';

const { Text, Title } = Typography;

interface ServiceRow {
  key: string;
  service: string;
  publicCode: string;
  owner: string;
}

export default function T02({ onSuccess }: TaskComponentProps) {
  const [data, setData] = useState<ServiceRow[]>([
    { key: 'gateway', service: 'Gateway', publicCode: 'AP-042', owner: 'Platform Team' },
    { key: 'billing', service: 'Billing', publicCode: 'AP-550', owner: 'Finance Ops' },
  ]);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    const gw = data.find((r) => r.key === 'gateway');
    const bl = data.find((r) => r.key === 'billing');
    if (
      gw &&
      !editingKey &&
      gw.publicCode === 'AP-137' &&
      bl &&
      bl.publicCode === 'AP-550'
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [data, editingKey, onSuccess]);

  const startEdit = (key: string, currentValue: string) => {
    setEditingKey(key);
    setDraft(currentValue);
  };

  const commitEdit = () => {
    if (!editingKey) return;
    setData((prev) =>
      prev.map((r) => (r.key === editingKey ? { ...r, publicCode: draft } : r)),
    );
    setEditingKey(null);
  };

  const cancelEdit = () => {
    setEditingKey(null);
    setDraft('');
  };

  const columns = [
    { title: 'Service', dataIndex: 'service', key: 'service', width: 120 },
    {
      title: 'Public code',
      dataIndex: 'publicCode',
      key: 'publicCode',
      width: 140,
      render: (val: string, record: ServiceRow) => {
        if (editingKey === record.key) {
          return (
            <input
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') commitEdit();
                if (e.key === 'Escape') cancelEdit();
              }}
              onBlur={cancelEdit}
              style={{
                border: '1px solid #d9d9d9',
                borderRadius: 4,
                padding: '2px 8px',
                fontSize: 13,
                width: '100%',
                outline: 'none',
              }}
              data-testid={`input-${record.key}`}
            />
          );
        }
        return (
          <Text
            style={{ cursor: 'pointer', fontSize: 13 }}
            onClick={() => startEdit(record.key, val)}
            data-testid={`cell-${record.key}`}
            data-value={val}
            data-mode="display"
          >
            {val}
          </Text>
        );
      },
    },
    { title: 'Owner', dataIndex: 'owner', key: 'owner', width: 130 },
  ];

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
        padding: 24,
        background: '#f5f5f5',
      }}
    >
      <Card size="small" style={{ width: 440 }} data-testid="service-aliases-card">
        <Title level={5} style={{ margin: '0 0 12px' }}>Service aliases</Title>
        <Table
          dataSource={data}
          columns={columns}
          pagination={false}
          size="small"
          rowKey="key"
        />
        <Text type="secondary" style={{ fontSize: 11, marginTop: 8, display: 'block' }}>
          Click a Public code cell to edit. Press Enter to save.
        </Text>
      </Card>
    </div>
  );
}
