'use client';

/**
 * color_text_input-antd-T06: Set Link color using RGB string in a compact settings panel
 *
 * Layout: settings_panel with multiple rows (typical 'Appearance' settings) and compact spacing.
 * Component: AntD ColorPicker labeled 'Link color'. The row contains a short description text
 * and the ColorPicker trigger aligned to the right.
 *
 * Initial state: Link color is #1677ff (blue) and format is HEX.
 * Clutter: nearby rows contain unrelated toggles and a numeric input for font size.
 *
 * Interaction detail: to enter an RGB string, the agent must open the ColorPicker popover,
 * switch the format selector to RGB, then edit the RGB text field.
 *
 * Feedback: once valid, the link preview chip in the same row updates to the new orange color.
 *
 * Success: Link color parses to RGBA(255, 122, 0, 1.0) and the active display format is RGB.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Card, ColorPicker, Typography, Switch, InputNumber, Space } from 'antd';
import type { Color } from 'antd/es/color-picker';
import type { TaskComponentProps } from '../types';
import { isColorWithinTolerance } from '../types';

// ColorFormat type for antd color picker
type ColorFormat = 'hex' | 'rgb' | 'hsb';

const { Text } = Typography;

const TARGET_RGBA = { r: 255, g: 122, b: 0, a: 1 };

export default function T06({ onSuccess }: TaskComponentProps) {
  const [linkColor, setLinkColor] = useState<Color | string>('#1677ff');
  const [format, setFormat] = useState<ColorFormat>('hex');
  const [underlineLinks, setUnderlineLinks] = useState(true);
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [hasCompleted, setHasCompleted] = useState(false);

  const handleFormatChange = (newFormat?: ColorFormat) => {
    if (newFormat) {
      setFormat(newFormat);
    }
  };

  const checkSuccess = useCallback(() => {
    if (hasCompleted) return;
    
    let rgba = { r: 0, g: 0, b: 0, a: 1 };
    if (typeof linkColor === 'object' && 'toRgb' in linkColor) {
      const rgb = linkColor.toRgb();
      rgba = { r: rgb.r, g: rgb.g, b: rgb.b, a: rgb.a ?? 1 };
    } else if (typeof linkColor === 'string') {
      const hex = linkColor.replace('#', '');
      if (hex.length === 6) {
        rgba = {
          r: parseInt(hex.slice(0, 2), 16),
          g: parseInt(hex.slice(2, 4), 16),
          b: parseInt(hex.slice(4, 6), 16),
          a: 1,
        };
      }
    }

    // Must have correct color AND RGB format
    if (isColorWithinTolerance(rgba, TARGET_RGBA, 0, 0) && format === 'rgb') {
      setHasCompleted(true);
      onSuccess();
    }
  }, [linkColor, format, hasCompleted, onSuccess]);

  useEffect(() => {
    checkSuccess();
  }, [checkSuccess]);

  const getColorString = (): string => {
    if (typeof linkColor === 'object' && 'toRgbString' in linkColor) {
      return linkColor.toRgbString();
    }
    return linkColor as string;
  };

  return (
    <Card title="Appearance Settings" style={{ width: 450 }} data-testid="appearance-settings-card">
      <Space direction="vertical" style={{ width: '100%' }} size="small">
        {/* Link color row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
          <Space>
            <Text>Link color</Text>
            <span
              style={{
                display: 'inline-block',
                padding: '2px 8px',
                borderRadius: 4,
                backgroundColor: getColorString(),
                color: '#fff',
                fontSize: 11,
              }}
            >
              Preview
            </span>
          </Space>
          <ColorPicker
            value={linkColor}
            onChange={setLinkColor}
            format={format}
            onFormatChange={handleFormatChange}
            showText
            size="small"
            data-testid="link-color-picker"
          />
        </div>

        {/* Underline links row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderTop: '1px solid #f0f0f0' }}>
          <Text>Underline links</Text>
          <Switch checked={underlineLinks} onChange={setUnderlineLinks} size="small" />
        </div>

        {/* High contrast links row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderTop: '1px solid #f0f0f0' }}>
          <Text>High contrast links</Text>
          <Switch checked={highContrast} onChange={setHighContrast} size="small" />
        </div>

        {/* Font size row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderTop: '1px solid #f0f0f0' }}>
          <Text>Font size</Text>
          <InputNumber
            value={fontSize}
            onChange={(v) => setFontSize(v ?? 14)}
            min={10}
            max={24}
            size="small"
            style={{ width: 70 }}
          />
        </div>
      </Space>
    </Card>
  );
}
