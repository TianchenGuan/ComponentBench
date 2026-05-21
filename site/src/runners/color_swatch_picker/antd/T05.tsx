'use client';

/**
 * color_swatch_picker-antd-T05: Open the Accent color swatches popover
 *
 * Layout: isolated_card anchored to top_left of the viewport.
 * A ColorPicker that needs to be opened to show the preset swatch grid.
 *
 * Initial state: Popover is closed.
 * Success: Popover is open (preset swatches visible).
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

export default function T05({ task, onSuccess }: TaskComponentProps) {
  const [color, setColor] = useState<Color | string>('#1677ff');
  const [isOpen, setIsOpen] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const checkSuccess = useCallback(() => {
    if (hasCompleted) return;
    
    if (isOpen) {
      setHasCompleted(true);
      onSuccess();
    }
  }, [isOpen, hasCompleted, onSuccess]);

  useEffect(() => {
    checkSuccess();
  }, [checkSuccess]);

  return (
    <div ref={containerRef}>
      <Card 
        title="Quick Accent" 
        style={{ width: 350 }}
        data-testid="quick-accent-card"
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text>Accent color</Text>
          <div data-testid="accent-color">
            <ColorPicker
              value={color}
              onChange={setColor}
              showText
              open={isOpen}
              onOpenChange={setIsOpen}
              presets={presets}
              panelRender={(panel, { components: { Presets } }) => (
                <div data-testid="accent-color-popover">
                  <Divider style={{ margin: '8px 0' }}>Preset Colors</Divider>
                  <Presets />
                </div>
              )}
              getPopupContainer={() => containerRef.current || document.body}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
