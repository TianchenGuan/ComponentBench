'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button, Transfer, Typography, Space, ConfigProvider, theme } from 'antd';
import type { TaskComponentProps, TransferItem } from '../../types';
import { setsEqual } from '../../types';

const { Title, Text } = Typography;

const projects: TransferItem[] = [];
for (const prefix of ['Omega', 'Sigma', 'Tau']) {
  for (let i = 1; i <= 20; i++) {
    const name = `Project ${prefix} ${String(i).padStart(2, '0')}`;
    projects.push({ key: name, title: name });
  }
}

const TARGET = [
  'Project Omega 03', 'Project Omega 14', 'Project Sigma 07',
  'Project Sigma 19', 'Project Tau 02',
];

export default function T02({ onSuccess }: TaskComponentProps) {
  const [targetKeys, setTargetKeys] = useState<string[]>(['Project Tau 03']);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [committed, setCommitted] = useState<string[] | null>(null);
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && committed && setsEqual(committed, TARGET)) {
      successFired.current = true;
      onSuccess();
    }
  }, [committed, onSuccess]);

  return (
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      <div style={{ background: '#141414', minHeight: '100vh', padding: 24 }}>
        <div style={{ maxWidth: 780, marginLeft: 80 }}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Title level={4} style={{ color: '#fff' }}>Project access</Title>
            <Text type="secondary">Manage which projects are accessible to this workspace.</Text>
            <Transfer
              dataSource={projects}
              titles={['Available', 'Selected projects']}
              targetKeys={targetKeys}
              selectedKeys={selectedKeys}
              onChange={(keys) => setTargetKeys(keys as string[])}
              onSelectChange={(s, t) => setSelectedKeys([...s, ...t] as string[])}
              render={(item) => item.title}
              showSearch
              pagination={{ pageSize: 10 }}
              listStyle={{ width: 300, height: 400 }}
            />
            <Button type="primary" onClick={() => setCommitted([...targetKeys])}>
              Apply projects
            </Button>
          </Space>
        </div>
      </div>
    </ConfigProvider>
  );
}
