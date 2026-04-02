'use client';

/**
 * color_picker_2d-antd-T02: Pick preset Warning Gold for Accent color
 *
 * Layout: baseline isolated_card centered on the page (card titled "Theme colors").
 * One AntD ColorPicker labeled "Accent color" is shown with a clickable swatch trigger (no extra buttons).
 * Popover content includes the standard 2D spectrum panel and a Preset Colors section.
 * Presets are configured with a group "Status colors" that includes a swatch labeled "Warning Gold" mapped to #FAAD14.
 * Initial state: Accent color is #1677FF (blue), so selecting the gold preset changes the value.
 * There are no other ColorPicker instances on the page.
 *
 * Success: Component value represents color RGBA(250, 173, 20, 1.0).
 */

import React, { useState, useEffect } from 'react';
import { Card, ColorPicker, Typography } from 'antd';
import type { Color } from 'antd/es/color-picker';
import type { TaskComponentProps, RGBA } from '../types';

const { Text } = Typography;

const TARGET_COLOR: RGBA = { r: 250, g: 173, b: 20, a: 1.0 };

const presets = [
  {
    label: 'Status colors',
    colors: [
      '#FAAD14', // Warning Gold
      '#F5222D', // Error Red
      '#52C41A', // Success Green
      '#13C2C2', // Info Cyan
    ],
  },
];

export default function T02({ onSuccess }: TaskComponentProps) {
  const [color, setColor] = useState<Color | string>('#1677FF');

  useEffect(() => {
    let rgba: RGBA | null = null;
    
    if (typeof color === 'string') {
      const hex = color.replace('#', '');
      if (hex.length >= 6) {
        rgba = {
          r: parseInt(hex.slice(0, 2), 16),
          g: parseInt(hex.slice(2, 4), 16),
          b: parseInt(hex.slice(4, 6), 16),
          a: 1,
        };
      }
    } else if (color && typeof color === 'object' && 'toRgb' in color) {
      const rgb = color.toRgb();
      rgba = { r: rgb.r, g: rgb.g, b: rgb.b, a: rgb.a ?? 1 };
    }

    if (rgba && 
        rgba.r === TARGET_COLOR.r && 
        rgba.g === TARGET_COLOR.g && 
        rgba.b === TARGET_COLOR.b) {
      onSuccess();
    }
  }, [color, onSuccess]);

  return (
    <Card title="Theme colors" style={{ width: 400 }}>
      <div style={{ marginBottom: 16 }}>
        <Text type="secondary">Accent color: set to Warning Gold (#FAAD14).</Text>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text>Accent color</Text>
        <ColorPicker
          value={color}
          onChange={setColor}
          presets={presets}
          data-testid="accent-color"
        />
      </div>
    </Card>
  );
}
