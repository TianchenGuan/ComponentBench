'use client';

/**
 * alpha_slider-antd-T05: Set compact tooltip opacity to 37%
 *
 * A centered "Tooltip Overlay" card uses compact spacing and small-sized controls:
 * - Label "Tooltip overlay color" with a small AntD ColorPicker trigger (size="small").
 * - Clicking opens the ColorPicker popup. Inside, the hue and opacity sliders are stacked tightly with minimal padding.
 * - The opacity/alpha slider is labeled "Opacity" and shows a percent readout, but the slider thumb and track are smaller than default.
 * Initial state:
 * - Opacity starts at 90%.
 * Feedback:
 * - Preview tooltip chip updates immediately as opacity changes.
 * Distractors:
 * - Hue slider is adjacent and visually similar to the Opacity slider, increasing risk of adjusting the wrong slider.
 *
 * Success: The tooltip overlay color alpha is set to 0.37 (37% opacity). Alpha must be within ±0.01 of the target value.
 */

import React, { useState, useEffect } from 'react';
import { Card, ColorPicker, Typography } from 'antd';
import type { Color } from 'antd/es/color-picker';
import type { TaskComponentProps } from '../types';
import { isAlphaWithinTolerance } from '../types';

const { Text } = Typography;

export default function T05({ onSuccess }: TaskComponentProps) {
  const [color, setColor] = useState<Color | string>('rgba(0, 0, 0, 0.9)');

  useEffect(() => {
    let alpha = 0.9;
    if (typeof color === 'string') {
      const match = color.match(/rgba?\([^)]+,\s*([\d.]+)\)/);
      if (match) alpha = parseFloat(match[1]);
    } else if (color && typeof color === 'object' && 'toRgb' in color) {
      const rgb = color.toRgb();
      alpha = rgb.a ?? 1;
    }

    if (isAlphaWithinTolerance(alpha, 0.37, 0.01)) {
      onSuccess();
    }
  }, [color, onSuccess]);

  const getAlphaPercent = (): number => {
    if (typeof color === 'string') {
      const match = color.match(/rgba?\([^)]+,\s*([\d.]+)\)/);
      return match ? Math.round(parseFloat(match[1]) * 100) : 100;
    } else if (color && typeof color === 'object' && 'toRgb' in color) {
      const rgb = color.toRgb();
      return Math.round((rgb.a ?? 1) * 100);
    }
    return 100;
  };

  const getColorString = (): string => {
    if (typeof color === 'string') return color;
    if (color && typeof color === 'object' && 'toRgbString' in color) {
      return color.toRgbString();
    }
    return 'rgba(0, 0, 0, 0.9)';
  };

  return (
    <Card title="Tooltip Overlay" style={{ width: 320 }} bodyStyle={{ padding: 16 }}>
      {/* Tooltip preview chip */}
      <div style={{ marginBottom: 16 }}>
        <div
          style={{
            display: 'inline-block',
            padding: '6px 12px',
            backgroundColor: getColorString(),
            color: '#fff',
            borderRadius: 4,
            fontSize: 12,
          }}
        >
          Tooltip preview
        </div>
      </div>

      {/* Control row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontSize: 13 }}>Tooltip overlay color</Text>
        <ColorPicker
          value={color}
          onChange={setColor}
          size="small"
          showText={() => `${getAlphaPercent()}%`}
          data-testid="tooltip-color-picker"
        />
      </div>
    </Card>
  );
}
