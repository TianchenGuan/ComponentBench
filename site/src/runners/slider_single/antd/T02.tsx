'use client';

/**
 * slider_single-antd-T02: Set Thermostat setpoint to 37°C (marks-only)
 * 
 * Layout: isolated card in the center of the viewport.
 * The card title is "Thermostat". It contains a single Ant Design Slider labeled "Setpoint (°C)".
 * Configuration: horizontal slider with min=0, max=100, and step=null (so the thumb can stop only on marks).
 * Marks are shown at 0°C, 26°C, 37°C, and 100°C (each mark has a visible text label).
 * Initial state: the slider is currently at 26°C.
 * Feedback: while dragging or after clicking a mark, the thumb snaps to the nearest mark and a small "Current setpoint: XX°C" text updates below.
 * No other controls (no Apply button, no additional sliders).
 * 
 * Success: The 'Thermostat setpoint' slider value equals 37 (°C).
 */

import React, { useState, useEffect } from 'react';
import { Card, Slider, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

const marks: Record<number, string> = {
  0: '0°C',
  26: '26°C',
  37: '37°C',
  100: '100°C',
};

export default function T02({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState(26);

  useEffect(() => {
    if (value === 37) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card title="Thermostat" style={{ width: 400 }}>
      <Text strong style={{ display: 'block', marginBottom: 16 }}>Setpoint (°C)</Text>
      <Slider
        min={0}
        max={100}
        step={null}
        marks={marks}
        value={value}
        onChange={setValue}
        data-testid="slider-thermostat-setpoint"
      />
      <Text type="secondary" style={{ display: 'block', marginTop: 24 }}>
        Current setpoint: {value}°C
      </Text>
    </Card>
  );
}
