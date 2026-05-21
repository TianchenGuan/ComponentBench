'use client';

/**
 * color_picker_2d-antd-T04: Clear the Highlight color
 *
 * Layout: isolated_card centered with a small "Theme colors" section.
 * One AntD ColorPicker labeled "Highlight color" is configured with allowClear=true and showText=true.
 * The trigger shows the current selected color swatch and its text representation; when cleared, the trigger shows an empty/cleared state (e.g., placeholder text like "No color" or an empty swatch).
 * The clear control is exposed as a small "x"/clear icon on the trigger (standard AntD allowClear behavior).
 * Initial state: Highlight color is set to #13C2C2 (cyan), so the user must clear it.
 * No additional components are present; no modals/drawers.
 *
 * Success: Color value is cleared (no color selected / empty value).
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, ColorPicker, Typography } from 'antd';
import type { Color } from 'antd/es/color-picker';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

export default function T04({ onSuccess }: TaskComponentProps) {
  const [color, setColor] = useState<Color | string | null>('#13C2C2');
  const successFiredRef = useRef(false);

  useEffect(() => {
    if ((color === null || color === undefined || color === '') && !successFiredRef.current) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [color, onSuccess]);

  return (
    <Card title="Theme colors" style={{ width: 400 }}>
      <div style={{ marginBottom: 16 }}>
        <Text type="secondary">Highlight color: Clear</Text>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text>Highlight color</Text>
        <ColorPicker
          value={color ?? undefined}
          onChange={(c) => setColor(c)}
          onClear={() => setColor(null)}
          allowClear
          showText
          data-testid="highlight-color"
        />
      </div>
      
      <div style={{ marginTop: 16 }}>
        <Text type="secondary" style={{ fontSize: 12 }}>
          Click the clear (×) icon to remove the color.
        </Text>
      </div>
    </Card>
  );
}
