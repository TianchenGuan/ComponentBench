'use client';

/**
 * color_swatch_picker-antd-T08: Set Secondary color with two pickers
 *
 * Layout: isolated_card centered on the page.
 * Two ColorPickers stacked vertically: Primary color (top) and Secondary color (bottom).
 *
 * Initial state: Primary = #1677ff, Secondary = #52c41a.
 * Success: Secondary color equals #722ed1 (Purple). Primary must remain unchanged.
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, ColorPicker, Typography, Divider, Space } from 'antd';
import type { Color } from 'antd/es/color-picker';
import type { TaskComponentProps } from '../types';
import { normalizeHex, hexMatches, BRAND_SWATCHES, NEUTRAL_SWATCHES } from '../types';

const { Text } = Typography;

const TARGET_COLOR = '#722ed1';

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

export default function T08({ task, onSuccess }: TaskComponentProps) {
  const [primaryColor, setPrimaryColor] = useState<Color | string>('#1677ff');
  const [secondaryColor, setSecondaryColor] = useState<Color | string>('#52c41a');
  const [hasCompleted, setHasCompleted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const secondaryHex = typeof secondaryColor === 'object' && 'toHexString' in secondaryColor
    ? secondaryColor.toHexString()
    : String(secondaryColor);

  const checkSuccess = useCallback(() => {
    if (hasCompleted) return;
    
    if (hexMatches(secondaryHex, TARGET_COLOR)) {
      setHasCompleted(true);
      onSuccess();
    }
  }, [secondaryHex, hasCompleted, onSuccess]);

  useEffect(() => {
    checkSuccess();
  }, [checkSuccess]);

  return (
    <div ref={containerRef}>
      <Card 
        title="Brand Colors" 
        style={{ width: 400 }}
        data-testid="brand-colors-card"
      >
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <div 
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            data-testid="primary-color"
          >
            <Text>Primary color</Text>
            <ColorPicker
              value={primaryColor}
              onChange={setPrimaryColor}
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
          
          <div 
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            data-testid="secondary-color"
          >
            <Text>Secondary color</Text>
            <ColorPicker
              value={secondaryColor}
              onChange={setSecondaryColor}
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
        </Space>
        <div data-testid="secondary-color-value" style={{ display: 'none' }}>
          {normalizeHex(secondaryHex)}
        </div>
      </Card>
    </div>
  );
}
