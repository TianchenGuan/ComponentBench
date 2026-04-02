'use client';

/**
 * select_custom_single-antd-v2-T02: Clear only the Project filter and apply
 *
 * Dense dark analytics header with three compact Ant Design Selects on one row:
 * "Project" (Apollo, allowClear), "Team" (Platform), "Severity" (Critical).
 * Clear affordance appears on hover. "Apply filters" commits; "Reset all" is a distractor.
 * Team and Severity must remain unchanged.
 *
 * Success: Project = null/empty, Team still "Platform", Severity still "Critical", "Apply filters" clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Select, Button, Typography, Space, Card, Statistic, Row, Col, Tag } from 'antd';
import { ThunderboltOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../../types';

const { Text, Title } = Typography;

const projectOptions = [
  { value: 'Apollo', label: 'Apollo' },
  { value: 'Gemini', label: 'Gemini' },
  { value: 'Mercury', label: 'Mercury' },
  { value: 'Artemis', label: 'Artemis' },
];

const teamOptions = [
  { value: 'Platform', label: 'Platform' },
  { value: 'Frontend', label: 'Frontend' },
  { value: 'Backend', label: 'Backend' },
  { value: 'QA', label: 'QA' },
];

const severityOptions = [
  { value: 'Critical', label: 'Critical' },
  { value: 'High', label: 'High' },
  { value: 'Medium', label: 'Medium' },
  { value: 'Low', label: 'Low' },
];

export default function T02({ onSuccess }: TaskComponentProps) {
  const [project, setProject] = useState<string | undefined>('Apollo');
  const [team, setTeam] = useState<string>('Platform');
  const [severity, setSeverity] = useState<string>('Critical');
  const [applied, setApplied] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (applied && project === undefined && team === 'Platform' && severity === 'Critical') {
      successFired.current = true;
      onSuccess();
    }
  }, [applied, project, team, severity, onSuccess]);

  return (
    <div style={{ padding: 16, background: '#141414', minHeight: '100vh', color: '#fff' }}>
      <Title level={4} style={{ color: '#fff' }}><ThunderboltOutlined /> Analytics Dashboard</Title>

      <Card
        size="small"
        style={{ marginBottom: 16, background: '#1f1f1f', border: '1px solid #303030' }}
        styles={{ body: { padding: '8px 12px' } }}
      >
        <Space wrap size="small" style={{ width: '100%', justifyContent: 'flex-end' }}>
          <div>
            <Text style={{ color: '#aaa', fontSize: 11, display: 'block' }}>Project</Text>
            <Select
              size="small"
              style={{ width: 130 }}
              value={project}
              onChange={(val) => { setProject(val); setApplied(false); }}
              allowClear
              options={projectOptions}
              placeholder="All"
            />
          </div>
          <div>
            <Text style={{ color: '#aaa', fontSize: 11, display: 'block' }}>Team</Text>
            <Select
              size="small"
              style={{ width: 120 }}
              value={team}
              onChange={(val) => { setTeam(val); setApplied(false); }}
              options={teamOptions}
            />
          </div>
          <div>
            <Text style={{ color: '#aaa', fontSize: 11, display: 'block' }}>Severity</Text>
            <Select
              size="small"
              style={{ width: 110 }}
              value={severity}
              onChange={(val) => { setSeverity(val); setApplied(false); }}
              options={severityOptions}
            />
          </div>
          <Button size="small" type="primary" onClick={() => setApplied(true)}>Apply filters</Button>
          <Button size="small" danger onClick={() => { setProject(undefined); setTeam('Platform'); setSeverity('Critical'); setApplied(false); }}>Reset all</Button>
        </Space>
      </Card>

      <Row gutter={12} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Card size="small" style={{ background: '#1f1f1f', border: '1px solid #303030' }}>
            <Statistic title={<span style={{ color: '#aaa' }}>Errors (24h)</span>} value={1247} valueStyle={{ color: '#ff4d4f' }} />
          </Card>
        </Col>
        <Col span={8}>
          <Card size="small" style={{ background: '#1f1f1f', border: '1px solid #303030' }}>
            <Statistic title={<span style={{ color: '#aaa' }}>Warnings</span>} value={389} valueStyle={{ color: '#faad14' }} />
          </Card>
        </Col>
        <Col span={8}>
          <Card size="small" style={{ background: '#1f1f1f', border: '1px solid #303030' }}>
            <Statistic title={<span style={{ color: '#aaa' }}>Uptime</span>} value="99.2%" valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
      </Row>

      <Card size="small" style={{ background: '#1f1f1f', border: '1px solid #303030' }}>
        <Space>
          <Tag color="blue">Region: US-East</Tag>
          <Tag color="orange">Load: Moderate</Tag>
          <Text style={{ color: '#666' }}>Last refreshed: 2m ago</Text>
        </Space>
      </Card>
    </div>
  );
}
