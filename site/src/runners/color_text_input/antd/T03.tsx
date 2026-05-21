'use client';

/**
 * color_text_input-antd-T03: Set Secondary color when two AntD ColorPickers are present
 *
 * Layout: isolated_card centered; a small 'Theme colors' section contains two labeled
 * ColorPicker controls in a two-column grid.
 *
 * Instances: 2 ColorPickers of the same type with labels 'Primary color' and 'Secondary color'.
 * Both use showText and open a popover with a HEX input.
 *
 * Initial state: Primary color = #1677ff; Secondary color = #f0f0f0.
 * Distractors: the two controls look nearly identical aside from their labels.
 * Feedback: each trigger updates independently when its HEX input becomes valid.
 *
 * Success: The Secondary color instance parses to RGBA(82, 196, 26, 1.0).
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Card, ColorPicker, Typography, Row, Col } from 'antd';
import type { Color } from 'antd/es/color-picker';
import type { TaskComponentProps } from '../types';
import { isColorWithinTolerance } from '../types';

const { Text } = Typography;

const TARGET_RGBA = { r: 82, g: 196, b: 26, a: 1 };

export default function T03({ onSuccess }: TaskComponentProps) {
  const [primaryColor, setPrimaryColor] = useState<Color | string>('#1677ff');
  const [secondaryColor, setSecondaryColor] = useState<Color | string>('#f0f0f0');
  const [hasCompleted, setHasCompleted] = useState(false);

  const checkSuccess = useCallback(() => {
    if (hasCompleted) return;
    
    let rgba = { r: 0, g: 0, b: 0, a: 1 };
    if (typeof secondaryColor === 'object' && 'toRgb' in secondaryColor) {
      const rgb = secondaryColor.toRgb();
      rgba = { r: rgb.r, g: rgb.g, b: rgb.b, a: rgb.a ?? 1 };
    } else if (typeof secondaryColor === 'string') {
      const hex = secondaryColor.replace('#', '');
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
  }, [secondaryColor, hasCompleted, onSuccess]);

  useEffect(() => {
    checkSuccess();
  }, [checkSuccess]);

  return (
    <Card title="Theme colors" style={{ width: 400 }} data-testid="theme-colors-card">
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Text>Primary color</Text>
            <ColorPicker
              value={primaryColor}
              onChange={setPrimaryColor}
              showText
              format="hex"
              data-testid="primary-color-picker"
            />
          </div>
        </Col>
        <Col span={12}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Text>Secondary color</Text>
            <ColorPicker
              value={secondaryColor}
              onChange={setSecondaryColor}
              showText
              format="hex"
              data-testid="secondary-color-picker"
            />
          </div>
        </Col>
      </Row>
    </Card>
  );
}
