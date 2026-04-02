'use client';

/**
 * color_picker_2d-antd-T11: Match a reference swatch in dark theme
 *
 * Layout: isolated_card centered; theme is dark.
 * The card shows two things side-by-side:
 *   • Left: an AntD ColorPicker labeled "Avatar ring color" (click to open popover with 2D panel + hue/alpha sliders).
 *   • Right: a non-interactive reference color swatch labeled "Sample" (a solid square with no hex/RGB text).
 * Preset colors are disabled for the ColorPicker to force interaction via the 2D panel/slider controls.
 * Initial state: Avatar ring color is a default blue; it does NOT match the sample.
 * Goal is purely visual: the selected color should look the same as the Sample swatch; the page does not print the numeric value.
 *
 * Success: Selected color matches the on-page reference swatch 'sample-swatch' within tolerance (rgba_max_abs_channel_error: 6, alpha_max_abs_error: 0.03).
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, ColorPicker, Typography } from 'antd';
import type { Color } from 'antd/es/color-picker';
import type { TaskComponentProps, RGBA } from '../types';
import { isColorWithinTolerance } from '../types';

const { Text } = Typography;

// Reference swatch color (hidden from user, only shown visually)
const REFERENCE_COLOR: RGBA = { r: 250, g: 140, b: 22, a: 1.0 }; // #FA8C16 - Orange
const RGB_TOLERANCE = 6;
const ALPHA_TOLERANCE = 0.03;

export default function T11({ onSuccess }: TaskComponentProps) {
  const [color, setColor] = useState<Color | string>('#1677FF');
  const successFiredRef = useRef(false);

  useEffect(() => {
    if (successFiredRef.current) return;

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

    if (rgba && isColorWithinTolerance(rgba, REFERENCE_COLOR, RGB_TOLERANCE, ALPHA_TOLERANCE)) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [color, onSuccess]);

  return (
    <Card 
      title="Avatar Ring Color" 
      style={{ width: 400, background: '#1f1f1f' }}
      styles={{
        header: { color: '#fff', borderBottom: '1px solid #434343' },
        body: { background: '#1f1f1f' }
      }}
    >
      <div style={{ marginBottom: 16 }}>
        <Text style={{ color: '#aaa' }}>Avatar ring color — match the sample</Text>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Text style={{ color: '#fff' }}>Avatar ring color</Text>
          <ColorPicker
            value={color}
            onChange={setColor}
            data-testid="avatar-ring-color"
          />
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Text style={{ color: '#aaa', fontSize: 12 }}>Sample</Text>
          <div 
            data-testid="sample-swatch"
            style={{ 
              width: 32, 
              height: 32, 
              backgroundColor: `rgba(${REFERENCE_COLOR.r}, ${REFERENCE_COLOR.g}, ${REFERENCE_COLOR.b}, ${REFERENCE_COLOR.a})`,
              borderRadius: 4,
              border: '1px solid #434343',
            }} 
          />
        </div>
      </div>
      
      <div style={{ marginTop: 16 }}>
        <Text style={{ color: '#666', fontSize: 11 }}>
          Use the color picker to match the sample swatch.
        </Text>
      </div>
    </Card>
  );
}
