'use client';

/**
 * slider_range-antd-T08: Shift a fixed-width time window by dragging the track
 * 
 * Layout: isolated_card anchored near the bottom-left of the viewport.
 * The card title is "Quiet hours". It contains one Ant Design range Slider configured with a draggable track:
 * - Slider configuration: min=0, max=100, step=1, range=true, range.draggableTrack=true (the selected range segment can be dragged as a unit).
 * - Initial state: the range is 20–40 (a 20-unit-wide window), shown in a readout "Selected window: 20 – 40".
 * The instruction hint under the slider says "You can drag the selected range" to indicate the draggable-track affordance.
 * No Apply/Reset controls exist; updates are immediate.
 * 
 * Success: Target range is set to 30–50 units (both thumbs).
 */

import React, { useState, useEffect } from 'react';
import { Card, Slider, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

export default function T08({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<[number, number]>([20, 40]);

  useEffect(() => {
    if (value[0] === 30 && value[1] === 50) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card title="Quiet hours" style={{ width: 400 }}>
      <Slider
        range={{ draggableTrack: true }}
        min={0}
        max={100}
        step={1}
        value={value}
        onChange={(val: number[]) => setValue(val as [number, number])}
        data-testid="quiet-hours-range"
      />
      <Text type="secondary" style={{ display: 'block', marginTop: 16 }}>
        Selected window: {value[0]} – {value[1]}
      </Text>
      <Text type="secondary" style={{ display: 'block', marginTop: 8, fontSize: 12, fontStyle: 'italic' }}>
        You can drag the selected range
      </Text>
    </Card>
  );
}
