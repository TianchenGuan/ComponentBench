'use client';

/**
 * color_picker_2d-antd-v2-T07: Status tints — Warning only; Apply colors
 */

import React, { useRef, useState } from 'react';
import { Button, Card, ColorPicker, InputNumber, Space, Switch, Typography } from 'antd';
import type { Color } from 'antd/es/color-picker';
import type { TaskComponentProps, RGBA } from '../../types';
import { isColorWithinTolerance } from '../../types';

const { Text } = Typography;

const INITIAL_SUCCESS: RGBA = { r: 82, g: 196, b: 26, a: 1 };
const INITIAL_WARNING: RGBA = { r: 136, g: 136, b: 136, a: 1 };
const INITIAL_INFO: RGBA = { r: 19, g: 194, b: 194, a: 1 };
const INITIAL_DANGER: RGBA = { r: 245, g: 34, b: 45, a: 1 };
const TARGET_WARNING: RGBA = { r: 250, g: 173, b: 20, a: 0.65 };

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

export default function T07({ onSuccess }: TaskComponentProps) {
  const done = useRef(false);
  const [success, setSuccess] = useState<Color | string>('rgb(82, 196, 26)');
  const [warning, setWarning] = useState<Color | string>('rgb(136, 136, 136)');
  const [info, setInfo] = useState<Color | string>('rgb(19, 194, 194)');
  const [danger, setDanger] = useState<Color | string>('rgb(245, 34, 45)');

  const apply = () => {
    if (done.current) return;
    const rs = antdToRgba(success);
    const rw = antdToRgba(warning);
    const ri = antdToRgba(info);
    const rd = antdToRgba(danger);
    if (
      rs &&
      rw &&
      ri &&
      rd &&
      isColorWithinTolerance(rs, INITIAL_SUCCESS, 2, 0.02) &&
      isColorWithinTolerance(ri, INITIAL_INFO, 2, 0.02) &&
      isColorWithinTolerance(rd, INITIAL_DANGER, 2, 0.02) &&
      isColorWithinTolerance(rw, TARGET_WARNING, 2, 0.02)
    ) {
      done.current = true;
      onSuccess();
    }
  };

  return (
    <div style={{ width: 400, position: 'relative', left: 32 }}>
      <Card size="small" title="Status tints">
        <Space direction="vertical" size="small" style={{ width: '100%', marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Dense mode
            </Text>
            <Switch size="small" defaultChecked />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Token scale
            </Text>
            <InputNumber size="small" min={1} max={16} defaultValue={8} style={{ width: 72 }} />
          </div>
        </Space>
        {(
          [
            ['Success tint', success, setSuccess] as const,
            ['Warning tint', warning, setWarning] as const,
            ['Info tint', info, setInfo] as const,
            ['Danger tint', danger, setDanger] as const,
          ] as const
        ).map(([label, val, setVal]) => (
          <div
            key={label}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 10,
            }}
          >
            <Text style={{ fontSize: 13 }}>{label}</Text>
            <ColorPicker
              value={val}
              onChange={setVal}
              size="small"
              showText
              data-testid={label.toLowerCase().replace(/\s+/g, '-')}
            />
          </div>
        ))}
        <Button type="primary" block style={{ marginTop: 8 }} onClick={apply}>
          Apply colors
        </Button>
        <Text type="secondary" style={{ fontSize: 11, display: 'block', marginTop: 8 }}>
          Applied: Success / Warning / Info / Danger committed.
        </Text>
      </Card>
    </div>
  );
}
