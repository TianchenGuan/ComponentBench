'use client';

/**
 * color_text_input-antd-T04: Clear a color value with AntD ColorPicker allowClear
 *
 * Layout: isolated_card centered with one field labeled 'Border color'.
 * Component: AntD ColorPicker configured with allowClear=true and showText=true.
 * The trigger shows the current color and a small clear (×) affordance when a value is present.
 *
 * Initial state: Border color is set to #722ed1 (purple) and shown as text next to the swatch.
 * Feedback: when cleared, the swatch becomes an 'empty/transparent' checker pattern and
 * the text switches to an empty placeholder such as '—' or 'No color'.
 *
 * Success: The Border color value is cleared/unset (no parsed RGBA value).
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Card, ColorPicker, Typography } from 'antd';
import type { Color } from 'antd/es/color-picker';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

export default function T04({ onSuccess }: TaskComponentProps) {
  const [color, setColor] = useState<Color | string | null>('#722ed1');
  const [hasCompleted, setHasCompleted] = useState(false);

  const checkSuccess = useCallback(() => {
    if (hasCompleted) return;
    
    // Success when color is null/undefined/empty (cleared)
    if (color === null || color === undefined || color === '') {
      setHasCompleted(true);
      onSuccess();
    }
  }, [color, hasCompleted, onSuccess]);

  useEffect(() => {
    checkSuccess();
  }, [checkSuccess]);

  const handleChange = (newColor: Color | null) => {
    setColor(newColor);
  };

  return (
    <Card title="Border Settings" style={{ width: 400 }} data-testid="border-settings-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text>Border color</Text>
        <ColorPicker
          value={color}
          onChange={handleChange}
          onClear={() => setColor(null)}
          showText
          allowClear
          format="hex"
          data-testid="border-color-picker"
        />
      </div>
      <Text type="secondary" style={{ fontSize: 12, marginTop: 8, display: 'block' }}>
        Clear color to remove the border
      </Text>
    </Card>
  );
}
