'use client';

/**
 * alpha_slider-antd-T09: Match scrim opacity in dark theme without numeric readout
 *
 * A single card is centered on a dark theme page:
 * - Title: "Modal Scrim"
 * - Two large preview rectangles on a checkerboard:
 *   * "Current scrim" (live, updates as you adjust opacity)
 *   * "Target scrim" (fixed reference)
 * - An AntD ColorPicker trigger labeled "Scrim color" opens the popup panel.
 * - The popup includes the Opacity slider labeled "Opacity", but the numeric percent readout is intentionally hidden (minimal UI); only the thumb position and the preview changes provide feedback.
 * Initial state:
 * - Current scrim opacity starts at 70% (noticeably darker than the Target).
 * Feedback:
 * - Only the visual preview changes on the page as opacity is adjusted; no numeric alpha text is shown.
 *
 * Success: The scrim alpha matches the Target scrim reference (alpha=0.33). Alpha must be within ±0.015 of the target value.
 */

import React, { useState, useEffect } from 'react';
import { Card, ColorPicker, Typography, ConfigProvider, theme } from 'antd';
import type { Color } from 'antd/es/color-picker';
import type { TaskComponentProps } from '../types';
import { isAlphaWithinTolerance } from '../types';

const { Text } = Typography;

const TARGET_ALPHA = 0.33;
const TARGET_COLOR = `rgba(0, 0, 0, ${TARGET_ALPHA})`;

export default function T09({ onSuccess }: TaskComponentProps) {
  const [color, setColor] = useState<Color | string>('rgba(0, 0, 0, 0.7)');

  useEffect(() => {
    let alpha = 0.7;
    if (typeof color === 'string') {
      const match = color.match(/rgba?\([^)]+,\s*([\d.]+)\)/);
      if (match) alpha = parseFloat(match[1]);
    } else if (color && typeof color === 'object' && 'toRgb' in color) {
      const rgb = color.toRgb();
      alpha = rgb.a ?? 1;
    }

    if (isAlphaWithinTolerance(alpha, TARGET_ALPHA, 0.015)) {
      onSuccess();
    }
  }, [color, onSuccess]);

  const getColorString = (): string => {
    if (typeof color === 'string') return color;
    if (color && typeof color === 'object' && 'toRgbString' in color) {
      return color.toRgbString();
    }
    return 'rgba(0, 0, 0, 0.7)';
  };

  const checkerboardStyle = {
    backgroundImage: `
      linear-gradient(45deg, #555 25%, transparent 25%),
      linear-gradient(-45deg, #555 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, #555 75%),
      linear-gradient(-45deg, transparent 75%, #555 75%)
    `,
    backgroundSize: '20px 20px',
    backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
    backgroundColor: '#333',
  };

  return (
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      <Card 
        title="Modal Scrim" 
        style={{ width: 420, background: '#1f1f1f' }}
        styles={{ header: { color: '#fff', borderBottom: '1px solid #333' } }}
      >
        {/* Preview rectangles */}
        <div style={{ display: 'flex', gap: 24, marginBottom: 24 }}>
          {/* Current scrim */}
          <div style={{ flex: 1 }}>
            <Text style={{ display: 'block', marginBottom: 8, fontSize: 12, color: '#999' }}>Current scrim</Text>
            <div
              style={{
                width: '100%',
                height: 100,
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

          {/* Target scrim */}
          <div style={{ flex: 1 }}>
            <Text style={{ display: 'block', marginBottom: 8, fontSize: 12, color: '#999' }}>Target scrim</Text>
            <div
              style={{
                width: '100%',
                height: 100,
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

        {/* Control row - no percent readout */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ color: '#ccc' }}>Scrim color</Text>
          <ColorPicker
            value={color}
            onChange={setColor}
            data-testid="scrim-color-picker"
          />
        </div>
      </Card>
    </ConfigProvider>
  );
}
