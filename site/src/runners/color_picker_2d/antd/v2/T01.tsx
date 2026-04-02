'use client';

/**
 * color_picker_2d-antd-v2-T01: Drawer palette — set Series B to steel blue overlay, Save palette
 */

import React, { useRef, useState } from 'react';
import { Button, Card, ColorPicker, Drawer, Space, Typography } from 'antd';
import type { Color } from 'antd/es/color-picker';
import type { TaskComponentProps, RGBA } from '../../types';
import { isColorWithinTolerance } from '../../types';

const { Text } = Typography;

const COMMITTED_A: RGBA = { r: 22, g: 119, b: 255, a: 1 };
const INITIAL_B: RGBA = { r: 140, g: 140, b: 140, a: 1 };
const TARGET_B: RGBA = { r: 47, g: 119, b: 150, a: 0.7 };

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

function rgbaString(r: RGBA) {
  return `rgba(${r.r}, ${r.g}, ${r.b}, ${r.a})`;
}

export default function T01({ onSuccess }: TaskComponentProps) {
  const done = useRef(false);
  const [open, setOpen] = useState(false);
  const [committedA, setCommittedA] = useState<Color | string>('rgb(22, 119, 255)');
  const [committedB, setCommittedB] = useState<Color | string>('rgb(140, 140, 140)');
  const [draftA, setDraftA] = useState<Color | string>('rgb(22, 119, 255)');
  const [draftB, setDraftB] = useState<Color | string>('rgb(140, 140, 140)');

  const openDrawer = () => {
    setDraftA(committedA);
    setDraftB(committedB);
    setOpen(true);
  };

  const save = () => {
    setCommittedA(draftA);
    setCommittedB(draftB);
    setOpen(false);
    if (done.current) return;
    const a = antdToRgba(draftA);
    const b = antdToRgba(draftB);
    if (
      a &&
      b &&
      isColorWithinTolerance(a, COMMITTED_A, 2, 0.02) &&
      isColorWithinTolerance(b, TARGET_B, 2, 0.02)
    ) {
      done.current = true;
      onSuccess();
    }
  };

  return (
    <Card size="small" title="Analytics" style={{ width: 420 }}>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <div
          style={{
            height: 72,
            borderRadius: 8,
            background: '#1f1f1f',
            border: '1px solid #333',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
          }}
        >
          <span
            style={{
              width: 14,
              height: 48,
              borderRadius: 4,
              background: rgbaString(antdToRgba(committedA) || COMMITTED_A),
            }}
          />
          <span
            style={{
              width: 14,
              height: 48,
              borderRadius: 4,
              background: rgbaString(antdToRgba(committedB) || INITIAL_B),
            }}
          />
        </div>
        <Button type="primary" onClick={openDrawer}>
          Edit chart palette
        </Button>
      </Space>

      <Drawer
        title="Edit chart palette"
        placement="right"
        width={380}
        open={open}
        onClose={() => setOpen(false)}
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="primary" onClick={save}>
              Save palette
            </Button>
          </div>
        }
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text>Series A</Text>
              <ColorPicker
                value={draftA}
                onChange={setDraftA}
                showText
                disabledAlpha
                data-testid="series-a"
              />
            </div>
            <Text type="secondary" style={{ fontSize: 12, marginTop: 4, display: 'block' }}>
              Draft: {rgbaString(antdToRgba(draftA) || COMMITTED_A)}
            </Text>
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text>Series B</Text>
              <ColorPicker
                value={draftB}
                onChange={setDraftB}
                showText
                data-testid="series-b"
              />
            </div>
            <Text type="secondary" style={{ fontSize: 12, marginTop: 4, display: 'block' }}>
              Draft: {rgbaString(antdToRgba(draftB) || INITIAL_B)}
            </Text>
          </div>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Chart updates after Save palette.
          </Text>
        </Space>
      </Drawer>
    </Card>
  );
}
