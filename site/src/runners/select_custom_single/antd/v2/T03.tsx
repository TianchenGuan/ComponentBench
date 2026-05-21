'use client';

/**
 * select_custom_single-antd-v2-T03: Search the Reviewer select for Ava Stone and apply
 *
 * Crowded review dashboard. Right-side settings panel with two stacked Ant Design Select
 * (showSearch): "Assignee" (Mina Patel, must stay) and "Reviewer" (empty).
 * Person lists with avatars and similar names. Panel footer: "Apply review settings" / "Discard".
 * Commit happens only after Apply.
 *
 * Success: Reviewer = "Ava Stone", Assignee still "Mina Patel", "Apply review settings" clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Button, Card, Select, Typography, Space, Avatar, Divider, Tag, Row, Col, Statistic,
} from 'antd';
import { UserOutlined, FileTextOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../../types';

const { Text, Title } = Typography;

const people = [
  'Aaron Mitchell', 'Adele Fernandez', 'Alex Novak', 'Alice Brennan', 'Amir Hassan',
  'Andrea Kowalski', 'Ava Sloan', 'Ava Stone', 'Blake Torres', 'Brenda Lu',
  'Calvin Rhodes', 'Carmen Vega', 'Casey Rivera', 'Charlotte Dunn', 'Dakota Reeves',
  'Danielle Okafor', 'Derek Chang', 'Drew Wang', 'Elena Rossi', 'Emery Clark',
  'Ethan Nakamura', 'Finley Ito', 'Grace Holloway', 'Harper Green', 'Isaac Mendez',
  'Jamie Fox', 'Jordan Lee', 'Kara Lindstrom', 'Liam O\'Brien', 'Lucas Tran',
  'Marina Petrov', 'Mina Patel', 'Mina Park', 'Morgan Chen', 'Nadia Kapoor',
  'Nora Eriksen', 'Parker Hughes', 'Quinn Davis', 'Riley Adams', 'Rowan Shah',
  'Sanjay Gupta', 'Selena Cruz', 'Taylor Brooks', 'Theo Larsson', 'Uma Reddy',
  'Victor Almeida', 'Wendy Chow', 'Yuki Tanaka', 'Zara Osman',
];

const personOptions = people.map((p) => ({
  value: p,
  label: (
    <Space size={8}>
      <Avatar size="small" icon={<UserOutlined />} />
      {p}
    </Space>
  ),
}));

export default function T03({ onSuccess }: TaskComponentProps) {
  const [assignee, setAssignee] = useState<string>('Mina Patel');
  const [reviewer, setReviewer] = useState<string | undefined>(undefined);
  const [applied, setApplied] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (applied && reviewer === 'Ava Stone' && assignee === 'Mina Patel') {
      successFired.current = true;
      onSuccess();
    }
  }, [applied, reviewer, assignee, onSuccess]);

  return (
    <div style={{ padding: 16 }}>
      <Title level={4}><FileTextOutlined /> Review Dashboard</Title>

      <Row gutter={16}>
        <Col span={16}>
          <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
            <Col span={8}><Card size="small"><Statistic title="Open Reviews" value={23} /></Card></Col>
            <Col span={8}><Card size="small"><Statistic title="Approved" value={89} /></Card></Col>
            <Col span={8}><Card size="small"><Statistic title="Rejected" value={4} /></Card></Col>
          </Row>
          <Card size="small" style={{ height: 160 }}>
            <Text type="secondary">Review activity chart placeholder</Text>
          </Card>
        </Col>

        <Col span={8}>
          <Card title="Review Settings" size="small">
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <div>
                <Text strong style={{ display: 'block', marginBottom: 4 }}>Assignee</Text>
                <Select
                  showSearch
                  optionFilterProp="label"
                  style={{ width: '100%' }}
                  value={assignee}
                  onChange={(val) => { setAssignee(val); setApplied(false); }}
                  options={personOptions}
                  filterOption={(input, option) =>
                    (option?.value as string).toLowerCase().includes(input.toLowerCase())
                  }
                />
              </div>
              <div>
                <Text strong style={{ display: 'block', marginBottom: 4 }}>Reviewer</Text>
                <Select
                  showSearch
                  optionFilterProp="label"
                  style={{ width: '100%' }}
                  placeholder="Select reviewer"
                  value={reviewer}
                  onChange={(val) => { setReviewer(val); setApplied(false); }}
                  options={personOptions}
                  filterOption={(input, option) =>
                    (option?.value as string).toLowerCase().includes(input.toLowerCase())
                  }
                />
              </div>

              <Divider style={{ margin: '4px 0' }} />

              <Space>
                <Tag color="green">Sprint 14</Tag>
                <Tag>Priority: Normal</Tag>
              </Space>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <Button onClick={() => { setReviewer(undefined); setApplied(false); }}>Discard</Button>
                <Button type="primary" onClick={() => setApplied(true)}>Apply review settings</Button>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
