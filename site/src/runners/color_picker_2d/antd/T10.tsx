'use client';

/**
 * color_picker_2d-antd-T10: Hover-open small picker in dark theme
 *
 * Layout: isolated_card anchored near the top-right of the viewport (placement top_right).
 * Theme: dark mode is enabled; text and icons are light on a dark background.
 * The card contains one AntD ColorPicker labeled "Link color". The trigger size is small (AntD size='small'), so the swatch is compact.
 * Important interaction detail: the color picker is configured with trigger='hover' (custom trigger event), meaning the popover opens when the pointer hovers over the trigger (or focuses it).
 * Preset colors include a "Brand accents" group with a swatch for #EB2F96.
 * Initial state: Link color is #1677FF; it must be changed to the pink/magenta target.
 * Distractors: a nearby "Link underline" Switch and a "Visited link color" read-only preview swatch (not a picker).
 *
 * Success: Component value represents color RGBA(235, 47, 150, 1.0).
 */

import React, { useState, useEffect } from 'react';
import { Card, ColorPicker, Typography, Switch } from 'antd';
import type { Color } from 'antd/es/color-picker';
import type { TaskComponentProps, RGBA } from '../types';

const { Text } = Typography;

const TARGET_COLOR: RGBA = { r: 235, g: 47, b: 150, a: 1.0 };

const presets = [
  {
    label: 'Brand accents',
    colors: ['#1677FF', '#EB2F96', '#722ED1', '#13C2C2', '#52C41A'],
  },
];

export default function T10({ onSuccess }: TaskComponentProps) {
  const [linkColor, setLinkColor] = useState<Color | string>('#1677FF');
  const [showUnderline, setShowUnderline] = useState(true);

  useEffect(() => {
    let rgba: RGBA | null = null;
    
    if (typeof linkColor === 'string') {
      const hex = linkColor.replace('#', '');
      if (hex.length >= 6) {
        rgba = {
          r: parseInt(hex.slice(0, 2), 16),
          g: parseInt(hex.slice(2, 4), 16),
          b: parseInt(hex.slice(4, 6), 16),
          a: 1,
        };
      }
    } else if (linkColor && typeof linkColor === 'object' && 'toRgb' in linkColor) {
      const rgb = linkColor.toRgb();
      rgba = { r: rgb.r, g: rgb.g, b: rgb.b, a: rgb.a ?? 1 };
    }

    if (rgba && 
        rgba.r === TARGET_COLOR.r && 
        rgba.g === TARGET_COLOR.g && 
        rgba.b === TARGET_COLOR.b) {
      onSuccess();
    }
  }, [linkColor, onSuccess]);

  return (
    <Card 
      title="Header settings" 
      style={{ width: 320, background: '#1f1f1f' }}
      styles={{
        header: { color: '#fff', borderBottom: '1px solid #434343' },
        body: { background: '#1f1f1f' }
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ color: '#fff' }}>Link underline</Text>
          <Switch size="small" checked={showUnderline} onChange={setShowUnderline} />
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ color: '#fff' }}>Visited link color</Text>
          <div 
            style={{ 
              width: 20, 
              height: 20, 
              backgroundColor: '#722ED1', 
              borderRadius: 4,
              border: '1px solid #434343',
            }} 
            title="Visited (read-only)"
          />
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ color: '#fff' }}>Link color</Text>
          <ColorPicker
            value={linkColor}
            onChange={setLinkColor}
            size="small"
            trigger="hover"
            presets={presets}
            data-testid="link-color"
          />
        </div>
      </div>
      
      <div style={{ marginTop: 16 }}>
        <Text style={{ color: '#888', fontSize: 11 }}>
          Hover to open. Set to #EB2F96.
        </Text>
      </div>
    </Card>
  );
}
