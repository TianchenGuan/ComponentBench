'use client';

/**
 * color_text_input-antd-T05: Switch AntD ColorPicker format to RGB (no color change)
 *
 * Layout: isolated_card centered with one ColorPicker labeled 'Accent color'.
 * Component: AntD ColorPicker with showText enabled. Opening the popover shows a format
 * selector with three options: HEX, HSB, and RGB.
 *
 * Initial state: Accent color is already set to #1677ff and the current format is HEX,
 * so the text input shows a HEX value.
 *
 * Goal nuance: only the format display should change to RGB; the color value should remain the same.
 * Feedback: when RGB format is active, the editable text field shows an RGB string like 'rgb(22, 119, 255)'.
 *
 * Success: The Accent color's parsed color remains RGBA(22, 119, 255, 1.0) and the active display format is RGB.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Card, ColorPicker, Typography } from 'antd';
import type { Color } from 'antd/es/color-picker';
import type { TaskComponentProps } from '../types';
import { isColorWithinTolerance } from '../types';

// ColorFormat type for antd color picker
type ColorFormat = 'hex' | 'rgb' | 'hsb';

const { Text } = Typography;

const TARGET_RGBA = { r: 22, g: 119, b: 255, a: 1 };

export default function T05({ onSuccess }: TaskComponentProps) {
  const [color, setColor] = useState<Color | string>('#1677ff');
  const [format, setFormat] = useState<ColorFormat>('hex');
  const [hasCompleted, setHasCompleted] = useState(false);

  const handleFormatChange = (newFormat?: ColorFormat) => {
    if (newFormat) {
      setFormat(newFormat);
    }
  };

  const checkSuccess = useCallback(() => {
    if (hasCompleted) return;
    
    // Check both color and format
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

    // Must have correct color AND RGB format
    if (isColorWithinTolerance(rgba, TARGET_RGBA, 0, 0) && format === 'rgb') {
      setHasCompleted(true);
      onSuccess();
    }
  }, [color, format, hasCompleted, onSuccess]);

  useEffect(() => {
    checkSuccess();
  }, [checkSuccess]);

  return (
    <Card title="Color Format" style={{ width: 400 }} data-testid="color-format-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text>Accent color</Text>
        <ColorPicker
          value={color}
          onChange={setColor}
          format={format}
          onFormatChange={handleFormatChange}
          showText
          data-testid="accent-color-picker"
        />
      </div>
      <Text type="secondary" style={{ fontSize: 12, marginTop: 8, display: 'block' }}>
        Current format: {format.toUpperCase()}
      </Text>
    </Card>
  );
}
