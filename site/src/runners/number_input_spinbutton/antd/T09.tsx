'use client';

/**
 * number_input_spinbutton-antd-T09: Match Primary quota to target badge
 * 
 * A dashboard-style card is centered with a header "Quota".
 * At the top-right of the card there is a filled badge labeled "Target quota" showing a number (the target is not stated in text instructions).
 * Below, there are two Ant Design InputNumber fields side-by-side (2 instances):
 * - "Primary quota" (TARGET) — initial value 10
 * - "Secondary quota" — initial value 20
 * Both have step=1 and min=0, max=100, with visible stepper controls.
 * Clutter is low: a small read-only sparkline and a "Last updated" timestamp are present, but only the Primary quota value matters.
 * 
 * Success: The numeric value of the target number input (Primary quota) matches the value shown in the reference element ("Target quota badge").
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Card, InputNumber, Badge, Typography, Space } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

export default function T09({ onSuccess }: TaskComponentProps) {
  // Random target value for the badge (between 30 and 80)
  const targetValue = useMemo(() => Math.floor(Math.random() * 51) + 30, []);
  
  const [primaryQuota, setPrimaryQuota] = useState<number | null>(10);
  const [secondaryQuota, setSecondaryQuota] = useState<number | null>(20);

  useEffect(() => {
    if (primaryQuota === targetValue) {
      onSuccess();
    }
  }, [primaryQuota, targetValue, onSuccess]);

  return (
    <Card 
      title="Quota" 
      style={{ width: 450 }}
      extra={
        <Badge 
          count={targetValue} 
          showZero 
          color="blue"
          data-testid="target-quota-badge"
          style={{ marginLeft: 8 }}
        >
          <Text type="secondary" style={{ marginRight: 8 }}>Target quota</Text>
        </Badge>
      }
    >
      {/* Sparkline placeholder */}
      <div style={{ marginBottom: 16, padding: 8, background: '#fafafa', borderRadius: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, height: 20 }}>
          {[40, 60, 35, 80, 55, 70, 45, 65].map((h, i) => (
            <div key={i} style={{ width: 8, height: h * 0.2, background: '#91d5ff', borderRadius: 2 }} />
          ))}
        </div>
      </div>

      <Space style={{ width: '100%' }} size="large">
        <div style={{ flex: 1 }}>
          <label htmlFor="primary-quota-input" style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>
            Primary quota
          </label>
          <InputNumber
            id="primary-quota-input"
            min={0}
            max={100}
            step={1}
            value={primaryQuota}
            onChange={(val) => setPrimaryQuota(val)}
            style={{ width: 150 }}
            data-testid="primary-quota-input"
          />
        </div>
        <div style={{ flex: 1 }}>
          <label htmlFor="secondary-quota-input" style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>
            Secondary quota
          </label>
          <InputNumber
            id="secondary-quota-input"
            min={0}
            max={100}
            step={1}
            value={secondaryQuota}
            onChange={(val) => setSecondaryQuota(val)}
            style={{ width: 150 }}
            data-testid="secondary-quota-input"
          />
        </div>
      </Space>

      <Text type="secondary" style={{ fontSize: 11, marginTop: 16, display: 'block' }}>
        Last updated: 2 minutes ago
      </Text>
    </Card>
  );
}
