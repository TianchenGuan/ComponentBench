'use client';

/**
 * color_picker_2d-antd-v2-T08: Modal — Badge fill matches Target badge; Save badge
 */

import React, { useRef, useState } from 'react';
import { Button, Card, ColorPicker, Modal, Space, Typography } from 'antd';
import type { Color } from 'antd/es/color-picker';
import type { TaskComponentProps, RGBA } from '../../types';
import { isColorWithinTolerance } from '../../types';

const { Text } = Typography;

const TARGET_BADGE: RGBA = { r: 0, g: 180, b: 170, a: 0.85 };

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

export default function T08({ onSuccess }: TaskComponentProps) {
  const done = useRef(false);
  const [open, setOpen] = useState(false);
  const [committed, setCommitted] = useState<Color | string>('rgba(200, 80, 120, 0.5)');
  const [draft, setDraft] = useState<Color | string>(committed);

  const openModal = () => {
    setDraft(committed);
    setOpen(true);
  };

  const save = () => {
    setCommitted(draft);
    setOpen(false);
    if (done.current) return;
    const v = antdToRgba(draft);
    if (v && isColorWithinTolerance(v, TARGET_BADGE, 20, 0.05)) {
      done.current = true;
      onSuccess();
    }
  };

  const live = antdToRgba(draft) || TARGET_BADGE;
  const committedRgba = antdToRgba(committed) || TARGET_BADGE;

  return (
    <Card
      size="small"
      title="Launch"
      style={{ width: 380, background: '#1f1f1f', borderColor: '#333' }}
    >
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span
            style={{
              padding: '4px 10px',
              borderRadius: 6,
              background: rgbaCss(committedRgba),
              color: '#fff',
              fontSize: 12,
            }}
          >
            Beta
          </span>
          <Text style={{ color: '#ccc' }}>Badge preview (saved)</Text>
        </div>
        <Button type="primary" onClick={openModal}>
          Edit launch badge
        </Button>
      </Space>

      <Modal
        title="Edit launch badge"
        open={open}
        onCancel={() => setOpen(false)}
        styles={{ content: { background: '#1f1f1f' } }}
        footer={[
          <Button key="c" onClick={() => setOpen(false)}>
            Cancel
          </Button>,
          <Button key="s" type="primary" onClick={save}>
            Save badge
          </Button>,
        ]}
      >
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ color: '#fff' }}>Badge fill</Text>
            <ColorPicker value={draft} onChange={setDraft} showText data-testid="badge-fill" />
          </div>
          <Space size="large">
            <div>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Live
              </Text>
              <div
                style={{
                  position: 'relative',
                  marginTop: 6,
                  padding: '6px 12px',
                  borderRadius: 6,
                  color: '#fff',
                  fontSize: 12,
                  minWidth: 56,
                  textAlign: 'center',
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
                    background: rgbaCss(live),
                    borderRadius: 'inherit',
                  }}
                />
                <span style={{ position: 'relative', zIndex: 1 }}>Beta</span>
              </div>
            </div>
            <div>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Target
              </Text>
              <div
                id="target-badge-preview"
                style={{
                  position: 'relative',
                  marginTop: 6,
                  padding: '6px 12px',
                  borderRadius: 6,
                  color: '#fff',
                  fontSize: 12,
                  minWidth: 56,
                  textAlign: 'center',
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
                    background: rgbaCss(TARGET_BADGE),
                    borderRadius: 'inherit',
                  }}
                />
                <span style={{ position: 'relative', zIndex: 1 }}>Beta</span>
              </div>
            </div>
          </Space>
        </Space>
      </Modal>
    </Card>
  );
}
