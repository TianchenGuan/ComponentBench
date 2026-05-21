'use client';

/**
 * color_picker_2d-antd-T01: Pick preset Ocean Blue for Brand color
 *
 * Layout: isolated_card centered in the viewport (single card titled "Theme colors").
 * The card contains one AntD ColorPicker labeled "Brand color". It renders as a small color swatch trigger with showText enabled (hex string shown next to the swatch).
 * Interaction: clicking the trigger opens a popover directly under the trigger with the standard AntD color UI: 2D saturation/value panel, hue slider, optional alpha slider, and a "Preset Colors" section.
 * Presets are configured with a labeled group "Brand palette", containing several named swatches including "Ocean Blue" which corresponds to #1677FF.
 * Initial state: Brand color is set to a different non-blue color (e.g., #F5222D), so the user must change it.
 * No other inputs are required for success; minor non-interactive text in the card explains that the selection updates live.
 *
 * Success: Component value represents color RGBA(22, 119, 255, 1.0).
 */

import React, { useState, useEffect } from 'react';
import { Card, ColorPicker, Typography } from 'antd';
import type { Color } from 'antd/es/color-picker';
import type { TaskComponentProps, RGBA } from '../types';

const { Text } = Typography;

const TARGET_COLOR: RGBA = { r: 22, g: 119, b: 255, a: 1.0 };

const presets = [
  {
    label: 'Brand palette',
    colors: [
      '#1677FF', // Ocean Blue
      '#F5222D', // Red
      '#FAAD14', // Gold
      '#52C41A', // Green
      '#13C2C2', // Cyan
      '#722ED1', // Purple
      '#EB2F96', // Magenta
    ],
  },
];

export default function T01({ onSuccess }: TaskComponentProps) {
  const [color, setColor] = useState<Color | string>('#F5222D');

  useEffect(() => {
    let rgba: RGBA | null = null;
    
    if (typeof color === 'string') {
      // Try to parse hex
      const hex = color.replace('#', '');
      if (hex.length >= 6) {
        rgba = {
          r: parseInt(hex.slice(0, 2), 16),
          g: parseInt(hex.slice(2, 4), 16),
          b: parseInt(hex.slice(4, 6), 16),
          a: hex.length === 8 ? parseInt(hex.slice(6, 8), 16) / 255 : 1,
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
        <Text type="secondary">Set Brand color to Ocean Blue (#1677FF).</Text>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text>Brand color</Text>
        <ColorPicker
          value={color}
          onChange={setColor}
          showText
          presets={presets}
          data-testid="brand-color"
        />
      </div>
      
      <div style={{ marginTop: 16 }}>
        <Text type="secondary" style={{ fontSize: 12 }}>
          The selection updates live.
        </Text>
      </div>
    </Card>
  );
}
