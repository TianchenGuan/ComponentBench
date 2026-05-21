'use client';

/**
 * slider_single-antd-T07: Match the reference fill level
 * 
 * Layout: isolated card centered in the viewport titled "Tank status".
 * The card contains one horizontal Ant Design Slider labeled "Fill level".
 * The slider range is 0–100 with step=1. Marks are NOT shown to avoid giving away the exact number directly.
 * Visual guidance: to the right of the slider there is a small "Reference" mini-bar (a thin progress bar) showing the desired fill position.
 * Mixed guidance: the card includes text "Match the reference indicator" but does not show the target number.
 * Initial state: Fill level starts at 30; the reference indicator corresponds to a hidden target value of 45.
 * Feedback: a tooltip shows the numeric value only while dragging/hovering; after releasing, the tooltip disappears (no persistent number). No Apply button exists.
 * 
 * Success: The 'Fill level' slider matches the reference value (reference target is 45). Acceptance tolerance: within ±1 of the reference value.
 */

import React, { useState, useEffect } from 'react';
import { Card, Slider, Typography, Progress } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

const TARGET_VALUE = 45;

export default function T07({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState(30);

  useEffect(() => {
    if (Math.abs(value - TARGET_VALUE) <= 1) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card title="Tank status" style={{ width: 450 }}>
      <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
        Match the reference indicator
      </Text>
      <Text strong style={{ display: 'block', marginBottom: 16 }}>Fill level</Text>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <div style={{ flex: 1 }}>
          <Slider
            min={0}
            max={100}
            step={1}
            value={value}
            onChange={setValue}
            tooltip={{ open: undefined }}
            data-testid="slider-fill-level"
          />
        </div>
        <div style={{ width: 80 }}>
          <Text type="secondary" style={{ display: 'block', marginBottom: 4, fontSize: 12 }}>Reference</Text>
          <Progress
            percent={TARGET_VALUE}
            showInfo={false}
            size="small"
            strokeColor="#1677ff"
            data-testid="ref-fill-level"
            data-ref-value={TARGET_VALUE}
          />
        </div>
      </div>
    </Card>
  );
}
