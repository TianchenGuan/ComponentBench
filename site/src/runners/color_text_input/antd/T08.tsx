'use client';

/**
 * color_text_input-antd-T08: Set Tertiary accent in dark theme with three AntD ColorPickers
 *
 * Layout: form_section styled as a dark-themed 'Brand colors' card; the section is centered
 * but uses a dark background and light text.
 *
 * Instances: 3 AntD ColorPickers with labels 'Primary accent', 'Secondary accent', and 'Tertiary accent'.
 * Each opens a popover with an editable HEX input.
 *
 * Initial state: Primary accent=#1677ff, Secondary accent=#52c41a, Tertiary accent=#262626.
 * Distractors: the three triggers are visually similar; only the label distinguishes them.
 *
 * Feedback: each trigger's text updates when its HEX input parses successfully;
 * in dark theme the input borders and focus rings are lower-contrast.
 *
 * Success: The Tertiary accent instance parses to RGBA(250, 173, 20, 1.0).
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Card, ColorPicker, Typography, Space } from 'antd';
import type { Color } from 'antd/es/color-picker';
import type { TaskComponentProps } from '../types';
import { isColorWithinTolerance } from '../types';

const { Text, Title } = Typography;

const TARGET_RGBA = { r: 250, g: 173, b: 20, a: 1 };

export default function T08({ onSuccess }: TaskComponentProps) {
  const [primaryColor, setPrimaryColor] = useState<Color | string>('#1677ff');
  const [secondaryColor, setSecondaryColor] = useState<Color | string>('#52c41a');
  const [tertiaryColor, setTertiaryColor] = useState<Color | string>('#262626');
  const [hasCompleted, setHasCompleted] = useState(false);

  const checkSuccess = useCallback(() => {
    if (hasCompleted) return;
    
    let rgba = { r: 0, g: 0, b: 0, a: 1 };
    if (typeof tertiaryColor === 'object' && 'toRgb' in tertiaryColor) {
      const rgb = tertiaryColor.toRgb();
      rgba = { r: rgb.r, g: rgb.g, b: rgb.b, a: rgb.a ?? 1 };
    } else if (typeof tertiaryColor === 'string') {
      const hex = tertiaryColor.replace('#', '');
      if (hex.length === 6) {
        rgba = {
          r: parseInt(hex.slice(0, 2), 16),
          g: parseInt(hex.slice(2, 4), 16),
          b: parseInt(hex.slice(4, 6), 16),
          a: 1,
        };
      }
    }

    if (isColorWithinTolerance(rgba, TARGET_RGBA, 0, 0)) {
      setHasCompleted(true);
      onSuccess();
    }
  }, [tertiaryColor, hasCompleted, onSuccess]);

  useEffect(() => {
    checkSuccess();
  }, [checkSuccess]);

  return (
    <Card
      title={<span style={{ color: '#fff' }}>Brand colors</span>}
      style={{
        width: 400,
        backgroundColor: '#1f1f1f',
        borderColor: '#303030',
      }}
      styles={{
        header: { backgroundColor: '#1f1f1f', borderBottom: '1px solid #303030' },
        body: { backgroundColor: '#1f1f1f' },
      }}
      data-testid="brand-colors-card"
    >
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        {/* Primary accent */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ color: '#fff' }}>Primary accent</Text>
          <ColorPicker
            value={primaryColor}
            onChange={setPrimaryColor}
            showText
            format="hex"
            data-testid="primary-accent-picker"
          />
        </div>

        {/* Secondary accent */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ color: '#fff' }}>Secondary accent</Text>
          <ColorPicker
            value={secondaryColor}
            onChange={setSecondaryColor}
            showText
            format="hex"
            data-testid="secondary-accent-picker"
          />
        </div>

        {/* Tertiary accent */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ color: '#fff' }}>Tertiary accent</Text>
          <ColorPicker
            value={tertiaryColor}
            onChange={setTertiaryColor}
            showText
            format="hex"
            data-testid="tertiary-accent-picker"
          />
        </div>
      </Space>
    </Card>
  );
}
