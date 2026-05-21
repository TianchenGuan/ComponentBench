'use client';

/**
 * alpha_slider-antd-v2-T06: Corner trigger without numeric target readout
 *
 * Top-right corner card; Tooltip tint matches Target chip (alpha ±0.01). Reference id: tooltip-alpha-target-chip.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, ColorPicker, Typography, Switch, Space } from 'antd';
import type { Color } from 'antd/es/color-picker';
import type { TaskComponentProps } from '../../types';
import { isAlphaWithinTolerance } from '../../types';

const { Text } = Typography;

const BASE = { r: 22, g: 119, b: 255 };
const TARGET_ALPHA = 0.46;

function alphaFromColor(c: Color | string): number {
  if (typeof c === 'string') {
    const m = c.match(/rgba?\([^)]+,\s*([\d.]+)\)/);
    return m ? parseFloat(m[1]) : 1;
  }
  return c.toRgb().a ?? 1;
}

function chipRgba(alpha: number) {
  return `rgba(${BASE.r}, ${BASE.g}, ${BASE.b}, ${alpha})`;
}

export default function T06({ onSuccess }: TaskComponentProps) {
  const [color, setColor] = useState<Color | string>(chipRgba(1));
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    const a = alphaFromColor(color);
    const t = rgbaTuple(color);
    if (
      t.r === BASE.r &&
      t.g === BASE.g &&
      t.b === BASE.b &&
      isAlphaWithinTolerance(a, TARGET_ALPHA, 0.01)
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [color, onSuccess]);

  return (
    <div style={{ position: 'relative', minHeight: 220, padding: 8 }}>
      <Space wrap style={{ marginBottom: 8 }}>
        <Switch size="small" defaultChecked />
        <Text type="secondary">Notifications</Text>
        <Switch size="small" />
        <Text type="secondary">Beta features</Text>
      </Space>
      <div style={{ position: 'absolute', top: 8, right: 8, width: 260 }}>
        <Card size="small" title="Tooltip preview">
          <Space align="start" size="middle">
            <div>
              <Text type="secondary" style={{ fontSize: 11 }}>
                Target
              </Text>
              <div
                data-testid="tooltip-alpha-target-chip"
                style={{
                  marginTop: 4,
                  width: 48,
                  height: 48,
                  borderRadius: 8,
                  backgroundImage: `
                    linear-gradient(45deg, #ccc 25%, transparent 25%),
                    linear-gradient(-45deg, #ccc 25%, transparent 25%),
                    linear-gradient(45deg, transparent 75%, #ccc 75%),
                    linear-gradient(-45deg, transparent 75%, #ccc 75%)
                  `,
                  backgroundSize: '10px 10px',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: 8,
                    backgroundColor: chipRgba(TARGET_ALPHA),
                  }}
                />
              </div>
            </div>
            <div>
              <Text type="secondary" style={{ fontSize: 11 }}>
                Current
              </Text>
              <div
                style={{
                  marginTop: 4,
                  width: 48,
                  height: 48,
                  borderRadius: 8,
                  backgroundImage: `
                    linear-gradient(45deg, #ccc 25%, transparent 25%),
                    linear-gradient(-45deg, #ccc 25%, transparent 25%),
                    linear-gradient(45deg, transparent 75%, #ccc 75%),
                    linear-gradient(-45deg, transparent 75%, #ccc 75%)
                  `,
                  backgroundSize: '10px 10px',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: 8,
                    backgroundColor:
                      typeof color === 'string'
                        ? color
                        : chipRgba(color.toRgb().a ?? 1),
                  }}
                />
              </div>
            </div>
          </Space>
          <div style={{ marginTop: 12 }}>
            <Text>Tooltip tint</Text>
            <div style={{ marginTop: 8 }}>
              <ColorPicker value={color} onChange={setColor} size="small" showText={false} />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function rgbaTuple(c: Color | string): { r: number; g: number; b: number; a: number } {
  if (typeof c === 'string') {
    const m = c.match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)/);
    if (m) {
      return {
        r: parseFloat(m[1]),
        g: parseFloat(m[2]),
        b: parseFloat(m[3]),
        a: m[4] !== undefined ? parseFloat(m[4]) : 1,
      };
    }
  } else {
    const rgb = c.toRgb();
    return { r: rgb.r, g: rgb.g, b: rgb.b, a: rgb.a ?? 1 };
  }
  return { r: 0, g: 0, b: 0, a: 1 };
}
