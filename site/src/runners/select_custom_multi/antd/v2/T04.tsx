'use client';

/**
 * select_custom_multi-antd-v2-T04: Audience segments nested-scroll repair
 *
 * Nested scroll layout, compact spacing, medium clutter, off-center placement.
 * Outer scrollable analytics dashboard + separately scrollable right-side filter panel.
 * Two AntD Select (mode=multiple, showSearch) fields: "Audience segments" (TARGET) and "Muted segments".
 * Dropdown is long (~8 visible at once) with similar labels.
 * Initial: Audience segments: [Enterprise Central, SMB West], Muted segments: [Government].
 * Target: [Enterprise West, Enterprise East, SMB West, Education].
 * Must keep Muted segments = [Government].
 * Panel footer: "Apply filters".
 *
 * Success: Audience segments = {Enterprise West, Enterprise East, SMB West, Education},
 *          Muted segments unchanged = {Government}, Apply filters clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Select, Typography, Button, Card, Space, Statistic, Row, Col } from 'antd';
import { BarChartOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../../types';

const { Text, Title } = Typography;

const setsEqual = (a: string[], b: string[]) => {
  const sa = new Set(a);
  const sb = new Set(b);
  return sa.size === sb.size && Array.from(sa).every(v => sb.has(v));
};

const segmentOptions = [
  'Enterprise West', 'Enterprise East', 'Enterprise Central', 'Enterprise APAC',
  'SMB West', 'SMB East', 'SMB Central', 'Education', 'Education Trial',
  'Nonprofit', 'Government', 'Startup', 'Agency', 'Partner', 'Internal',
].map(v => ({ label: v, value: v }));

export default function T04({ onSuccess }: TaskComponentProps) {
  const [audienceSegments, setAudienceSegments] = useState<string[]>(['Enterprise Central', 'SMB West']);
  const [mutedSegments, setMutedSegments] = useState<string[]>(['Government']);
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (
      saved &&
      setsEqual(audienceSegments, ['Enterprise West', 'Enterprise East', 'SMB West', 'Education']) &&
      setsEqual(mutedSegments, ['Government'])
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, audienceSegments, mutedSegments, onSuccess]);

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Main dashboard area - scrollable */}
      <div style={{ flex: 1, overflow: 'auto', padding: 16 }}>
        <Title level={4}><BarChartOutlined /> Analytics Dashboard</Title>
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={8}><Card size="small"><Statistic title="Total Users" value={14820} /></Card></Col>
          <Col span={8}><Card size="small"><Statistic title="Active" value={9341} /></Card></Col>
          <Col span={8}><Card size="small"><Statistic title="Churned" value={482} /></Card></Col>
        </Row>
        <Card size="small" style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
          <Text type="secondary">Chart: Segment growth over time</Text>
        </Card>
        <Card size="small" style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Text type="secondary">Chart: Cohort retention heatmap</Text>
        </Card>
      </div>

      {/* Right filter panel - separately scrollable */}
      <div style={{ width: 300, borderLeft: '1px solid #e8e8e8', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, overflow: 'auto', padding: 16 }}>
          <Title level={5}>Filters</Title>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
              <Text strong style={{ display: 'block', marginBottom: 4 }}>Audience segments</Text>
              <Select
                mode="multiple"
                showSearch
                style={{ width: '100%' }}
                value={audienceSegments}
                onChange={(v) => { setAudienceSegments(v); setSaved(false); }}
                options={segmentOptions}
                listHeight={200}
                placeholder="Select segments"
              />
            </div>
            <div>
              <Text strong style={{ display: 'block', marginBottom: 4 }}>Muted segments</Text>
              <Select
                mode="multiple"
                showSearch
                style={{ width: '100%' }}
                value={mutedSegments}
                onChange={(v) => { setMutedSegments(v); setSaved(false); }}
                options={segmentOptions}
                listHeight={200}
                placeholder="Select muted segments"
              />
            </div>
          </Space>
        </div>
        <div style={{ padding: '12px 16px', borderTop: '1px solid #e8e8e8' }}>
          <Button type="primary" block onClick={() => setSaved(true)}>Apply filters</Button>
        </div>
      </div>
    </div>
  );
}
