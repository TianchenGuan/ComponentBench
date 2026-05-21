'use client';

/**
 * color_swatch_picker-antd-T13: Select Light Gray in dark theme
 *
 * Layout: isolated_card anchored to bottom_right with dark theme.
 * A ColorPicker with gray swatches in dark mode.
 *
 * Initial state: Surface highlight is #262626 (dark gray).
 * Success: Selected color equals #d9d9d9 (Light Gray).
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, ColorPicker, Typography, Divider } from 'antd';
import type { Color } from 'antd/es/color-picker';
import type { TaskComponentProps } from '../types';
import { normalizeHex, hexMatches, NEUTRAL_SWATCHES } from '../types';

const { Text } = Typography;

const TARGET_COLOR = '#d9d9d9';

// Extended neutrals for this task
const DARK_NEUTRALS = [
  { color: '#000000', name: 'Black' },
  { color: '#141414', name: 'Very Dark' },
  { color: '#1f1f1f', name: 'Dark' },
  { color: '#262626', name: 'Dark Gray' },
  { color: '#434343', name: 'Gray' },
  { color: '#595959', name: 'Mid Dark Gray' },
  { color: '#8c8c8c', name: 'Mid Gray' },
  { color: '#bfbfbf', name: 'Light Mid Gray' },
  { color: '#d9d9d9', name: 'Light Gray' },
  { color: '#f0f0f0', name: 'Very Light Gray' },
  { color: '#f5f5f5', name: 'Near White' },
  { color: '#ffffff', name: 'White' },
];

const presets = [
  {
    label: 'Neutrals',
    colors: DARK_NEUTRALS.map(s => s.color),
    defaultOpen: true,
  },
];

export default function T13({ task, onSuccess }: TaskComponentProps) {
  const [color, setColor] = useState<Color | string>('#262626');
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
        title="Dark Theme"
        style={{ width: 380 }}
        data-testid="dark-theme-card"
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text>Surface highlight</Text>
          <div data-testid="surface-highlight">
            <ColorPicker
              value={color}
              onChange={setColor}
              showText
              presets={presets}
              panelRender={(panel, { components: { Presets } }) => (
                <div>
                  <Divider style={{ margin: '8px 0' }}>Neutrals</Divider>
                  <Presets />
                </div>
              )}
              getPopupContainer={() => containerRef.current || document.body}
            />
          </div>
        </div>
        <div data-testid="surface-highlight-value" style={{ display: 'none' }}>
          {normalizeHex(currentHex)}
        </div>
      </Card>
    </div>
  );
}
