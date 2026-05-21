'use client';

/**
 * color_text_input-antd-T10: Match a visual target swatch with AntD HEX input
 *
 * Layout: isolated_card centered.
 * Guidance: visual-only. At the top of the card there is a large square 'Target swatch'
 * (non-interactive) showing the desired color, with no hex/RGB text.
 *
 * Component: below the swatch is a single AntD ColorPicker labeled 'Accent color' with
 * showText enabled. Its popover contains the editable HEX input.
 *
 * Initial state: Accent color starts at #ffffff.
 * Feedback: the Accent color trigger preview updates when the entered value parses;
 * a small side-by-side preview compares the current accent swatch to the target swatch.
 *
 * Success: The Accent color's parsed RGBA is within tolerance (rgb_abs: 5, a_abs: 0.05)
 * of the Target swatch color.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Card, ColorPicker, Typography, Space } from 'antd';
import type { Color } from 'antd/es/color-picker';
import type { TaskComponentProps } from '../types';
import { isColorWithinTolerance } from '../types';

const { Text } = Typography;

// Target color: A nice coral/salmon color
const TARGET_RGBA = { r: 250, g: 128, b: 114, a: 1 }; // salmon
const TARGET_HEX = '#fa8072';

export default function T10({ onSuccess }: TaskComponentProps) {
  const [color, setColor] = useState<Color | string>('#ffffff');
  const [hasCompleted, setHasCompleted] = useState(false);

  const checkSuccess = useCallback(() => {
    if (hasCompleted) return;
    
    let rgba = { r: 255, g: 255, b: 255, a: 1 };
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

    // Allow tolerance of 5 for RGB and 0.05 for alpha
    if (isColorWithinTolerance(rgba, TARGET_RGBA, 5, 0.05)) {
      setHasCompleted(true);
      onSuccess();
    }
  }, [color, hasCompleted, onSuccess]);

  useEffect(() => {
    checkSuccess();
  }, [checkSuccess]);

  const getColorString = (): string => {
    if (typeof color === 'object' && 'toHexString' in color) {
      return color.toHexString();
    }
    return color as string;
  };

  return (
    <Card title="Match the Color" style={{ width: 400 }} data-testid="match-color-card">
      {/* Target swatch */}
      <div style={{ marginBottom: 24 }}>
        <Text type="secondary" style={{ fontSize: 12, marginBottom: 8, display: 'block' }}>
          Target swatch
        </Text>
        <div
          data-testid="target_swatch"
          style={{
            width: 100,
            height: 100,
            backgroundColor: TARGET_HEX,
            borderRadius: 8,
            border: '2px solid #e8e8e8',
          }}
        />
      </div>

      {/* Side-by-side comparison */}
      <Space style={{ marginBottom: 16 }}>
        <div>
          <Text type="secondary" style={{ fontSize: 10, display: 'block', marginBottom: 4 }}>Target</Text>
          <div
            style={{
              width: 40,
              height: 40,
              backgroundColor: TARGET_HEX,
              borderRadius: 4,
              border: '1px solid #e8e8e8',
            }}
          />
        </div>
        <div>
          <Text type="secondary" style={{ fontSize: 10, display: 'block', marginBottom: 4 }}>Current</Text>
          <div
            style={{
              width: 40,
              height: 40,
              backgroundColor: getColorString(),
              borderRadius: 4,
              border: '1px solid #e8e8e8',
            }}
          />
        </div>
      </Space>

      {/* ColorPicker */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text>Accent color</Text>
        <ColorPicker
          value={color}
          onChange={setColor}
          showText
          format="hex"
          data-testid="accent-color-picker"
        />
      </div>
    </Card>
  );
}
