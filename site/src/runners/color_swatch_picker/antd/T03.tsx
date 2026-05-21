'use client';

/**
 * color_swatch_picker-antd-T03: Clear the selected highlight color
 *
 * Layout: isolated_card centered on the page.
 * A ColorPicker with allowClear enabled. Clicking the clear control resets to no color.
 *
 * Initial state: Highlight color is #52c41a (Green).
 * Success: Color is cleared (null/empty).
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, ColorPicker, Typography, Divider } from 'antd';
import type { Color } from 'antd/es/color-picker';
import type { TaskComponentProps } from '../types';
import { BRAND_SWATCHES, NEUTRAL_SWATCHES } from '../types';

const { Text } = Typography;

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

export default function T03({ task, onSuccess }: TaskComponentProps) {
  const [color, setColor] = useState<Color | string | null>('#52c41a');
  const [hasCompleted, setHasCompleted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const isCleared = color === null || color === '' || color === undefined;

  const checkSuccess = useCallback(() => {
    if (hasCompleted) return;
    
    if (isCleared) {
      setHasCompleted(true);
      onSuccess();
    }
  }, [isCleared, hasCompleted, onSuccess]);

  useEffect(() => {
    checkSuccess();
  }, [checkSuccess]);

  const handleChange = (newColor: Color | null) => {
    setColor(newColor);
  };

  return (
    <div ref={containerRef}>
      <Card 
        title="Highlights" 
        style={{ width: 400 }}
        data-testid="highlights-card"
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text>Highlight color</Text>
          <div data-testid="highlight-color">
            <ColorPicker
              value={color}
              onChange={handleChange} 
              onClear={() => setColor(null)}
              showText
              allowClear
              presets={presets}
              panelRender={(_, { components: { Presets } }) => (
                <div style={{ padding: 8 }}>
                  <button
                    onClick={() => { setColor(null); }}
                    data-testid="clear-color-button"
                    style={{
                      width: '100%',
                      padding: '6px 12px',
                      marginBottom: 8,
                      border: '1px dashed #d9d9d9',
                      borderRadius: 4,
                      background: '#fafafa',
                      cursor: 'pointer',
                      fontSize: 13,
                      color: '#999',
                    }}
                  >
                    Clear color
                  </button>
                  <Presets />
                </div>
              )}
              getPopupContainer={() => containerRef.current || document.body}
            />
          </div>
        </div>
        <div 
          data-testid="highlight-color-value" 
          data-cleared={isCleared ? 'true' : 'false'}
          style={{ display: 'none' }}
        >
          {isCleared ? '' : (typeof color === 'object' && color && 'toHexString' in color ? color.toHexString() : String(color))}
        </div>
      </Card>
    </div>
  );
}
