'use client';

/**
 * slider_range-antd-T02: Set discount range using marks (25%–75%)
 * 
 * Layout: isolated_card centered in the viewport.
 * The card title is "Discount Filter". It contains one Ant Design range Slider labeled "Discount range (%)".
 * - Slider configuration: min=0, max=100, step=25, marks shown at 0%, 25%, 50%, 75%, 100%, range=true.
 * - Initial state: thumbs are at 0% and 100% and the helper line reads "Selected: 0% – 100%".
 * No additional controls are present; the range updates immediately.
 * 
 * Success: Target range is set to 25–75 % (both thumbs).
 */

import React, { useState, useEffect } from 'react';
import { Card, Slider, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

const marks = {
  0: '0%',
  25: '25%',
  50: '50%',
  75: '75%',
  100: '100%',
};

export default function T02({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<[number, number]>([0, 100]);

  useEffect(() => {
    if (value[0] === 25 && value[1] === 75) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card title="Discount Filter" style={{ width: 400 }}>
      <div style={{ marginBottom: 8 }}>
        <Text strong style={{ display: 'block', marginBottom: 16 }}>Discount range (%)</Text>
        <Slider
          range
          min={0}
          max={100}
          step={25}
          marks={marks}
          value={value}
          onChange={(val) => setValue(val as [number, number])}
          data-testid="discount-range"
        />
      </div>
      <Text type="secondary" style={{ display: 'block', marginTop: 24 }}>
        Selected: {value[0]}% – {value[1]}%
      </Text>
    </Card>
  );
}
