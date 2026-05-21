'use client';

/**
 * slider_range-antd-T07: Match recommended noise-reduction band (visual)
 * 
 * Layout: isolated_card centered in the viewport.
 * The card is titled "Noise reduction". It contains:
 * - A thin horizontal reference bar above the slider with a highlighted segment labeled "Recommended" (no numbers shown on the bar).
 * - One Ant Design range Slider directly below, min=0, max=100, step=1, range=true.
 * Initial state: the slider starts at the full range 0–100.
 * The slider shows tick labels only at 0 and 100; the exact recommended endpoints are not shown as text, only as the highlighted band position.
 * As the slider moves, a small preview label updates: "Current window: [from]–[to]" to aid verification after interaction.
 * 
 * Success: Target range is set to 30–55 pts (both thumbs), tolerance ±2.
 */

import React, { useState, useEffect } from 'react';
import { Card, Slider, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

export default function T07({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<[number, number]>([0, 100]);

  useEffect(() => {
    // Target: 30-55 with tolerance ±2
    if (value[0] >= 28 && value[0] <= 32 && value[1] >= 53 && value[1] <= 57) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card title="Noise reduction" style={{ width: 400 }}>
      {/* Visual reference bar */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ position: 'relative', height: 24, background: '#f0f0f0', borderRadius: 4 }}>
          {/* Highlighted recommended segment at 30%-55% */}
          <div
            style={{
              position: 'absolute',
              left: '30%',
              width: '25%',
              height: '100%',
              background: '#1677ff',
              borderRadius: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: '#fff', fontSize: 11, fontWeight: 500 }}>Recommended</Text>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
          <Text type="secondary" style={{ fontSize: 11 }}>0</Text>
          <Text type="secondary" style={{ fontSize: 11 }}>100</Text>
        </div>
      </div>

      <Slider
        range
        min={0}
        max={100}
        step={1}
        value={value}
        onChange={(val) => setValue(val as [number, number])}
        data-testid="noise-reduction-range"
      />
      <Text type="secondary" style={{ display: 'block', marginTop: 16 }}>
        Current window: {value[0]}–{value[1]}
      </Text>
    </Card>
  );
}
