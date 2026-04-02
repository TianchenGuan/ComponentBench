'use client';

/**
 * alpha_slider-antd-T07: Scroll to watermark opacity and set to 40%
 *
 * A settings panel (right-aligned in the viewport) contains multiple sections with typical app settings:
 * - Sections like "Notifications", "Layout", and "Watermark" appear in a single scrollable column.
 * - The target control is in the "Watermark" section near the bottom (initially below the fold), so scrolling is required.
 * - In "Watermark", there is a labeled AntD ColorPicker control: "Watermark tint".
 * - The ColorPicker panel is set to stay open inline when the section is in view (so the opacity slider is visible once you reach it).
 * - The opacity/alpha slider is labeled "Opacity" and shows a percent readout.
 * Initial state:
 * - Watermark opacity starts at 60%.
 * Clutter:
 * - Nearby non-target controls include switches, selects, and a second ColorPicker for "Highlight color" in a different section.
 *
 * Success: The 'Watermark tint' alpha is set to 0.40 (40% opacity). Alpha must be within ±0.015 of the target value.
 */

import React, { useState, useEffect } from 'react';
import { Card, ColorPicker, Typography, Switch, Select, Divider } from 'antd';
import type { Color } from 'antd/es/color-picker';
import type { TaskComponentProps } from '../types';
import { isAlphaWithinTolerance } from '../types';

const { Text, Title } = Typography;

export default function T07({ onSuccess }: TaskComponentProps) {
  const [watermarkColor, setWatermarkColor] = useState<Color | string>('rgba(0, 0, 0, 0.6)');
  const [highlightColor, setHighlightColor] = useState<Color | string>('rgba(255, 193, 7, 0.8)');
  const [notifications, setNotifications] = useState(true);
  const [layout, setLayout] = useState('comfortable');

  useEffect(() => {
    let alpha = 0.6;
    if (typeof watermarkColor === 'string') {
      const match = watermarkColor.match(/rgba?\([^)]+,\s*([\d.]+)\)/);
      if (match) alpha = parseFloat(match[1]);
    } else if (watermarkColor && typeof watermarkColor === 'object' && 'toRgb' in watermarkColor) {
      const rgb = watermarkColor.toRgb();
      alpha = rgb.a ?? 1;
    }

    if (isAlphaWithinTolerance(alpha, 0.4, 0.015)) {
      onSuccess();
    }
  }, [watermarkColor, onSuccess]);

  const getAlphaPercent = (color: Color | string): number => {
    if (typeof color === 'string') {
      const match = color.match(/rgba?\([^)]+,\s*([\d.]+)\)/);
      return match ? Math.round(parseFloat(match[1]) * 100) : 100;
    } else if (color && typeof color === 'object' && 'toRgb' in color) {
      const rgb = color.toRgb();
      return Math.round((rgb.a ?? 1) * 100);
    }
    return 100;
  };

  return (
    <Card 
      style={{ 
        width: 360, 
        height: 400, 
        overflow: 'auto',
      }}
      bodyStyle={{ padding: 0 }}
    >
      <div style={{ padding: 16 }}>
        {/* Notifications Section */}
        <Title level={5} style={{ marginTop: 0 }}>Notifications</Title>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Text>Enable notifications</Text>
          <Switch checked={notifications} onChange={setNotifications} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Text>Sound alerts</Text>
          <Switch defaultChecked />
        </div>
        
        <Divider />

        {/* Layout Section */}
        <Title level={5}>Layout</Title>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Text>Display density</Text>
          <Select 
            value={layout} 
            onChange={setLayout} 
            style={{ width: 120 }}
            options={[
              { value: 'compact', label: 'Compact' },
              { value: 'comfortable', label: 'Comfortable' },
              { value: 'spacious', label: 'Spacious' },
            ]}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Text>Highlight color</Text>
          <ColorPicker 
            value={highlightColor} 
            onChange={setHighlightColor}
            showText={() => `${getAlphaPercent(highlightColor)}%`}
            data-testid="highlight-color-picker"
          />
        </div>

        <Divider />

        {/* Watermark Section - Target */}
        <Title level={5}>Watermark</Title>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Text>Show watermark</Text>
          <Switch defaultChecked />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Text>Watermark tint</Text>
          <ColorPicker 
            value={watermarkColor} 
            onChange={setWatermarkColor}
            showText={() => `${getAlphaPercent(watermarkColor)}%`}
            data-testid="watermark-tint-picker"
          />
        </div>

        <Divider />

        {/* Extra padding to ensure scroll is needed */}
        <Title level={5}>Advanced</Title>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Text>Debug mode</Text>
          <Switch />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text>Performance logging</Text>
          <Switch />
        </div>
      </div>
    </Card>
  );
}
