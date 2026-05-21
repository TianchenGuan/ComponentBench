'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button, Drawer, Transfer, Typography, Space, Divider } from 'antd';
import type { TransferProps } from 'antd';
import type { TaskComponentProps, TransferItem } from '../../types';
import { setsEqual } from '../../types';

const { Title, Text } = Typography;

const names = [
  'On-call Engineer', 'Incident Commander', 'Engineering Manager',
  'Security Officer', 'SRE', 'Support Lead', 'QA Lead', 'Finance Partner',
];
const allItems: TransferItem[] = names.map(n => ({ key: n, title: n }));

const ESC_TARGET = ['On-call Engineer', 'Engineering Manager', 'Security Officer', 'SRE'];
const DEF_MUST_REMAIN = ['Support Lead'];

export default function T01({ onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const [escKeys, setEscKeys] = useState<string[]>(['On-call Engineer', 'Incident Commander']);
  const [escSel, setEscSel] = useState<string[]>([]);
  const [defKeys, setDefKeys] = useState<string[]>(['Support Lead']);
  const [defSel, setDefSel] = useState<string[]>([]);
  const [committed, setCommitted] = useState<{ esc: string[]; def: string[] } | null>(null);
  const successFired = useRef(false);

  useEffect(() => {
    if (
      !successFired.current && committed &&
      setsEqual(committed.esc, ESC_TARGET) &&
      setsEqual(committed.def, DEF_MUST_REMAIN)
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [committed, onSuccess]);

  const handleSave = () => {
    setCommitted({ esc: [...escKeys], def: [...defKeys] });
    setOpen(false);
  };

  return (
    <div style={{ padding: 24, minHeight: '100vh' }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Title level={4}>Notification settings</Title>
        <Text type="secondary">Configure escalation and default recipient groups for incident alerts.</Text>
        <Divider />
        <Text>Policy status: Active</Text>
        <Text>Last updated: 2024-11-15</Text>
        <Text>Notification channel: Slack #ops-alerts</Text>
        <Text>Retry policy: 3 attempts</Text>
      </Space>
      <div style={{ position: 'fixed', bottom: 24, right: 24 }}>
        <Button type="primary" onClick={() => setOpen(true)}>Edit recipients</Button>
      </div>
      <Drawer
        title="Edit recipients"
        placement="right"
        width={640}
        open={open}
        onClose={() => setOpen(false)}
        extra={<Button type="primary" onClick={handleSave}>Save recipients</Button>}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <Title level={5}>Default recipients</Title>
            <Transfer
              dataSource={allItems}
              titles={['Available', 'Selected']}
              targetKeys={defKeys}
              selectedKeys={defSel}
              onChange={(keys) => setDefKeys(keys as string[])}
              onSelectChange={(s, t) => setDefSel([...s, ...t] as string[])}
              render={(item) => item.title}
              showSearch
              listStyle={{ width: 230, height: 200 }}
            />
          </div>
          <Divider />
          <div>
            <Title level={5}>Escalation recipients</Title>
            <Transfer
              dataSource={allItems}
              titles={['Available', 'Selected']}
              targetKeys={escKeys}
              selectedKeys={escSel}
              onChange={(keys) => setEscKeys(keys as string[])}
              onSelectChange={(s, t) => setEscSel([...s, ...t] as string[])}
              render={(item) => item.title}
              showSearch
              listStyle={{ width: 230, height: 200 }}
            />
          </div>
        </Space>
      </Drawer>
    </div>
  );
}
