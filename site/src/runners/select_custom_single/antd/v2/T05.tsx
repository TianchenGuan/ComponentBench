'use client';

/**
 * select_custom_single-antd-v2-T05: Modal visual match — set Backup priority by badge and apply
 *
 * Settings page with "Escalation policy" button. Modal opens with two Ant Design Selects
 * using custom badge-rendered options: "Primary priority" (High, must stay) and
 * "Backup priority" (Low → Medium). Options: Low (blue dot), Medium (amber dot), High (red dot).
 * A small reference chip shows only the amber dot. Footer: "Cancel" / "Apply policy".
 *
 * Success: Backup priority = "Medium", Primary priority still "High", "Apply policy" clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Button, Card, Select, Typography, Space, Modal, Tag, Badge, Divider,
} from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../../types';

const { Text, Title } = Typography;

const DOT_COLORS: Record<string, string> = {
  Low: '#1677ff',
  Medium: '#faad14',
  High: '#ff4d4f',
};

const priorityOptions = Object.entries(DOT_COLORS).map(([label, color]) => ({
  value: label,
  label: (
    <Space size={8}>
      <Badge color={color} />
      {label}
    </Space>
  ),
}));

export default function T05({ onSuccess }: TaskComponentProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [primaryPriority, setPrimaryPriority] = useState<string>('High');
  const [backupPriority, setBackupPriority] = useState<string>('Low');
  const [committed, setCommitted] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (committed && backupPriority === 'Medium' && primaryPriority === 'High') {
      successFired.current = true;
      onSuccess();
    }
  }, [committed, backupPriority, primaryPriority, onSuccess]);

  const handleApply = () => {
    setCommitted(true);
    setModalOpen(false);
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={4}><SettingOutlined /> Incident Management</Title>

      <Card style={{ width: 480, marginBottom: 16 }}>
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <Text type="secondary">Configure escalation rules for your team.</Text>
          <Divider style={{ margin: '8px 0' }} />
          <Space>
            <Tag>Team: SRE</Tag>
            <Tag color="blue">On-call: Active</Tag>
          </Space>
          <Button type="primary" onClick={() => setModalOpen(true)}>Escalation policy</Button>
        </Space>
      </Card>

      <Modal
        title="Escalation Policy"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={
          <Space>
            <Button onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="primary" onClick={handleApply}>Apply policy</Button>
          </Space>
        }
        width={420}
      >
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <div>
            <Text strong style={{ display: 'block', marginBottom: 4 }}>Primary priority</Text>
            <Select
              style={{ width: '100%' }}
              value={primaryPriority}
              onChange={(val) => { setPrimaryPriority(val); setCommitted(false); }}
              options={priorityOptions}
            />
          </div>
          <div>
            <Text strong style={{ display: 'block', marginBottom: 4 }}>Backup priority</Text>
            <Select
              style={{ width: '100%' }}
              value={backupPriority}
              onChange={(val) => { setBackupPriority(val); setCommitted(false); }}
              options={priorityOptions}
            />
          </div>

          <Divider style={{ margin: '4px 0' }} />

          <div>
            <Text type="secondary" style={{ fontSize: 12 }}>Match this reference badge:</Text>
            <div style={{ marginTop: 4 }}>
              <Tag style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <Badge color="#faad14" />
                <span style={{ fontSize: 11 }}>Target</span>
              </Tag>
            </div>
          </div>
        </Space>
      </Modal>
    </div>
  );
}
