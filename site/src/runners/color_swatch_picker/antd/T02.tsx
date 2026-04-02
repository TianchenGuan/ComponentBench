'use client';

/**
 * color_swatch_picker-antd-T02: Choose Warm Orange from always-open swatches
 *
 * Layout: isolated_card centered on the page.
 * A ColorPicker with inline panel showing preset swatches (always visible, no popover).
 *
 * Initial state: Button fill color is #1677ff (Ant Blue).
 * Success: Selected color equals #fa8c16 (Warm Orange).
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Card, ColorPicker, Typography, Divider } from 'antd';
import type { Color } from 'antd/es/color-picker';
import type { TaskComponentProps } from '../types';
import { normalizeHex, hexMatches, BRAND_SWATCHES } from '../types';

const { Text } = Typography;

const TARGET_COLOR = '#fa8c16';

const presets = [
  {
    label: 'Brand',
    colors: BRAND_SWATCHES.map(s => s.color),
    defaultOpen: true,
  },
];

export default function T02({ task, onSuccess }: TaskComponentProps) {
  const [color, setColor] = useState<Color | string>('#1677ff');
  const [hasCompleted, setHasCompleted] = useState(false);

  const currentHex = typeof color === 'object' && 'toHexString' in color
    ? color.toHexString()
    : String(color);

  const checkSuccess = useCallback(() => {
    if (hasCompleted) return;
    
    if (hexMatches(currentHex, TARGET_COLOR)) {
      setHasCompleted(true);
      onSuccess();
    }
  }, [currentHex, hasCompleted, onSuccess]);

  useEffect(() => {
    checkSuccess();
  }, [checkSuccess]);

  return (
    <Card 
      title="Button Style" 
      style={{ width: 400 }}
      data-testid="button-style-card"
    >
      <Text style={{ display: 'block', marginBottom: 12 }}>Button fill color</Text>
      <ColorPicker
        value={color}
        onChange={setColor}
        open={true}
        presets={presets}
        panelRender={(panel, { components: { Presets } }) => (
          <div>
            <Divider style={{ margin: '8px 0' }}>Preset Colors</Divider>
            <Presets />
          </div>
        )}
        data-testid="button-fill-color"
      />
      <div data-testid="button-fill-color-value" style={{ display: 'none' }}>
        {normalizeHex(currentHex)}
      </div>
    </Card>
  );
}
