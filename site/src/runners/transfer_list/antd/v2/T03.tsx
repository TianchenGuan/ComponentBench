'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button, Modal, Transfer, Typography, Space } from 'antd';
import type { TaskComponentProps, TransferItem } from '../../types';
import { setsEqual } from '../../types';

const { Title, Text } = Typography;

const assets: TransferItem[] = Array.from({ length: 100 }, (_, i) => {
  const name = `Asset ${String(i + 1).padStart(2, '0')}`;
  return { key: name, title: name };
});

const TARGET = ['Asset 73', 'Asset 74', 'Asset 79'];

export default function T03({ onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const [targetKeys, setTargetKeys] = useState<string[]>(['Asset 12']);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [committed, setCommitted] = useState<string[] | null>(null);
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && committed && setsEqual(committed, TARGET)) {
      successFired.current = true;
      onSuccess();
    }
  }, [committed, onSuccess]);

  const handleSave = () => {
    setCommitted([...targetKeys]);
    setOpen(false);
  };

  return (
    <div style={{ padding: 24 }}>
      <Space direction="vertical">
        <Title level={4}>Asset monitoring</Title>
        <Text type="secondary">Manage which assets are monitored in this environment.</Text>
        <Button type="primary" onClick={() => setOpen(true)}>Edit monitored assets</Button>
      </Space>
      <Modal
        title="Monitored assets"
        open={open}
        onCancel={() => setOpen(false)}
        width={700}
        footer={[
          <Button key="cancel" onClick={() => setOpen(false)}>Cancel</Button>,
          <Button key="save" type="primary" onClick={handleSave}>Save assets</Button>,
        ]}
      >
        <Transfer
          dataSource={assets}
          titles={['Available', 'Selected']}
          targetKeys={targetKeys}
          selectedKeys={selectedKeys}
          onChange={(keys) => setTargetKeys(keys as string[])}
          onSelectChange={(s, t) => setSelectedKeys([...s, ...t] as string[])}
          render={(item) => item.title}
          listStyle={{ width: 270, height: 350 }}
        />
      </Modal>
    </div>
  );
}
