'use client';

/**
 * color_picker_2d-antd-T15: Settings panel: clear Secondary accent color
 *
 * Layout: settings_panel anchored bottom-right with many common settings controls (toggles, selects, numeric inputs).
 * Two AntD ColorPicker instances appear in a "Accent colors" subsection:
 *   • "Primary accent color" (already set and should remain unchanged)
 *   • "Secondary accent color" (target to clear)
 * Both instances have allowClear=true. Each trigger shows a small swatch and (in this panel) no extra text to save space.
 * Initial state: Primary accent = #1677FF, Secondary accent = #EB2F96.
 * Clutter: additional controls include "Button radius", "Use gradient", and a non-interactive "Preview" swatch row, but these do not affect success.
 * The task is completed when the Secondary accent ColorPicker value is cleared/null.
 *
 * Success: Secondary accent color value is cleared (no color selected / empty value). Primary must remain unchanged.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, ColorPicker, Typography, Switch, Select, InputNumber, Space } from 'antd';
import type { Color } from 'antd/es/color-picker';
import type { TaskComponentProps, RGBA } from '../types';

const { Text } = Typography;

const INITIAL_PRIMARY = '#1677FF';

export default function T15({ onSuccess }: TaskComponentProps) {
  const [primaryColor, setPrimaryColor] = useState<Color | string | null>(INITIAL_PRIMARY);
  const [secondaryColor, setSecondaryColor] = useState<Color | string | null>('#EB2F96');
  const [buttonRadius, setButtonRadius] = useState<number>(6);
  const [useGradient, setUseGradient] = useState(false);
  const successFiredRef = useRef(false);

  useEffect(() => {
    if (successFiredRef.current) return;

    // Check primary hasn't been cleared or changed significantly
    if (primaryColor === null || primaryColor === undefined || primaryColor === '') {
      return; // Primary was cleared - don't succeed
    }

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

    // Check secondary is cleared
    if (secondaryColor === null || secondaryColor === undefined || secondaryColor === '') {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [primaryColor, secondaryColor, onSuccess]);

  return (
    <Card title="Settings" style={{ width: 340 }} size="small">
      <Space direction="vertical" style={{ width: '100%' }} size="small">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 13 }}>Button radius</Text>
          <InputNumber
            size="small"
            value={buttonRadius}
            onChange={(v) => setButtonRadius(v ?? 6)}
            min={0}
            max={20}
            style={{ width: 70 }}
          />
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 13 }}>Use gradient</Text>
          <Switch size="small" checked={useGradient} onChange={setUseGradient} />
        </div>
        
        <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 8, marginTop: 4 }}>
          <Text strong style={{ fontSize: 12, color: '#666' }}>Accent colors</Text>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 13 }}>Primary accent color</Text>
          <ColorPicker
            value={primaryColor ?? undefined}
            onChange={(c) => setPrimaryColor(c)}
            onClear={() => setPrimaryColor(null)}
            size="small"
            allowClear
            data-testid="primary-accent-color"
          />
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 13 }}>Secondary accent color</Text>
          <ColorPicker
            value={secondaryColor ?? undefined}
            onChange={(c) => setSecondaryColor(c)}
            onClear={() => setSecondaryColor(null)}
            size="small"
            allowClear
            data-testid="secondary-accent-color"
          />
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 13 }}>Preview</Text>
          <div style={{ display: 'flex', gap: 4 }}>
            <div style={{ 
              width: 16, height: 16, 
              backgroundColor: primaryColor ? (typeof primaryColor === 'string' ? primaryColor : primaryColor.toHexString?.() || '#1677FF') : '#ccc',
              borderRadius: 2,
              border: '1px solid #d9d9d9'
            }} />
            <div style={{ 
              width: 16, height: 16, 
              backgroundColor: secondaryColor ? (typeof secondaryColor === 'string' ? secondaryColor : secondaryColor.toHexString?.() || '#EB2F96') : '#ccc',
              borderRadius: 2,
              border: '1px solid #d9d9d9'
            }} />
          </div>
        </div>
      </Space>
      
      <div style={{ marginTop: 12 }}>
        <Text type="secondary" style={{ fontSize: 11 }}>
          Clear Secondary accent color. Do not change Primary.
        </Text>
      </div>
    </Card>
  );
}
