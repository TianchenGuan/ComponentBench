'use client';

/**
 * slider_single-antd-T03: Set Media volume to 80 (dark theme)
 * 
 * Layout: isolated card centered in the viewport, but the page uses a dark theme (dark background, light text).
 * The card header reads "Media". Inside is one Ant Design Slider labeled "Media volume".
 * Configuration: horizontal slider with range 0–100 and step=5. The thumb is slightly larger than default.
 * Tooltip behavior: tooltip is forced open (always visible) so the numeric value is continuously displayed above the thumb.
 * Initial state: Media volume starts at 50.
 * No extra actions are needed—changes are applied immediately with no Apply/Cancel buttons and no other sliders on the page.
 * 
 * Success: The 'Media volume' slider value equals 80.
 */

import React, { useState, useEffect } from 'react';
import { Card, Slider, Typography, ConfigProvider, theme } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

export default function T03({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState(50);

  useEffect(() => {
    if (value === 80) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
      }}
    >
      <Card title="Media" style={{ width: 400 }}>
        <Text strong style={{ display: 'block', marginBottom: 16 }}>Media volume</Text>
        <Slider
          min={0}
          max={100}
          step={5}
          value={value}
          onChange={setValue}
          tooltip={{ open: true }}
          styles={{
            handle: {
              width: 20,
              height: 20,
              marginTop: -8,
            },
          }}
          data-testid="slider-media-volume"
        />
        <Text type="secondary" style={{ display: 'block', marginTop: 24 }}>
          Current: {value}
        </Text>
      </Card>
    </ConfigProvider>
  );
}
