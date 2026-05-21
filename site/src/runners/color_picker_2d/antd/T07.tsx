'use client';

/**
 * color_picker_2d-antd-T07: Set opacity to 60% for Overlay tint
 *
 * Layout: isolated_card centered ("Overlay" card).
 * One AntD ColorPicker labeled "Overlay tint" is rendered as a trigger swatch with showText enabled.
 * The popover includes the standard 2D panel, hue slider, and an alpha/opacity slider (alpha is enabled for this instance).
 * Initial state: the RGB channels are already set to the target purple (#722ED1), but opacity is 1.00 (fully opaque).
 * The user must adjust ONLY the opacity/alpha slider so that the color becomes 60% opaque while keeping the same hue/saturation.
 * The panel shows a numeric/text representation of the color (e.g., RGB/HEX and alpha), updating live as the slider is moved.
 *
 * Success: Component value represents color RGBA(114, 46, 209, 0.6) within tolerance (rgba_max_abs_channel_error: 2, alpha_max_abs_error: 0.02).
 */

import React, { useState, useEffect } from 'react';
import { Card, ColorPicker, Typography } from 'antd';
import type { Color } from 'antd/es/color-picker';
import type { TaskComponentProps, RGBA } from '../types';
import { isColorWithinTolerance } from '../types';

const { Text } = Typography;

const TARGET_COLOR: RGBA = { r: 114, g: 46, b: 209, a: 0.6 };
const RGB_TOLERANCE = 2;
const ALPHA_TOLERANCE = 0.02;

export default function T07({ onSuccess }: TaskComponentProps) {
  const [color, setColor] = useState<Color | string>('rgba(114, 46, 209, 1)');

  useEffect(() => {
    let rgba: RGBA | null = null;
    
    if (typeof color === 'string') {
      const match = color.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\s*\)/);
      if (match) {
        rgba = {
          r: parseInt(match[1], 10),
          g: parseInt(match[2], 10),
          b: parseInt(match[3], 10),
          a: match[4] ? parseFloat(match[4]) : 1,
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
    <Card title="Overlay" style={{ width: 400 }}>
      <div style={{ marginBottom: 16 }}>
        <Text type="secondary">Overlay tint: rgba(114, 46, 209, 0.60)</Text>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text>Overlay tint</Text>
        <ColorPicker
          value={color}
          onChange={setColor}
          showText
          format="rgb"
          data-testid="overlay-tint"
        />
      </div>
      
      <div style={{ marginTop: 16 }}>
        <Text type="secondary" style={{ fontSize: 12 }}>
          Adjust only the opacity slider to 60%.
        </Text>
      </div>
    </Card>
  );
}
