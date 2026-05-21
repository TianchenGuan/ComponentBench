'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button, Modal, Transfer, Typography, Space } from 'antd';
import type { TaskComponentProps, TransferItem } from '../../types';
import { setsEqual } from '../../types';

const { Title, Text } = Typography;

const allItems: TransferItem[] = [
  'Finance', 'HR', 'Security', 'Legal', 'Sales', 'Support',
].map(n => ({ key: n, title: n }));

const TARGET = ['Finance', 'Security'];

export default function T06({ onSuccess }: TaskComponentProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [targetKeys, setTargetKeys] = useState<string[]>(['Finance', 'HR']);
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
    setConfirmOpen(true);
  };

  const handleConfirm = () => {
    setCommitted([...targetKeys]);
    setConfirmOpen(false);
    setModalOpen(false);
  };

  return (
    <div style={{ padding: 24 }}>
      <Space direction="vertical">
        <Title level={4}>Approval workflow</Title>
        <Text type="secondary">Manage approver groups for this workflow.</Text>
        <Button type="primary" onClick={() => setModalOpen(true)}>Edit approvers</Button>
      </Space>
      <Modal
        title="Approvers"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setModalOpen(false)}>Cancel</Button>,
          <Button key="save" type="primary" onClick={handleSave}>Save</Button>,
        ]}
      >
        <Transfer
          dataSource={allItems}
          titles={['Available', 'Selected']}
          targetKeys={targetKeys}
          selectedKeys={selectedKeys}
          onChange={(keys) => setTargetKeys(keys as string[])}
          onSelectChange={(s, t) => setSelectedKeys([...s, ...t] as string[])}
          render={(item) => item.title}
          listStyle={{ width: 200, height: 250 }}
        />
      </Modal>
      <Modal
        title="Confirm changes"
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setConfirmOpen(false)}>Cancel</Button>,
          <Button key="confirm" type="primary" onClick={handleConfirm}>Confirm</Button>,
        ]}
      >
        <Text>Are you sure you want to update the approvers list?</Text>
      </Modal>
    </div>
  );
}
