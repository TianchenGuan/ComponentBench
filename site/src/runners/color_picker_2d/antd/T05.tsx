'use client';

/**
 * color_picker_2d-antd-T05: Switch Preview color format to RGB
 *
 * Layout: isolated_card centered.
 * The card contains one AntD ColorPicker labeled "Preview color", rendered as a swatch trigger.
 * Configuration: presets are disabled for this instance, but format switching is enabled (HEX / RGB / HSB selector is visible inside the popover).
 * The current color is initialized to #1677FF and should remain visually identical after switching formats.
 * Initial state: the active format is HEX (the panel shows the HEX representation by default).
 * User must open the popover and choose the RGB format option; the selected format is reflected immediately in the panel (and may also update the trigger text).
 *
 * Success: Active color format equals 'rgb' and color value equals RGBA(22, 119, 255, 1.0).
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, ColorPicker, Typography } from 'antd';
import type { Color } from 'antd/es/color-picker';
import type { TaskComponentProps, RGBA } from '../types';

const { Text } = Typography;

// ColorFormat type for antd color picker
type ColorFormat = 'hex' | 'rgb' | 'hsb';

const TARGET_COLOR: RGBA = { r: 22, g: 119, b: 255, a: 1.0 };

export default function T05({ onSuccess }: TaskComponentProps) {
  const [color, setColor] = useState<Color | string>('#1677FF');
  const [format, setFormat] = useState<ColorFormat>('hex');
  const successFiredRef = useRef(false);

  const handleFormatChange = (newFormat?: ColorFormat) => {
    if (newFormat) setFormat(newFormat);
  };

  useEffect(() => {
    if (format !== 'rgb' || successFiredRef.current) return;
    
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
      successFiredRef.current = true;
      onSuccess();
    }
  }, [color, format, onSuccess]);

  return (
    <Card title="Color Format" style={{ width: 400 }}>
      <div style={{ marginBottom: 16 }}>
        <Text type="secondary">Preview color: format = RGB</Text>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text>Preview color</Text>
        <ColorPicker
          value={color}
          onChange={setColor}
          format={format}
          onFormatChange={handleFormatChange}
          showText
          data-testid="preview-color"
        />
      </div>
      
      <div style={{ marginTop: 16 }}>
        <Text type="secondary" style={{ fontSize: 12 }}>
          Open the picker and switch format to RGB without changing the color.
        </Text>
      </div>
    </Card>
  );
}
