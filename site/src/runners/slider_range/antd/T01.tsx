'use client';

/**
 * slider_range-antd-T01: Set price filter to $20–$80
 * 
 * Layout: isolated_card centered in the viewport.
 * The card title is "Price Filter". Inside it there is a single Ant Design range Slider labeled "Price range ($)".
 * - Slider configuration: min=0, max=100, step=1, range=true, tooltip shows values on hover/drag.
 * - Initial state: the selected range is $10–$90 (both thumbs on the track) and the text below reads "Selected: $10 – $90".
 * There are no other interactive controls on the card (no Apply/Reset), and changes update immediately as you drag/click.
 * 
 * Success: Target range is set to 20–80 USD (both thumbs).
 */

import React, { useState, useEffect } from 'react';
import { Card, Slider, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

export default function T01({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<[number, number]>([10, 90]);

  useEffect(() => {
    if (value[0] === 20 && value[1] === 80) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card title="Price Filter" style={{ width: 400 }}>
      <div style={{ marginBottom: 8 }}>
        <Text strong style={{ display: 'block', marginBottom: 16 }}>Price range ($)</Text>
        <Slider
          range
          min={0}
          max={100}
          step={1}
          value={value}
          onChange={(val) => setValue(val as [number, number])}
          tooltip={{ open: undefined }}
          data-testid="price-range"
        />
      </div>
      <Text type="secondary" style={{ display: 'block', marginTop: 16 }}>
        Selected: ${value[0]} – ${value[1]}
      </Text>
    </Card>
  );
}
