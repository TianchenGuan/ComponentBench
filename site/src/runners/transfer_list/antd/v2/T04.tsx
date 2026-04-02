'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Transfer, Typography, Space, Tag, ConfigProvider, theme } from 'antd';
import type { TaskComponentProps, TransferItem } from '../../types';
import { setsEqual } from '../../types';

const { Title, Text } = Typography;

const REFERENCE = ['Read', 'Write', 'Export', 'Delete', 'Manage billing', 'View audit log'];

const roleNames = [
  'Read', 'Read-only', 'Write', 'Write (admin)', 'Export', 'Export CSV',
  'Delete', 'Delete hard', 'Manage billing', 'Manage billing (view)',
  'View audit log', 'View audit logs (export)',
];
const allItems: TransferItem[] = roleNames.map(n => ({ key: n, title: n }));

export default function T04({ onSuccess }: TaskComponentProps) {
  const [targetKeys, setTargetKeys] = useState<string[]>(['Read-only', 'Export CSV']);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && setsEqual(targetKeys, REFERENCE)) {
      successFired.current = true;
      onSuccess();
    }
  }, [targetKeys, onSuccess]);

  return (
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      <div style={{ background: '#141414', minHeight: '100vh', padding: 16 }}>
        <div style={{ maxWidth: 620, marginLeft: 'auto', marginRight: 24, marginTop: 16 }}>
          <Title level={5} style={{ color: '#fff' }}>Access roles</Title>
          <div style={{ marginBottom: 12 }}>
            <Text type="secondary" style={{ display: 'block', marginBottom: 6 }}>Required roles</Text>
            <Space size={[4, 4]} wrap>
              {REFERENCE.map(r => <Tag key={r} color="blue">{r}</Tag>)}
            </Space>
          </div>
          <Transfer
            dataSource={allItems}
            titles={['Available', 'Selected']}
            targetKeys={targetKeys}
            selectedKeys={selectedKeys}
            onChange={(keys) => setTargetKeys(keys as string[])}
            onSelectChange={(s, t) => setSelectedKeys([...s, ...t] as string[])}
            render={(item) => item.title}
            listStyle={{ width: 230, height: 280 }}
          />
        </div>
      </div>
    </ConfigProvider>
  );
}
