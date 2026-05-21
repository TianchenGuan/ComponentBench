'use client';

/**
 * color_swatch_picker-antd-T15: Match border color to subtle gray sample
 *
 * Layout: isolated_card anchored to top_right.
 * A ColorPicker with 24 grayscale swatches. Must match "Sample B" (#cfcfcf).
 *
 * Initial state: Border color is #ffffff (white).
 * Success: Selected color matches Sample B (#cfcfcf).
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, ColorPicker, Typography, Divider, Space } from 'antd';
import type { Color } from 'antd/es/color-picker';
import type { TaskComponentProps } from '../types';
import { normalizeHex, hexMatches, GRAYSCALE_SWATCHES } from '../types';

const { Text } = Typography;

const TARGET_COLOR = '#ced4da';

const presets = [
  {
    label: 'Grayscale',
    colors: GRAYSCALE_SWATCHES,
    defaultOpen: true,
  },
];

export default function T15({ task, onSuccess }: TaskComponentProps) {
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
        title="Border Styling" 
        style={{ width: 380 }}
        data-testid="border-styling-card"
      >
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8 }}>
            <Text type="secondary">Sample B</Text>
            <div
              data-testid="sample-b"
              data-color={TARGET_COLOR}
              style={{
                width: 48,
                height: 48,
                backgroundColor: TARGET_COLOR,
                borderRadius: 8,
                border: '1px solid #d9d9d9',
              }}
            />
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text>Border color</Text>
            <div data-testid="border-color">
              <ColorPicker
                value={color}
                onChange={setColor}
                presets={presets}
                panelRender={(panel, { components: { Presets } }) => (
                  <div>
                    <Divider style={{ margin: '8px 0' }}>Grayscale</Divider>
                    <Presets />
                  </div>
                )}
                getPopupContainer={() => containerRef.current || document.body}
              />
            </div>
          </div>
        </Space>
        <div data-testid="border-color-value" style={{ display: 'none' }}>
          {normalizeHex(currentHex)}
        </div>
      </Card>
    </div>
  );
}
