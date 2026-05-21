'use client';

/**
 * slider_single-antd-T01: Set Volume to 60 (marks)
 * 
 * Layout: isolated card centered in the viewport.
 * The card title is "Audio", with a labeled Ant Design Slider row: label "Volume".
 * The slider is horizontal with range 0–100, step=10, and visible marks at 0, 10, …, 100 (numbers under the track).
 * A tooltip/value label appears when hovering or dragging the thumb, and a small read-only text "Current: XX" updates live under the slider.
 * Initial state: Volume is set to 20.
 * There are no other interactive elements besides the slider (no Apply/Cancel).
 * 
 * Success: The 'Volume' slider value equals 60.
 */

import React, { useState, useEffect } from 'react';
import { Card, Slider, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

const marks: Record<number, string> = {
  0: '0',
  10: '10',
  20: '20',
  30: '30',
  40: '40',
  50: '50',
  60: '60',
  70: '70',
  80: '80',
  90: '90',
  100: '100',
};

export default function T01({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState(20);

  useEffect(() => {
    if (value === 60) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card title="Audio" style={{ width: 400 }}>
      <Text strong style={{ display: 'block', marginBottom: 16 }}>Volume</Text>
      <Slider
        min={0}
        max={100}
        step={10}
        marks={marks}
        value={value}
        onChange={setValue}
        data-testid="slider-volume"
      />
      <Text type="secondary" style={{ display: 'block', marginTop: 24 }}>
        Current: {value}
      </Text>
    </Card>
  );
}
