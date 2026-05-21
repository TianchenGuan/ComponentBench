'use client';

/**
 * color_swatch_picker-antd-T04: Match accent color to Sample A
 *
 * Layout: isolated_card centered on the page.
 * Left side: A reference swatch labeled "Sample A" showing the target color.
 * Right side: A ColorPicker to select the matching color.
 *
 * Initial state: Accent color is #1677ff (Ant Blue).
 * Success: Selected color matches Sample A (#eb2f96 Magenta).
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, ColorPicker, Typography, Divider, Space } from 'antd';
import type { Color } from 'antd/es/color-picker';
import type { TaskComponentProps } from '../types';
import { normalizeHex, hexMatches, BRAND_SWATCHES, NEUTRAL_SWATCHES } from '../types';

const { Text } = Typography;

const TARGET_COLOR = '#eb2f96';

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

export default function T04({ task, onSuccess }: TaskComponentProps) {
  const [color, setColor] = useState<Color | string>('#1677ff');
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
        title="Accent Preview" 
        style={{ width: 450 }}
        data-testid="accent-preview-card"
      >
        <Space size="large" align="center" style={{ width: '100%', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div
              data-testid="sample-a"
              data-color={TARGET_COLOR}
              style={{
                width: 48,
                height: 48,
                backgroundColor: TARGET_COLOR,
                borderRadius: 8,
                border: '1px solid #d9d9d9',
              }}
            />
            <Text type="secondary">Sample A</Text>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <Text>Accent color</Text>
            <div data-testid="accent-color">
              <ColorPicker
                value={color}
                onChange={setColor}
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
        </Space>
        <div data-testid="accent-color-value" style={{ display: 'none' }}>
          {normalizeHex(currentHex)}
        </div>
      </Card>
    </div>
  );
}
