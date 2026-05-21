'use client';

/**
 * color_picker_2d-antd-T09: Set Error banner color in a compact form
 *
 * Layout: form_section placed center, with multiple typical form fields (Switches, Selects, and Input fields) for notification settings.
 * Density: compact spacing mode is enabled, so controls are closer together and labels are tighter.
 * The target AntD ColorPicker is labeled "Error banner color" and appears inline in the form row next to other settings.
 * The ColorPicker opens a popover on click; preset colors are enabled with a section "Severity" containing "Error Red" (#F5222D) among a few similar reds/oranges.
 * Initial state: Error banner color is a muted orange (#FAAD14), not red.
 * Distractors: adjacent fields include a "Warning banner color" ColorPicker-like-looking swatch (static preview only) and a real "Warning banner color" dropdown elsewhere in the form.
 *
 * Success: Component value represents color RGBA(245, 34, 45, 1.0).
 */

import React, { useState, useEffect } from 'react';
import { Card, ColorPicker, Typography, Switch, Select, Input, Space } from 'antd';
import type { Color } from 'antd/es/color-picker';
import type { TaskComponentProps, RGBA } from '../types';

const { Text } = Typography;

const TARGET_COLOR: RGBA = { r: 245, g: 34, b: 45, a: 1.0 };

const presets = [
  {
    label: 'Severity',
    colors: ['#F5222D', '#FA541C', '#FA8C16', '#FAAD14'],
  },
];

export default function T09({ onSuccess }: TaskComponentProps) {
  const [errorColor, setErrorColor] = useState<Color | string>('#FAAD14');
  const [enableSound, setEnableSound] = useState(true);
  const [duration, setDuration] = useState('5');

  useEffect(() => {
    let rgba: RGBA | null = null;
    
    if (typeof errorColor === 'string') {
      const hex = errorColor.replace('#', '');
      if (hex.length >= 6) {
        rgba = {
          r: parseInt(hex.slice(0, 2), 16),
          g: parseInt(hex.slice(2, 4), 16),
          b: parseInt(hex.slice(4, 6), 16),
          a: 1,
        };
      }
    } else if (errorColor && typeof errorColor === 'object' && 'toRgb' in errorColor) {
      const rgb = errorColor.toRgb();
      rgba = { r: rgb.r, g: rgb.g, b: rgb.b, a: rgb.a ?? 1 };
    }

    if (rgba && 
        rgba.r === TARGET_COLOR.r && 
        rgba.g === TARGET_COLOR.g && 
        rgba.b === TARGET_COLOR.b) {
      onSuccess();
    }
  }, [errorColor, onSuccess]);

  return (
    <Card title="Notifications" style={{ width: 480 }} size="small">
      <Space direction="vertical" style={{ width: '100%' }} size="small">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 13 }}>Enable sound</Text>
          <Switch size="small" checked={enableSound} onChange={setEnableSound} />
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 13 }}>Duration (seconds)</Text>
          <Select
            size="small"
            value={duration}
            onChange={setDuration}
            style={{ width: 80 }}
            options={[
              { value: '3', label: '3s' },
              { value: '5', label: '5s' },
              { value: '10', label: '10s' },
            ]}
          />
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 13 }}>Warning banner color</Text>
          <div 
            style={{ 
              width: 24, 
              height: 24, 
              backgroundColor: '#FAAD14', 
              borderRadius: 4,
              border: '1px solid #d9d9d9',
            }} 
            title="Warning (static preview)"
          />
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 13 }}>Error banner color</Text>
          <ColorPicker
            value={errorColor}
            onChange={setErrorColor}
            size="small"
            presets={presets}
            data-testid="error-banner-color"
          />
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 13 }}>Custom message</Text>
          <Input size="small" placeholder="Optional" style={{ width: 120 }} />
        </div>
      </Space>
      
      <div style={{ marginTop: 12 }}>
        <Text type="secondary" style={{ fontSize: 11 }}>
          Set Error banner color to #F5222D.
        </Text>
      </div>
    </Card>
  );
}
