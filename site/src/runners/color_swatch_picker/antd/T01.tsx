'use client';

/**
 * color_swatch_picker-antd-T01: Set accent to Ant Blue
 *
 * Layout: isolated_card centered on the page.
 * A single Ant Design ColorPicker field labeled "Accent color" configured to show
 * preset swatches only (no spectrum/slider). The popover contains Brand and Neutrals groups.
 *
 * Initial state: Accent color is #ffffff (White).
 * Success: Selected color equals #1677ff (Ant Blue).
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, ColorPicker, Typography, Divider } from 'antd';
import type { Color } from 'antd/es/color-picker';
import type { TaskComponentProps } from '../types';
import { normalizeHex, hexMatches, BRAND_SWATCHES, NEUTRAL_SWATCHES } from '../types';

const { Text } = Typography;

const TARGET_COLOR = '#1677ff';

const presets = [
  {
    label: 'Brand',
    colors: BRAND_SWATCHES.map(s => s.color),
    defaultOpen: true,
  },
  {
    label: 'Neutrals',
    colors: NEUTRAL_SWATCHES.map(s => s.color),
    defaultOpen: true,
  },
];

export default function T01({ task, onSuccess }: TaskComponentProps) {
  const [color, setColor] = useState<Color | string>('#ffffff');
  const [hasCompleted, setHasCompleted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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
    <div ref={containerRef}>
      <Card 
        title="Theme Colors" 
        style={{ width: 400 }}
        data-testid="theme-colors-card"
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text>Accent color</Text>
          <div data-testid="accent-color">
            <ColorPicker
              value={color}
              onChange={setColor}
              showText
              presets={presets}
              panelRender={(panel, { components: { Presets } }) => (
                <div>
                  <Divider style={{ margin: '8px 0' }}>Preset Colors</Divider>
                  <Presets />
                </div>
              )}
              getPopupContainer={() => containerRef.current || document.body}
            />
          </div>
        </div>
        <div data-testid="accent-color-value" style={{ display: 'none' }}>
          {normalizeHex(currentHex)}
        </div>
      </Card>
    </div>
  );
}
