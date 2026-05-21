'use client';

/**
 * tree_select-antd-v2-T05: Ambiguous duplicate leaf search with neighboring instance preserved
 *
 * Dark dashboard panel with two searchable TreeSelects: "Event city" (empty, target) and
 * "Fallback city" (prefilled USA/Illinois/Springfield). Three "Springfield" leaves exist
 * under Massachusetts, Illinois, Missouri. Select USA/Massachusetts/Springfield and click
 * "Apply locations". Fallback must remain unchanged.
 *
 * Success: Event city = usa-massachusetts-springfield, Fallback unchanged, Apply clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, TreeSelect, Button, Space, Typography, Tag, Statistic, Row, Col, ConfigProvider, theme } from 'antd';
import type { TaskComponentProps } from '../../types';

const { Text } = Typography;

const cityTree = [
  {
    value: 'usa', title: 'USA', selectable: false, children: [
      {
        value: 'usa-massachusetts', title: 'Massachusetts', selectable: false, children: [
          { value: 'usa-massachusetts-boston', title: 'Boston' },
          { value: 'usa-massachusetts-springfield', title: 'Springfield' },
          { value: 'usa-massachusetts-worcester', title: 'Worcester' },
        ],
      },
      {
        value: 'usa-illinois', title: 'Illinois', selectable: false, children: [
          { value: 'usa-illinois-chicago', title: 'Chicago' },
          { value: 'usa-illinois-springfield', title: 'Springfield' },
          { value: 'usa-illinois-peoria', title: 'Peoria' },
        ],
      },
      {
        value: 'usa-missouri', title: 'Missouri', selectable: false, children: [
          { value: 'usa-missouri-kansascity', title: 'Kansas City' },
          { value: 'usa-missouri-springfield', title: 'Springfield' },
          { value: 'usa-missouri-stlouis', title: 'St. Louis' },
        ],
      },
      {
        value: 'usa-california', title: 'California', selectable: false, children: [
          { value: 'usa-california-losangeles', title: 'Los Angeles' },
          { value: 'usa-california-sanfrancisco', title: 'San Francisco' },
        ],
      },
    ],
  },
];

export default function T05({ onSuccess }: TaskComponentProps) {
  const [eventCity, setEventCity] = useState<string | undefined>(undefined);
  const [fallbackCity, setFallbackCity] = useState<string>('usa-illinois-springfield');
  const [committed, setCommitted] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (committed && eventCity === 'usa-massachusetts-springfield' && fallbackCity === 'usa-illinois-springfield') {
      successFired.current = true;
      onSuccess();
    }
  }, [committed, eventCity, fallbackCity, onSuccess]);

  return (
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      <div style={{ padding: 16, background: '#141414', minHeight: '100vh' }}>
        <Text strong style={{ fontSize: 18, display: 'block', marginBottom: 12, color: '#fff' }}>
          Event Dashboard
        </Text>
        <Row gutter={12} style={{ marginBottom: 16, maxWidth: 500, marginLeft: 'auto' }}>
          <Col span={8}><Card size="small"><Statistic title="Events" value={42} /></Card></Col>
          <Col span={8}><Card size="small"><Statistic title="Attendees" value={1280} /></Card></Col>
          <Col span={8}><Card size="small"><Statistic title="Cities" value={8} /></Card></Col>
        </Row>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12, justifyContent: 'flex-end' }}>
          <Tag>Q2 2025</Tag>
          <Tag color="blue">Active</Tag>
        </div>
        <Card title="Location Settings" size="small" style={{ maxWidth: 500, marginLeft: 'auto' }}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
              <Text strong style={{ display: 'block', marginBottom: 4 }}>Event city</Text>
              <TreeSelect
                style={{ width: '100%' }}
                value={eventCity}
                onChange={(val) => { setEventCity(val); setCommitted(false); }}
                treeData={cityTree}
                placeholder="Search cities..."
                showSearch
                treeNodeFilterProp="title"
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              />
            </div>
            <div>
              <Text strong style={{ display: 'block', marginBottom: 4 }}>Fallback city</Text>
              <TreeSelect
                style={{ width: '100%' }}
                value={fallbackCity}
                onChange={(val) => { setFallbackCity(val); setCommitted(false); }}
                treeData={cityTree}
                placeholder="Search cities..."
                showSearch
                treeNodeFilterProp="title"
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              />
            </div>
            <Button type="primary" onClick={() => setCommitted(true)}>Apply locations</Button>
          </Space>
        </Card>
      </div>
    </ConfigProvider>
  );
}
