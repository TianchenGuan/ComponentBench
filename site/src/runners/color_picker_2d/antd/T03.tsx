'use client';

/**
 * color_picker_2d-antd-T03: Open the Border color picker popover
 *
 * Layout: isolated_card centered; only one interactive control is relevant.
 * The card contains a single AntD ColorPicker labeled "Border color". It is rendered as a swatch trigger (click to open).
 * The color picker is configured with trigger='click' and the popup placement set to bottomLeft (default-like).
 * Initial state: the popover is closed on page load.
 * Popover (when opened) contains the 2D saturation/value panel and hue slider; preset colors are present but irrelevant for this task.
 * Distractors: none; the rest of the card is explanatory text.
 *
 * Success: Color picker popup/open state equals True.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, ColorPicker, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

export default function T03({ onSuccess }: TaskComponentProps) {
  const [color, setColor] = useState<string>('#8C8C8C');
  const [isOpen, setIsOpen] = useState(false);
  const successFiredRef = useRef(false);

  useEffect(() => {
    if (isOpen && !successFiredRef.current) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [isOpen, onSuccess]);

  return (
    <Card title="Border Settings" style={{ width: 400 }}>
      <div style={{ marginBottom: 16 }}>
        <Text type="secondary">Border color: click to open the color picker.</Text>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text>Border color</Text>
        <ColorPicker
          value={color}
          onChange={(c) => setColor(typeof c === 'string' ? c : c.toHexString())}
          open={isOpen}
          onOpenChange={setIsOpen}
          trigger="click"
          placement="bottomLeft"
          data-testid="border-color"
        />
      </div>
      
      <div style={{ marginTop: 16 }}>
        <Text type="secondary" style={{ fontSize: 12 }}>
          Click the swatch to reveal the color panel.
        </Text>
      </div>
    </Card>
  );
}
