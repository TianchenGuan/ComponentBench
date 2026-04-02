'use client';

/**
 * select_with_search-antd-v2-T04: Reference icon to visibility level with explicit apply
 *
 * Dashboard panel with high clutter. A reference tile shows only 🔒.
 * Below: Ant Design Select "Visibility" with showSearch and custom-rendered icon+label options:
 * 🌐 Public, 🏢 Internal, 🔒 Confidential, 🧪 Restricted Preview.
 * Initial: Public. Target: Confidential (matching 🔒).
 * Success: Visibility = "Confidential", Apply sharing clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, Select, Button, Typography, Space, Tag, Divider, Row, Col, Statistic } from 'antd';
import type { TaskComponentProps } from '../../types';

const { Text, Title } = Typography;

const visibilityOptions = [
  { value: 'Public', label: '🌐 Public', icon: '🌐' },
  { value: 'Internal', label: '🏢 Internal', icon: '🏢' },
  { value: 'Confidential', label: '🔒 Confidential', icon: '🔒' },
  { value: 'Restricted Preview', label: '🧪 Restricted Preview', icon: '🧪' },
];

export default function T04({ onSuccess }: TaskComponentProps) {
  const [visibility, setVisibility] = useState<string>('Public');
  const [applied, setApplied] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (applied && visibility === 'Confidential') {
      successFired.current = true;
      onSuccess();
    }
  }, [applied, visibility, onSuccess]);

  return (
    <div style={{ padding: 24, display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-end', minHeight: '70vh' }}>
      <div style={{ maxWidth: 480 }}>
        <Card title="Sharing Settings" style={{ width: 460 }}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div
              data-testid="visibility-reference-icon"
              style={{
                padding: '12px 16px',
                background: '#f5f5f5',
                borderRadius: 8,
                textAlign: 'center',
                fontSize: 32,
              }}
            >
              🔒
              <Text type="secondary" style={{ display: 'block', fontSize: 12 }}>Reference</Text>
            </div>

            <div>
              <Text strong style={{ display: 'block', marginBottom: 4 }}>Visibility</Text>
              <Select
                showSearch
                optionFilterProp="label"
                style={{ width: '100%' }}
                value={visibility}
                onChange={(val) => { setVisibility(val); setApplied(false); }}
                options={visibilityOptions}
              />
            </div>

            <Divider style={{ margin: '8px 0' }} />

            <Row gutter={16}>
              <Col span={8}><Statistic title="Views" value={1204} /></Col>
              <Col span={8}><Statistic title="Shares" value={38} /></Col>
              <Col span={8}><Statistic title="Edits" value={7} /></Col>
            </Row>

            <Space>
              <Tag color="green">Active</Tag>
              <Tag>Version 3.1</Tag>
              <Tag color="orange">Review pending</Tag>
            </Space>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button type="primary" onClick={() => setApplied(true)}>Apply sharing</Button>
            </div>
          </Space>
        </Card>

        <Card size="small" style={{ width: 460, marginTop: 12 }}>
          <Title level={5} style={{ margin: 0 }}>Activity</Title>
          <Text type="secondary">Last modified 2h ago by admin · 3 collaborators online</Text>
        </Card>
      </div>
    </div>
  );
}
