'use client';

/**
 * alpha_slider-antd-T01: Set overlay opacity to 80%
 *
 * A single centered card titled "Overlay Preview" contains:
 * - A checkerboard preview box showing a blue overlay applied on top of the checkerboard.
 * - A labeled control row: label "Overlay color" on the left and an AntD ColorPicker trigger on the right (a small color swatch button).
 * - Clicking the swatch opens the ColorPicker popup with the standard panel (saturation square, hue slider, and an opacity/alpha slider).
 * - The opacity/alpha slider is labeled "Opacity" and shows the current value as a percent text (e.g., "100%") next to the slider.
 * Initial state:
 * - Base color is blue (e.g., #1677FF) and opacity starts at 100%.
 * Feedback:
 * - Changing the opacity updates the preview box immediately; there is no separate Apply/OK button in this card.
 *
 * Success: The 'Overlay color' instance has alpha (opacity) set to 0.80 (80%). Alpha must be within ±0.02 of the target value.
 */

import React, { useState, useEffect } from 'react';
import { Card, ColorPicker, Typography } from 'antd';
import type { Color } from 'antd/es/color-picker';
import type { TaskComponentProps } from '../types';
import { isAlphaWithinTolerance } from '../types';

const { Text } = Typography;

export default function T01({ onSuccess }: TaskComponentProps) {
  const [color, setColor] = useState<Color | string>('rgba(22, 119, 255, 1)');

  useEffect(() => {
    // Extract alpha from color
    let alpha = 1;
    if (typeof color === 'string') {
      const match = color.match(/rgba?\([^)]+,\s*([\d.]+)\)/);
      if (match) alpha = parseFloat(match[1]);
    } else if (color && typeof color === 'object' && 'toRgb' in color) {
      const rgb = color.toRgb();
      alpha = rgb.a ?? 1;
    }

    if (isAlphaWithinTolerance(alpha, 0.8, 0.02)) {
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
    return 'rgba(22, 119, 255, 1)';
  };

  return (
    <Card title="Overlay Preview" style={{ width: 400 }}>
      {/* Checkerboard preview */}
      <div
        style={{
          width: '100%',
          height: 100,
          marginBottom: 16,
          backgroundImage: `
            linear-gradient(45deg, #ccc 25%, transparent 25%),
            linear-gradient(-45deg, #ccc 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #ccc 75%),
            linear-gradient(-45deg, transparent 75%, #ccc 75%)
          `,
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
          borderRadius: 8,
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: getColorString(),
            borderRadius: 8,
          }}
        />
      </div>

      {/* Control row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text>Overlay color</Text>
        <ColorPicker
          value={color}
          onChange={setColor}
          showText={() => `${getAlphaPercent()}%`}
          data-testid="overlay-color-picker"
        />
      </div>
    </Card>
  );
}
