'use client';

/**
 * rating-antd-T10: Drag across small stars to set a 5-star rating (AntD)
 * 
 * Scene details: theme=light, spacing=comfortable, scale=small, placement=center.
 * Layout: dashboard with medium clutter (several non-interactive metric cards above and to the side).
 * The target is a small Ant Design Rate component inside a narrow dashboard widget titled "Checkout speed".
 * Configuration: count=5, allowHalf=false, allowClear=true, size visually small (reduced icon size).
 * Initial state: value = 2 (two stars selected).
 * Interaction: users can click or click-and-drag across the stars; the selection commits on mouse up.
 * No Apply/Save button is required for success.
 * 
 * Success: Target rating value equals 5 out of 5.
 */

import React, { useState, useEffect } from 'react';
import { Card, Rate, Typography, Statistic, Row, Col } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

export default function T10({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<number>(2);

  useEffect(() => {
    if (value === 5) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <div style={{ maxWidth: 600 }}>
      {/* Dashboard header */}
      <Text strong style={{ fontSize: 18, display: 'block', marginBottom: 16 }}>
        Analytics dashboard
      </Text>
      
      {/* Metric cards row - distractors */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Card size="small">
            <Statistic title="Revenue" value={12450} prefix="$" />
          </Card>
        </Col>
        <Col span={8}>
          <Card size="small">
            <Statistic title="Orders" value={156} />
          </Card>
        </Col>
        <Col span={8}>
          <Card size="small">
            <Statistic title="Conversion" value={3.2} suffix="%" />
          </Card>
        </Col>
      </Row>
      
      {/* Target widget */}
      <Row gutter={16}>
        <Col span={12}>
          <Card size="small" title="Checkout speed">
            <Rate
              value={value}
              onChange={setValue}
              allowClear
              style={{ fontSize: 16 }}
              data-testid="rating-checkout-speed"
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card size="small">
            <Statistic title="Avg. Time" value={2.4} suffix="min" />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
