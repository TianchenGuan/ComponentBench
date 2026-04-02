'use client';

/**
 * color_text_input-antd-T01: Set Accent color by HEX in AntD ColorPicker
 *
 * Layout: isolated_card centered on the page with a single labeled control.
 * Component: AntD ColorPicker with showText enabled; the trigger shows a small color block
 * and the current value text. Clicking the trigger opens a popover panel that contains a
 * format selector (HEX/HSB/RGB) and an editable HEX input field.
 *
 * Initial state: Accent color is set to #000000 (black) and format is HEX.
 * Feedback: the trigger text and preview update as soon as a valid HEX value is entered.
 *
 * Success: The Accent color ColorPicker's parsed color equals RGBA(22, 119, 255, 1.0).
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Card, ColorPicker, Typography } from 'antd';
import type { Color } from 'antd/es/color-picker';
import type { TaskComponentProps } from '../types';
import { isColorWithinTolerance } from '../types';

const { Text } = Typography;

const TARGET_RGBA = { r: 22, g: 119, b: 255, a: 1 };

export default function T01({ onSuccess }: TaskComponentProps) {
  const [color, setColor] = useState<Color | string>('#000000');
  const [hasCompleted, setHasCompleted] = useState(false);

  const checkSuccess = useCallback(() => {
    if (hasCompleted) return;
    
    let rgba = { r: 0, g: 0, b: 0, a: 1 };
    if (typeof color === 'object' && 'toRgb' in color) {
      const rgb = color.toRgb();
      rgba = { r: rgb.r, g: rgb.g, b: rgb.b, a: rgb.a ?? 1 };
    } else if (typeof color === 'string') {
      // Parse hex string
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
    <Card title="Theme Settings" style={{ width: 400 }} data-testid="theme-settings-card">
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
