'use client';

/**
 * alpha_slider-antd-T02: Drag opacity to 25% (panel already open)
 *
 * A centered card titled "Sticker Opacity" shows the AntD ColorPicker panel already open (no need to click a trigger):
 * - The ColorPicker panel is rendered inline in the card (controlled with open=true), so the saturation area and sliders are visible immediately.
 * - The opacity/alpha slider is labeled "Opacity" and shows a percent readout.
 * - A small preview chip labeled "Sticker preview" sits above the panel and updates live.
 * Initial state:
 * - Opacity starts at 100% (alpha=1.0).
 * Distractors:
 * - Hue slider and saturation area are present but do not affect task success (only alpha is checked).
 *
 * Success: The sticker color alpha is set to 0.25 (25% opacity). Alpha must be within ±0.02 of the target value.
 */

import React, { useState, useEffect } from 'react';
import { Card, ColorPicker, Typography } from 'antd';
import type { Color } from 'antd/es/color-picker';
import type { TaskComponentProps } from '../types';
import { isAlphaWithinTolerance } from '../types';

const { Text } = Typography;

export default function T02({ onSuccess }: TaskComponentProps) {
  const [color, setColor] = useState<Color | string>('rgba(22, 119, 255, 1)');

  useEffect(() => {
    let alpha = 1;
    if (typeof color === 'string') {
      const match = color.match(/rgba?\([^)]+,\s*([\d.]+)\)/);
      if (match) alpha = parseFloat(match[1]);
    } else if (color && typeof color === 'object' && 'toRgb' in color) {
      const rgb = color.toRgb();
      alpha = rgb.a ?? 1;
    }

    if (isAlphaWithinTolerance(alpha, 0.25, 0.02)) {
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
    <Card title="Sticker Opacity" style={{ width: 360 }}>
      {/* Preview chip */}
      <div style={{ marginBottom: 16 }}>
        <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>Sticker preview</Text>
        <div
          style={{
            width: 80,
            height: 80,
            backgroundImage: `
              linear-gradient(45deg, #ccc 25%, transparent 25%),
              linear-gradient(-45deg, #ccc 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, #ccc 75%),
              linear-gradient(-45deg, transparent 75%, #ccc 75%)
            `,
            backgroundSize: '10px 10px',
            backgroundPosition: '0 0, 0 5px, 5px -5px, -5px 0px',
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
      </div>

      {/* Opacity readout */}
      <Text style={{ display: 'block', marginBottom: 8 }}>Opacity: {getAlphaPercent()}%</Text>

      {/* Inline ColorPicker panel */}
      <ColorPicker
        value={color}
        onChange={setColor}
        open
        panelRender={(panel) => <div data-testid="sticker-color-panel">{panel}</div>}
        data-testid="sticker-color-picker"
      />
    </Card>
  );
}
