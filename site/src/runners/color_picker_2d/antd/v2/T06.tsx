'use client';

/**
 * color_picker_2d-antd-v2-T06: Toolbar — Selection tint (hover trigger) matches reference chip
 */

import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, ColorPicker, Space, Tag, Typography } from 'antd';
import type { Color } from 'antd/es/color-picker';
import type { TaskComponentProps, RGBA } from '../../types';
import { isColorWithinTolerance } from '../../types';

const { Text } = Typography;

const REFERENCE: RGBA = { r: 210, g: 105, b: 30, a: 0.65 };

function antdToRgba(c: Color | string): RGBA | null {
  if (typeof c === 'string') {
    const m = c.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\s*\)/);
    if (m) {
      return {
        r: parseInt(m[1], 10),
        g: parseInt(m[2], 10),
        b: parseInt(m[3], 10),
        a: m[4] !== undefined ? parseFloat(m[4]) : 1,
      };
    }
    const hex = c.replace('#', '');
    if (/^[0-9a-fA-F]{6,8}$/.test(hex)) {
      return {
        r: parseInt(hex.slice(0, 2), 16),
        g: parseInt(hex.slice(2, 4), 16),
        b: parseInt(hex.slice(4, 6), 16),
        a: hex.length === 8 ? parseInt(hex.slice(6, 8), 16) / 255 : 1,
      };
    }
    return null;
  }
  if (c && typeof c === 'object' && 'toRgb' in c) {
    const rgb = c.toRgb();
    return { r: Math.round(rgb.r), g: Math.round(rgb.g), b: Math.round(rgb.b), a: rgb.a ?? 1 };
  }
  return null;
}

function rgbaCss(r: RGBA) {
  return `rgba(${r.r}, ${r.g}, ${r.b}, ${r.a})`;
}

export default function T06({ onSuccess }: TaskComponentProps) {
  const done = useRef(false);
  const [sel, setSel] = useState<Color | string>('rgba(100, 140, 200, 0.4)');

  useEffect(() => {
    if (done.current) return;
    const v = antdToRgba(sel);
    if (v && isColorWithinTolerance(v, REFERENCE, 20, 0.05)) {
      done.current = true;
      onSuccess();
    }
  }, [sel, onSuccess]);

  return (
    <div style={{ width: '100%', maxWidth: 560, position: 'relative' }}>
      <Space wrap style={{ marginBottom: 10 }}>
        <Tag>Filters</Tag>
        <Button size="small">All</Button>
        <Button size="small">Active</Button>
        <Button size="small" type="text" icon={<span>⚙</span>} />
        <Button size="small" type="text" icon={<span>↻</span>} />
      </Space>
      <Card size="small" title="Toolbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <Text>Selection tint</Text>
          <ColorPicker
            value={sel}
            onChange={setSel}
            size="small"
            trigger="hover"
            showText
            data-testid="selection-tint"
          />
          <span
            style={{
              position: 'relative',
              display: 'inline-block',
              width: 26,
              height: 18,
              borderRadius: 4,
              border: '1px solid #ccc',
              overflow: 'hidden',
            }}
          >
            <span
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage:
                  'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
                backgroundSize: '8px 8px',
                backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0px',
                backgroundColor: 'white',
              }}
            />
            <span
              style={{
                position: 'absolute',
                inset: 0,
                background: rgbaCss(antdToRgba(sel) || REFERENCE),
                borderRadius: 'inherit',
              }}
            />
          </span>
          <span
            id="selection-reference-chip"
            style={{
              position: 'relative',
              display: 'inline-block',
              width: 26,
              height: 18,
              borderRadius: 4,
              border: '1px solid #ccc',
              overflow: 'hidden',
            }}
          >
            <span
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage:
                  'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
                backgroundSize: '8px 8px',
                backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0px',
                backgroundColor: 'white',
              }}
            />
            <span
              style={{
                position: 'absolute',
                inset: 0,
                background: rgbaCss(REFERENCE),
                borderRadius: 'inherit',
              }}
            />
          </span>
        </div>
      </Card>
    </div>
  );
}
