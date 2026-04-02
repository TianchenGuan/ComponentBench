'use client';

/**
 * alpha_slider-antd-T03: Reset badge opacity to 100%
 *
 * A centered "Badge Style" card includes:
 * - A badge preview on a checkerboard background.
 * - An AntD ColorPicker trigger labeled "Badge color" that opens a popup panel with hue + opacity controls.
 * - Inside the popup, the opacity slider is labeled "Opacity" with a percent readout.
 * - Beneath the opacity slider, there is a small inline control: a link-style button labeled "Reset opacity".
 * Initial state:
 * - Badge color is set with partial transparency (about 45% opacity), so the badge looks faint.
 * Feedback:
 * - Clicking "Reset opacity" immediately sets opacity back to 100% and updates the badge preview and the percent readout.
 *
 * Success: The badge color alpha is set to 1.00 (100% opacity). Alpha must be within ±0.005 of the target value.
 */

import React, { useState, useEffect } from 'react';
import { Card, ColorPicker, Typography, Button } from 'antd';
import type { Color } from 'antd/es/color-picker';
import type { TaskComponentProps } from '../types';
import { isAlphaWithinTolerance } from '../types';

const { Text } = Typography;

export default function T03({ onSuccess }: TaskComponentProps) {
  const [color, setColor] = useState<Color | string>('rgba(245, 34, 45, 0.45)');

  useEffect(() => {
    let alpha = 0.45;
    if (typeof color === 'string') {
      const match = color.match(/rgba?\([^)]+,\s*([\d.]+)\)/);
      if (match) alpha = parseFloat(match[1]);
    } else if (color && typeof color === 'object' && 'toRgb' in color) {
      const rgb = color.toRgb();
      alpha = rgb.a ?? 1;
    }

    if (isAlphaWithinTolerance(alpha, 1.0, 0.005)) {
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
    return 'rgba(245, 34, 45, 0.45)';
  };

  const handleResetOpacity = () => {
    // Keep the same RGB but set alpha to 1
    if (typeof color === 'object' && 'toRgb' in color) {
      const rgb = color.toRgb();
      setColor(`rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`);
    } else {
      setColor('rgba(245, 34, 45, 1)');
    }
  };

  return (
    <Card title="Badge Style" style={{ width: 400 }}>
      {/* Badge preview on checkerboard */}
      <div
        style={{
          width: '100%',
          height: 80,
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
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            padding: '4px 12px',
            backgroundColor: getColorString(),
            borderRadius: 16,
            color: '#fff',
            fontWeight: 600,
            fontSize: 12,
          }}
        >
          BADGE
        </div>
      </div>

      {/* Control row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text>Badge color</Text>
        <ColorPicker
          value={color}
          onChange={setColor}
          showText={() => `${getAlphaPercent()}%`}
          panelRender={(panel) => (
            <div>
              {panel}
              <div style={{ padding: '8px 12px', borderTop: '1px solid #f0f0f0' }}>
                <Button
                  type="link"
                  size="small"
                  onClick={handleResetOpacity}
                  data-testid="reset-opacity"
                  style={{ padding: 0 }}
                >
                  Reset opacity
                </Button>
              </div>
            </div>
          )}
          data-testid="badge-color-picker"
        />
      </div>
    </Card>
  );
}
