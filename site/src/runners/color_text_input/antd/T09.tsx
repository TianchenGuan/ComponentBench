'use client';

/**
 * color_text_input-antd-T09: Set color via HSB formatted input (popover, format switch)
 *
 * Layout: isolated_card anchored near the bottom-right of the viewport.
 * Component: a single AntD ColorPicker labeled 'Highlight color'. Opening it shows a format
 * selector with HEX/HSB/RGB and an editable text field for the active format.
 *
 * Initial state: Highlight color is #1677ff but the current display format is HEX.
 *
 * Interaction detail: the agent must switch the format to HSB and then enter the exact HSB string
 * 'hsb(215, 91%, 100%)' (including percent signs).
 *
 * Feedback: when valid, the trigger text updates to the HSB representation and the swatch
 * remains the same blue color.
 *
 * Success: Highlight color parses to RGBA(22, 119, 255, 1.0) and the active display format is HSB.
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

export default function T09({ onSuccess }: TaskComponentProps) {
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

    // Must have correct color AND HSB format
    if (isColorWithinTolerance(rgba, TARGET_RGBA, 0, 0) && format === 'hsb') {
      setHasCompleted(true);
      onSuccess();
    }
  }, [color, format, hasCompleted, onSuccess]);

  useEffect(() => {
    checkSuccess();
  }, [checkSuccess]);

  return (
    <Card title="Highlight Settings" style={{ width: 400 }} data-testid="highlight-settings-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text>Highlight color</Text>
        <ColorPicker
          value={color}
          onChange={setColor}
          format={format}
          onFormatChange={handleFormatChange}
          showText
          data-testid="highlight-color-picker"
        />
      </div>
      <Text type="secondary" style={{ fontSize: 12, marginTop: 8, display: 'block' }}>
        Current format: {format.toUpperCase()}
      </Text>
    </Card>
  );
}
