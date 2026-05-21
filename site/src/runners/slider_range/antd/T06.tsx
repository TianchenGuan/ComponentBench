'use client';

/**
 * slider_range-antd-T06: Adjust small-opacity range in compact spacing
 * 
 * Layout: isolated_card anchored near the top-right of the viewport (not centered).
 * Spacing mode is compact: labels and controls have reduced vertical padding, and the slider track is closer to surrounding text.
 * The card contains one Ant Design range Slider labeled "Opacity range (%)".
 * - Slider configuration: min=0, max=100, step=1, range=true.
 * - Initial state: 10%–90% with readout "Selected: 10% – 90%".
 * Tooltip appears on hover/drag; there is no Apply/Reset.
 * The task is intended to be completed by dragging the thumbs (the handles are slightly smaller due to compact styling).
 * 
 * Success: Target range is set to 35–65 % (both thumbs).
 */

import React, { useState, useEffect } from 'react';
import { Card, Slider, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

export default function T06({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<[number, number]>([10, 90]);

  useEffect(() => {
    if (value[0] === 35 && value[1] === 65) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card 
      title="Opacity range (%)" 
      style={{ width: 320 }}
      styles={{ body: { padding: '12px 16px' } }}
    >
      <Slider
        range
        min={0}
        max={100}
        step={1}
        value={value}
        onChange={(val) => setValue(val as [number, number])}
        tooltip={{ open: undefined }}
        data-testid="opacity-range"
        style={{ marginBottom: 8 }}
      />
      <Text type="secondary" style={{ fontSize: 13 }}>
        Selected: {value[0]}% – {value[1]}%
      </Text>
    </Card>
  );
}
