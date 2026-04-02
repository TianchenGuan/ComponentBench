'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Drawer, Transfer, Switch, Typography, Space, Divider, Tag } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import type { TaskComponentProps, TransferItem } from '../types';
import { setsEqual } from '../types';

const { Text, Title } = Typography;

const allRoles: TransferItem[] = [
  { key: 'on-call-engineer', title: 'On-call Engineer' },
  { key: 'incident-commander', title: 'Incident Commander' },
  { key: 'engineering-manager', title: 'Engineering Manager' },
  { key: 'security-officer', title: 'Security Officer' },
  { key: 'support-lead', title: 'Support Lead' },
  { key: 'qa-lead', title: 'QA Lead' },
  { key: 'sre', title: 'SRE' },
  { key: 'devops-lead', title: 'DevOps Lead' },
];

const goalTargetKeys = ['on-call-engineer', 'engineering-manager', 'security-officer'];
const requiredRoles = ['On-call Engineer', 'Engineering Manager', 'Security Officer'];

export default function T10({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [escalationTargetKeys, setEscalationTargetKeys] = useState<string[]>(['on-call-engineer', 'incident-commander']);
  const [escalationSelectedKeys, setEscalationSelectedKeys] = useState<string[]>([]);
  const [fyiTargetKeys, setFyiTargetKeys] = useState<string[]>([]);
  const [fyiSelectedKeys, setFyiSelectedKeys] = useState<string[]>([]);
  const [pagerTargetKeys, setPagerTargetKeys] = useState<string[]>([]);
  const [pagerSelectedKeys, setPagerSelectedKeys] = useState<string[]>([]);
  const [committedKeys, setCommittedKeys] = useState<string[]>(['on-call-engineer', 'incident-commander']);
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && setsEqual(committedKeys, goalTargetKeys)) {
      successFired.current = true;
      onSuccess();
    }
  }, [committedKeys, onSuccess]);

  const handleSave = () => { setCommittedKeys([...escalationTargetKeys]); setDrawerOpen(false); };
  const handleCancel = () => { setEscalationTargetKeys([...committedKeys]); setDrawerOpen(false); };
  const handleOpen = () => { setEscalationTargetKeys([...committedKeys]); setDrawerOpen(true); };

  return (
    <>
      <Card title="Alerting Dashboard" style={{ width: 900 }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div style={{ background: '#f5f5f5', height: 100, borderRadius: 8 }} />
          <Button type="primary" icon={<SettingOutlined />} onClick={handleOpen}>Advanced routing</Button>
        </Space>
      </Card>
      <Drawer title="Advanced Routing" placement="right" width={700} open={drawerOpen} onClose={handleCancel}
        footer={<Space><Button onClick={handleCancel}>Cancel</Button><Button type="primary" onClick={handleSave}>Save settings</Button></Space>}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div data-testid="transfer-escalation"><Text strong>Escalation recipients</Text>
            <div style={{ marginBottom: 8 }}>{requiredRoles.map(r => <Tag key={r} color="blue">{r}</Tag>)}</div>
            <Transfer dataSource={allRoles} titles={['Available', 'Selected']} targetKeys={escalationTargetKeys}
              selectedKeys={escalationSelectedKeys} onChange={k => setEscalationTargetKeys(k as string[])}
              onSelectChange={(s, t) => setEscalationSelectedKeys([...s, ...t] as string[])}
              render={i => i.title} listStyle={{ width: 220, height: 180 }} />
          </div>
          <div data-testid="transfer-fyi"><Text strong>FYI recipients</Text>
            <Transfer dataSource={allRoles} titles={['Available', 'Selected']} targetKeys={fyiTargetKeys}
              selectedKeys={fyiSelectedKeys} onChange={k => setFyiTargetKeys(k as string[])}
              onSelectChange={(s, t) => setFyiSelectedKeys([...s, ...t] as string[])}
              render={i => i.title} listStyle={{ width: 220, height: 150 }} />
          </div>
          <div data-testid="transfer-pager"><Text strong>Pager recipients</Text>
            <Transfer dataSource={allRoles} titles={['Available', 'Selected']} targetKeys={pagerTargetKeys}
              selectedKeys={pagerSelectedKeys} onChange={k => setPagerTargetKeys(k as string[])}
              onSelectChange={(s, t) => setPagerSelectedKeys([...s, ...t] as string[])}
              render={i => i.title} listStyle={{ width: 220, height: 150 }} />
          </div>
        </Space>
      </Drawer>
    </>
  );
}
