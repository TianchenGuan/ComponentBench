'use client';

/**
 * color_picker_2d-antd-T13: Small compact picker: set translucent teal tint
 *
 * Layout: isolated_card anchored bottom-left of the viewport.
 * Density/scale: compact spacing is enabled and the ColorPicker trigger is small, making the interactive swatch tighter.
 * One AntD ColorPicker labeled "Map highlight tint" is present. Presets are disabled.
 * The popover contains the 2D saturation/value panel, hue slider, and alpha slider (alpha enabled).
 * Initial state: the color is fully opaque blue; the target requires both hue/saturation adjustment AND reducing alpha to ~0.35.
 * The panel shows a live-updating CSS color string, but the user must still manipulate small drag handles to reach the target.
 *
 * Success: Component value represents color RGBA(32, 201, 151, 0.35) within tolerance (rgba_max_abs_channel_error: 6, alpha_max_abs_error: 0.03).
 */

import React, { useState, useEffect } from 'react';
import { Card, ColorPicker, Typography } from 'antd';
import type { Color } from 'antd/es/color-picker';
import type { TaskComponentProps, RGBA } from '../types';
import { isColorWithinTolerance } from '../types';

const { Text } = Typography;

const TARGET_COLOR: RGBA = { r: 32, g: 201, b: 151, a: 0.35 };
const RGB_TOLERANCE = 6;
const ALPHA_TOLERANCE = 0.03;

export default function T13({ onSuccess }: TaskComponentProps) {
  const [color, setColor] = useState<Color | string>('rgba(22, 119, 255, 1)');

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
      } else {
        const hex = color.replace('#', '');
        if (hex.length >= 6) {
          rgba = {
            r: parseInt(hex.slice(0, 2), 16),
            g: parseInt(hex.slice(2, 4), 16),
            b: parseInt(hex.slice(4, 6), 16),
            a: 1,
          };
        }
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
    <Card title="Map Settings" style={{ width: 320 }} size="small">
      <div style={{ marginBottom: 12 }}>
        <Text type="secondary" style={{ fontSize: 12 }}>
          Map highlight tint: rgba(32, 201, 151, 0.35)
        </Text>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontSize: 13 }}>Map highlight tint</Text>
        <ColorPicker
          value={color}
          onChange={setColor}
          size="small"
          showText
          format="rgb"
          data-testid="map-highlight-tint"
        />
      </div>
      
      <div style={{ marginTop: 12 }}>
        <Text type="secondary" style={{ fontSize: 11 }}>
          Adjust hue to teal and reduce alpha to ~0.35.
        </Text>
      </div>
    </Card>
  );
}
