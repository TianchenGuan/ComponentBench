'use client';

/**
 * color_swatch_picker-antd-T11: Scroll to find Teal Deep swatch
 *
 * Layout: isolated_card centered with compact spacing and small scale.
 * A ColorPicker with a large teal ramp swatch list that requires scrolling.
 *
 * Initial state: Accent color is #1677ff (blue).
 * Success: Selected color equals #0f766e (Teal Deep).
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, ColorPicker, Typography, Divider, ConfigProvider } from 'antd';
import type { Color } from 'antd/es/color-picker';
import type { TaskComponentProps } from '../types';
import { normalizeHex, hexMatches, TEAL_RAMP_SWATCHES } from '../types';

const { Text } = Typography;

const TARGET_COLOR = '#0f766e';

const presets = [
  {
    label: 'Teal ramp',
    colors: TEAL_RAMP_SWATCHES,
    defaultOpen: true,
  },
];

export default function T11({ task, onSuccess }: TaskComponentProps) {
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
      <ConfigProvider componentSize="small">
        <Card 
          title="Theme Colors" 
          style={{ width: 320 }}
          styles={{ body: { padding: 12 } }}
          data-testid="theme-colors-card"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text>Accent color</Text>
            <div data-testid="accent-color">
              <ColorPicker
                value={color}
                onChange={setColor}
                size="small"
                presets={presets}
                panelRender={(panel, { components: { Presets } }) => (
                  <div style={{ maxHeight: 200, overflow: 'auto' }}>
                    <Divider style={{ margin: '8px 0' }}>Teal ramp</Divider>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 2, padding: 8 }}>
                      {TEAL_RAMP_SWATCHES.map((swatchColor) => (
                        <div
                          key={swatchColor}
                          onClick={() => setColor(swatchColor)}
                          title={swatchColor}
                          data-color={swatchColor}
                          style={{
                            width: 18,
                            height: 18,
                            backgroundColor: swatchColor,
                            borderRadius: 2,
                            cursor: 'pointer',
                            border: '1px solid rgba(0,0,0,0.1)',
                          }}
                        />
                      ))}
                    </div>
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
      </ConfigProvider>
    </div>
  );
}
