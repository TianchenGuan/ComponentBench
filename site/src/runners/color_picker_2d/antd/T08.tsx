'use client';

/**
 * color_picker_2d-antd-T08: Set Secondary theme color to Cyan
 *
 * Layout: isolated_card centered ("Theme colors").
 * Two AntD ColorPicker instances of the same style are stacked vertically:
 *   1) "Primary theme color" (top)
 *   2) "Secondary theme color" (bottom) — this is the target
 * Both are rendered as swatch triggers with showText enabled; both open a popover on click.
 * Preset colors are configured and include a swatch labeled "Cyan" corresponding to #13C2C2.
 * Initial state: Primary = #1677FF (blue), Secondary = #FAAD14 (gold). The task requires changing ONLY Secondary to cyan.
 * Distractors: none beyond the second (non-target) instance which is visually similar.
 *
 * Success: Secondary theme color value represents color RGBA(19, 194, 194, 1.0). Primary must remain unchanged.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, ColorPicker, Typography } from 'antd';
import type { Color } from 'antd/es/color-picker';
import type { TaskComponentProps, RGBA } from '../types';

const { Text } = Typography;

const TARGET_COLOR: RGBA = { r: 19, g: 194, b: 194, a: 1.0 };
const INITIAL_PRIMARY = '#1677FF';

const presets = [
  {
    label: 'Theme colors',
    colors: ['#1677FF', '#F5222D', '#FAAD14', '#52C41A', '#13C2C2', '#722ED1', '#EB2F96'],
  },
];

export default function T08({ onSuccess }: TaskComponentProps) {
  const [primaryColor, setPrimaryColor] = useState<Color | string>(INITIAL_PRIMARY);
  const [secondaryColor, setSecondaryColor] = useState<Color | string>('#FAAD14');
  const successFiredRef = useRef(false);

  useEffect(() => {
    if (successFiredRef.current) return;

    // Check primary hasn't changed
    let primaryRgba: RGBA | null = null;
    if (typeof primaryColor === 'string') {
      const hex = primaryColor.replace('#', '');
      if (hex.length >= 6) {
        primaryRgba = {
          r: parseInt(hex.slice(0, 2), 16),
          g: parseInt(hex.slice(2, 4), 16),
          b: parseInt(hex.slice(4, 6), 16),
          a: 1,
        };
      }
    } else if (primaryColor && typeof primaryColor === 'object' && 'toRgb' in primaryColor) {
      const rgb = primaryColor.toRgb();
      primaryRgba = { r: rgb.r, g: rgb.g, b: rgb.b, a: rgb.a ?? 1 };
    }

    // Primary should stay at initial value (blue)
    if (!primaryRgba || primaryRgba.r !== 22 || primaryRgba.g !== 119 || primaryRgba.b !== 255) {
      return; // Primary changed - don't succeed
    }

    // Check secondary matches target
    let secondaryRgba: RGBA | null = null;
    if (typeof secondaryColor === 'string') {
      const hex = secondaryColor.replace('#', '');
      if (hex.length >= 6) {
        secondaryRgba = {
          r: parseInt(hex.slice(0, 2), 16),
          g: parseInt(hex.slice(2, 4), 16),
          b: parseInt(hex.slice(4, 6), 16),
          a: 1,
        };
      }
    } else if (secondaryColor && typeof secondaryColor === 'object' && 'toRgb' in secondaryColor) {
      const rgb = secondaryColor.toRgb();
      secondaryRgba = { r: rgb.r, g: rgb.g, b: rgb.b, a: rgb.a ?? 1 };
    }

    if (secondaryRgba && 
        secondaryRgba.r === TARGET_COLOR.r && 
        secondaryRgba.g === TARGET_COLOR.g && 
        secondaryRgba.b === TARGET_COLOR.b) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [primaryColor, secondaryColor, onSuccess]);

  return (
    <Card title="Theme colors" style={{ width: 400 }}>
      <div style={{ marginBottom: 16 }}>
        <Text type="secondary">Primary theme color; Secondary theme color</Text>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text>Primary theme color</Text>
          <ColorPicker
            value={primaryColor}
            onChange={setPrimaryColor}
            showText
            presets={presets}
            data-testid="primary-color"
          />
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text>Secondary theme color</Text>
          <ColorPicker
            value={secondaryColor}
            onChange={setSecondaryColor}
            showText
            presets={presets}
            data-testid="secondary-color"
          />
        </div>
      </div>
      
      <div style={{ marginTop: 16 }}>
        <Text type="secondary" style={{ fontSize: 12 }}>
          Set Secondary to #13C2C2 (Cyan). Do not change Primary.
        </Text>
      </div>
    </Card>
  );
}
