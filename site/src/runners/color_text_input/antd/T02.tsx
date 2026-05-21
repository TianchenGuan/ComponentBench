'use client';

/**
 * color_text_input-antd-T02: Set Badge color (top-left placement, mixed guidance)
 *
 * Layout: isolated_card anchored near the top-left of the viewport.
 * Component: AntD ColorPicker with showText enabled and HEX as the default format.
 * A small, non-interactive 'Reference' swatch is shown to the right of the label
 * to visually confirm the intended color.
 *
 * Initial state: Badge color starts at #1677ff (blue).
 * Feedback: when a valid HEX value is entered, the trigger preview updates and
 * the reference swatch and current swatch should visually match.
 *
 * Success: The Badge color ColorPicker's parsed color equals RGBA(255, 77, 79, 1.0).
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Card, ColorPicker, Typography, Space } from 'antd';
import type { Color } from 'antd/es/color-picker';
import type { TaskComponentProps } from '../types';
import { isColorWithinTolerance } from '../types';

const { Text } = Typography;

const TARGET_RGBA = { r: 255, g: 77, b: 79, a: 1 };
const TARGET_HEX = '#ff4d4f';

export default function T02({ onSuccess }: TaskComponentProps) {
  const [color, setColor] = useState<Color | string>('#1677ff');
  const [hasCompleted, setHasCompleted] = useState(false);

  const checkSuccess = useCallback(() => {
    if (hasCompleted) return;
    
    let rgba = { r: 0, g: 0, b: 0, a: 1 };
    if (typeof color === 'object' && 'toRgb' in color) {
      const rgb = color.toRgb();
      rgba = { r: rgb.r, g: rgb.g, b: rgb.b, a: rgb.a ?? 1 };
    } else if (typeof color === 'string') {
      const hex = color.replace('#', '');
      if (hex.length === 6) {
        rgba = {
          r: parseInt(hex.slice(0, 2), 16),
          g: parseInt(hex.slice(2, 4), 16),
          b: parseInt(hex.slice(4, 6), 16),
          a: 1,
        };
      }
    }

    if (isColorWithinTolerance(rgba, TARGET_RGBA, 0, 0)) {
      setHasCompleted(true);
      onSuccess();
    }
  }, [color, hasCompleted, onSuccess]);

  useEffect(() => {
    checkSuccess();
  }, [checkSuccess]);

  return (
    <Card title="Badge Settings" style={{ width: 400 }} data-testid="badge-settings-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Space>
          <Text>Badge color</Text>
          <div
            data-testid="reference-swatch"
            style={{
              width: 20,
              height: 20,
              backgroundColor: TARGET_HEX,
              borderRadius: 4,
              border: '1px solid #d9d9d9',
            }}
            title="Reference"
          />
        </Space>
        <ColorPicker
          value={color}
          onChange={setColor}
          showText
          format="hex"
          data-testid="badge-color-picker"
        />
      </div>
      <Text type="secondary" style={{ fontSize: 12, marginTop: 8, display: 'block' }}>
        Match the reference swatch color
      </Text>
    </Card>
  );
}
