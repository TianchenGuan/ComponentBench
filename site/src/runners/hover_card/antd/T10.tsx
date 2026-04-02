'use client';

/**
 * hover_card-antd-T10: Open the correct KPI info hover card (mixed guidance, corner placement)
 *
 * Layout: dashboard with two KPI cards placed near the bottom-left of the viewport (light theme).
 * Spacing: comfortable, but KPI cards are rendered in a compact width and the info icons are small.
 *
 * The page has:
 * - A small "Target KPI" preview box showing the label and a tiny icon snapshot of the KPI whose info hover card you should open.
 * - Two KPI cards side-by-side:
 *   1) "Churn" with a small ⓘ info icon in the top-right of the card header
 *   2) "Revenue" with a similar ⓘ info icon in the same position
 *
 * Each ⓘ icon triggers an AntD Popover hover card (two hover card instances total).
 * - The hover cards are similar in layout (title + 2 bullet tips), so the main disambiguation is choosing the correct icon/KPI card.
 * - A longer hover open delay is configured compared to defaults (requires steady hover).
 *
 * Initial state: both hover cards closed.
 * Clutter: medium (extra dashboard controls like date range dropdown and refresh button are visible but irrelevant).
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Popover, Typography, Button, Select } from 'antd';
import { InfoCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

const { Text, Title } = Typography;

// Target is Churn
const TARGET_KPI = 'Churn';

const kpis = [
  {
    name: 'Churn',
    value: '2.4%',
    change: '-0.3%',
    positive: true,
    tips: [
      'Churn rate measures the percentage of customers who stop using the product.',
      'Lower churn indicates better customer retention.'
    ]
  },
  {
    name: 'Revenue',
    value: '$142K',
    change: '+12%',
    positive: true,
    tips: [
      'Monthly recurring revenue from all active subscriptions.',
      'Growth rate is compared to previous month.'
    ]
  }
];

export default function T10({ task, onSuccess }: TaskComponentProps) {
  const [activeKpi, setActiveKpi] = useState<string | null>(null);
  const [openKpi, setOpenKpi] = useState<string | null>(null);
  const successCalledRef = useRef(false);

  useEffect(() => {
    if (activeKpi === TARGET_KPI && openKpi === TARGET_KPI && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [activeKpi, openKpi, onSuccess]);

  const createHoverCardContent = (kpi: typeof kpis[0]) => (
    <div 
      style={{ width: 220 }} 
      data-testid={`hover-card-${kpi.name.toLowerCase()}`}
      data-cb-instance={`KPI: ${kpi.name} info`}
    >
      <Text strong style={{ display: 'block', marginBottom: 8 }}>{kpi.name} Info</Text>
      <ul style={{ margin: 0, paddingLeft: 16 }}>
        {kpi.tips.map((tip, idx) => (
          <li key={idx} style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>{tip}</li>
        ))}
      </ul>
    </div>
  );

  const targetKpi = kpis.find(k => k.name === TARGET_KPI)!;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Dashboard controls (clutter) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Select defaultValue="30d" size="small" style={{ width: 120 }}>
          <Select.Option value="7d">Last 7 days</Select.Option>
          <Select.Option value="30d">Last 30 days</Select.Option>
          <Select.Option value="90d">Last 90 days</Select.Option>
        </Select>
        <Button size="small" icon={<ReloadOutlined />}>Refresh</Button>
      </div>

      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        {/* Target KPI Preview */}
        <Card 
          size="small"
          style={{ width: 140 }}
          data-testid="target-preview"
        >
          <Text type="secondary" style={{ fontSize: 10, textTransform: 'uppercase' }}>Target KPI</Text>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
            <InfoCircleOutlined style={{ fontSize: 12, color: '#1677ff' }} />
            <Text strong style={{ fontSize: 13 }}>{targetKpi.name}</Text>
          </div>
        </Card>

        {/* KPI Cards */}
        {kpis.map((kpi) => (
          <Card 
            key={kpi.name}
            size="small"
            style={{ width: 160 }}
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: 13 }}>{kpi.name}</Text>
                <Popover 
                  content={createHoverCardContent(kpi)}
                  trigger="hover"
                  mouseEnterDelay={0.5}
                  open={openKpi === kpi.name}
                  onOpenChange={(visible) => {
                    if (visible) {
                      setOpenKpi(kpi.name);
                      setActiveKpi(kpi.name);
                    } else {
                      setOpenKpi(null);
                    }
                  }}
                >
                  <InfoCircleOutlined 
                    data-testid={`kpi-info-${kpi.name.toLowerCase()}`}
                    data-cb-instance={`KPI: ${kpi.name} info`}
                    style={{ fontSize: 12, color: '#999', cursor: 'pointer' }}
                    aria-label={`${kpi.name} info`}
                  />
                </Popover>
              </div>
            }
          >
            <Title level={4} style={{ margin: 0 }}>{kpi.value}</Title>
            <Text style={{ color: kpi.positive ? '#52c41a' : '#ff4d4f', fontSize: 12 }}>
              {kpi.change}
            </Text>
          </Card>
        ))}
      </div>
    </div>
  );
}
