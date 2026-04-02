'use client';

/**
 * slider_single-antd-T04: Reset Opacity to default (50)
 * 
 * Layout: isolated card centered in the viewport titled "Appearance".
 * The card contains a single Ant Design Slider labeled "Opacity (default: 50)".
 * Configuration: range 0–100 with step=1 and no marks. A small "Reset" text button is placed to the right of the label (same row).
 * Initial state: the Opacity slider is currently set to 73 (the thumb starts past the midpoint).
 * Feedback: a read-only numeric text "Current opacity: 73" is shown under the slider and updates instantly when the slider changes or when Reset is clicked.
 * Clicking "Reset" sets the slider value back to exactly 50. No Apply/Cancel exists.
 * 
 * Success: The 'Opacity' slider value equals 50 (the labeled default).
 */

import React, { useState, useEffect } from 'react';
import { Card, Slider, Typography, Button, Space } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

export default function T04({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState(73);

  useEffect(() => {
    if (value === 50) {
      onSuccess();
    }
  }, [value, onSuccess]);

  const handleReset = () => {
    setValue(50);
  };

  return (
    <Card title="Appearance" style={{ width: 400 }}>
      <Space style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Text strong>Opacity (default: 50)</Text>
        <Button type="link" onClick={handleReset} data-testid="btn-reset-opacity" style={{ padding: 0 }}>
          Reset
        </Button>
      </Space>
      <Slider
        min={0}
        max={100}
        step={1}
        value={value}
        onChange={setValue}
        data-testid="slider-opacity"
      />
      <Text type="secondary" style={{ display: 'block', marginTop: 16 }}>
        Current opacity: {value}
      </Text>
    </Card>
  );
}
