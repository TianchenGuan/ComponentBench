'use client';

/**
 * color_picker_2d-antd-T06: Drag to set Success Green
 *
 * Layout: isolated_card centered ("Status colors" card).
 * One AntD ColorPicker labeled "Success color" is shown as a trigger swatch. Preset colors are intentionally NOT provided for this instance.
 * Popover content: 2D saturation/value square with a draggable thumb, plus a horizontal hue slider below. Alpha is enabled but starts at 100%.
 * A small readout area in the panel shows the current color string (in the active format) updating live as the user drags.
 * Initial state: Success color starts at a neutral gray (#8C8C8C), so both hue and saturation must be adjusted.
 * The intended interaction is to drag in the 2D square and/or hue slider until the displayed value is close to #52C41A.
 *
 * Success: Component value represents color RGBA(82, 196, 26, 1.0) within tolerance (rgba_max_abs_channel_error: 5, alpha_max_abs_error: 0.02).
 */

import React, { useState, useEffect } from 'react';
import { Card, ColorPicker, Typography } from 'antd';
import type { Color } from 'antd/es/color-picker';
import type { TaskComponentProps, RGBA } from '../types';
import { isColorWithinTolerance } from '../types';

const { Text } = Typography;

const TARGET_COLOR: RGBA = { r: 82, g: 196, b: 26, a: 1.0 };
const RGB_TOLERANCE = 5;
const ALPHA_TOLERANCE = 0.02;

export default function T06({ onSuccess }: TaskComponentProps) {
  const [color, setColor] = useState<Color | string>('#8C8C8C');

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
      rgba = { r: Math.round(rgb.r), g: Math.round(rgb.g), b: Math.round(rgb.b), a: rgb.a ?? 1 };
    }

    if (rgba && isColorWithinTolerance(rgba, TARGET_COLOR, RGB_TOLERANCE, ALPHA_TOLERANCE)) {
      onSuccess();
    }
  }, [color, onSuccess]);

  return (
    <Card title="Status colors" style={{ width: 400 }}>
      <div style={{ marginBottom: 16 }}>
        <Text type="secondary">Success color: #52C41A</Text>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text>Success color</Text>
        <ColorPicker
          value={color}
          onChange={setColor}
          showText
          data-testid="success-color"
        />
      </div>
      
      <div style={{ marginTop: 16 }}>
        <Text type="secondary" style={{ fontSize: 12 }}>
          Drag in the color panel to adjust hue and saturation.
        </Text>
      </div>
    </Card>
  );
}
