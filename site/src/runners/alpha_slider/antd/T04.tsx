'use client';

/**
 * alpha_slider-antd-T04: Match banner opacity to a reference swatch
 *
 * A centered card titled "Banner Transparency" contains:
 * - Two preview swatches on a checkerboard:
 *   * "Current" preview (left) reflects the live banner color and its current opacity.
 *   * "Target" preview (right) is a fixed reference swatch that shows the desired transparency.
 * - Below the previews is an AntD ColorPicker trigger labeled "Banner color".
 * - Opening the ColorPicker shows the standard panel including the Opacity slider labeled "Opacity".
 * Initial state:
 * - Current banner opacity starts at 100% (fully opaque), so it does NOT match the Target swatch.
 * Guidance:
 * - The target is given visually via the Target preview swatch (no numeric target is displayed in the UI copy).
 *
 * Success: The banner color alpha matches the reference Target swatch (alpha=0.60). Alpha must be within ±0.03 of the target value.
 */

import React, { useState, useEffect } from 'react';
import { Card, ColorPicker, Typography } from 'antd';
import type { Color } from 'antd/es/color-picker';
import type { TaskComponentProps } from '../types';
import { isAlphaWithinTolerance } from '../types';

const { Text } = Typography;

const TARGET_ALPHA = 0.6;
const BASE_COLOR = 'rgba(114, 46, 209, 1)'; // Purple base
const TARGET_COLOR = `rgba(114, 46, 209, ${TARGET_ALPHA})`;

export default function T04({ onSuccess }: TaskComponentProps) {
  const [color, setColor] = useState<Color | string>(BASE_COLOR);

  useEffect(() => {
    let alpha = 1;
    if (typeof color === 'string') {
      const match = color.match(/rgba?\([^)]+,\s*([\d.]+)\)/);
      if (match) alpha = parseFloat(match[1]);
    } else if (color && typeof color === 'object' && 'toRgb' in color) {
      const rgb = color.toRgb();
      alpha = rgb.a ?? 1;
    }

    if (isAlphaWithinTolerance(alpha, TARGET_ALPHA, 0.03)) {
      onSuccess();
    }
  }, [color, onSuccess]);

  const getColorString = (): string => {
    if (typeof color === 'string') return color;
    if (color && typeof color === 'object' && 'toRgbString' in color) {
      return color.toRgbString();
    }
    return BASE_COLOR;
  };

  const checkerboardStyle = {
    backgroundImage: `
      linear-gradient(45deg, #ccc 25%, transparent 25%),
      linear-gradient(-45deg, #ccc 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, #ccc 75%),
      linear-gradient(-45deg, transparent 75%, #ccc 75%)
    `,
    backgroundSize: '16px 16px',
    backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px',
  };

  return (
    <Card title="Banner Transparency" style={{ width: 400 }}>
      {/* Preview swatches */}
      <div style={{ display: 'flex', gap: 24, marginBottom: 24 }}>
        {/* Current preview */}
        <div style={{ flex: 1 }}>
          <Text type="secondary" style={{ display: 'block', marginBottom: 8, fontSize: 12 }}>Current</Text>
          <div
            style={{
              width: '100%',
              height: 80,
              borderRadius: 8,
              position: 'relative',
              ...checkerboardStyle,
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

        {/* Target preview */}
        <div style={{ flex: 1 }}>
          <Text type="secondary" style={{ display: 'block', marginBottom: 8, fontSize: 12 }}>Target</Text>
          <div
            style={{
              width: '100%',
              height: 80,
              borderRadius: 8,
              position: 'relative',
              ...checkerboardStyle,
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: TARGET_COLOR,
                borderRadius: 8,
              }}
            />
          </div>
        </div>
      </div>

      {/* Control row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text>Banner color</Text>
        <ColorPicker
          value={color}
          onChange={setColor}
          data-testid="banner-color-picker"
        />
      </div>
    </Card>
  );
}
