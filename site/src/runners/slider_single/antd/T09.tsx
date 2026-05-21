'use client';

/**
 * slider_single-antd-T09: Set Detection threshold to 0.73 (vertical, fine step)
 * 
 * Layout: settings_panel anchored to the bottom-left of the viewport.
 * The panel section header is "Detection". It contains one Ant Design Slider rendered vertically (vertical=true).
 * Configuration: range 0.00–1.00 with step=0.01 (two-decimal precision). There are no marks.
 * The slider is displayed in a small column (narrow track) with compact spacing around it.
 * Initial state: Detection threshold starts at 0.50.
 * Feedback: while dragging, a tooltip shows the value to two decimals; after release, a small read-only text below the slider shows "Current: 0.xx".
 * No Apply/Cancel buttons exist; changes apply immediately.
 * 
 * Success: The 'Detection threshold' slider value is within ±0.005 of 0.73 (i.e., snaps to 0.73).
 */

import React, { useState, useEffect } from 'react';
import { Card, Slider, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

export default function T09({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState(0.50);

  useEffect(() => {
    if (Math.abs(value - 0.73) <= 0.005) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card title="Detection" style={{ width: 150, minHeight: 350 }}>
      <Text strong style={{ display: 'block', marginBottom: 16 }}>Detection threshold</Text>
      <div style={{ height: 200, display: 'flex', justifyContent: 'center' }}>
        <Slider
          vertical
          min={0}
          max={1}
          step={0.01}
          value={value}
          onChange={setValue}
          tooltip={{ formatter: (v) => v?.toFixed(2) }}
          data-testid="slider-detection-threshold"
        />
      </div>
      <Text type="secondary" style={{ display: 'block', marginTop: 16, textAlign: 'center' }}>
        Current: {value.toFixed(2)}
      </Text>
    </Card>
  );
}
