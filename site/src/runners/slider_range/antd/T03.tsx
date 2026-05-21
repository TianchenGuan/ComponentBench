'use client';

/**
 * slider_range-antd-T03: Reset shipping cost range to default
 * 
 * Layout: isolated_card centered in the viewport.
 * The card title is "Shipping Settings". It contains one Ant Design range Slider labeled "Shipping cost ($)".
 * - Slider configuration: min=0, max=50, step=1, range=true.
 * - Default range (shown in small gray text near the label): "$5 – $25".
 * - Current/initial state: the slider is NOT at default; it starts at $12–$28 and the readout says "Selected: $12 – $28".
 * Below the slider is a single secondary button labeled "Reset to default" that sets the slider value back to $5–$25 instantly.
 * No Apply/Save step is required.
 * 
 * Success: Target range is set to 5–25 USD (both thumbs).
 */

import React, { useState, useEffect } from 'react';
import { Card, Slider, Typography, Button } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

export default function T03({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<[number, number]>([12, 28]);

  useEffect(() => {
    if (value[0] === 5 && value[1] === 25) {
      onSuccess();
    }
  }, [value, onSuccess]);

  const handleReset = () => {
    setValue([5, 25]);
  };

  return (
    <Card title="Shipping Settings" style={{ width: 400 }}>
      <div style={{ marginBottom: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
          <Text strong>Shipping cost ($)</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>Default: $5 – $25</Text>
        </div>
        <Slider
          range
          min={0}
          max={50}
          step={1}
          value={value}
          onChange={(val) => setValue(val as [number, number])}
          data-testid="shipping-cost-range"
        />
      </div>
      <Text type="secondary" style={{ display: 'block', marginTop: 16, marginBottom: 16 }}>
        Selected: ${value[0]} – ${value[1]}
      </Text>
      <Button onClick={handleReset}>Reset to default</Button>
    </Card>
  );
}
