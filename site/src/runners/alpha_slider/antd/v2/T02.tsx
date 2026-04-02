'use client';

/**
 * alpha_slider-antd-v2-T02: Tooltip Style dialog: background opacity with Apply
 *
 * Modal: Tooltip background alpha 0.70 ±0.015; Backdrop tint unchanged; Apply commits page preview.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Button, Modal, ColorPicker, Typography, Space, Divider, Switch } from 'antd';
import type { Color } from 'antd/es/color-picker';
import type { TaskComponentProps } from '../../types';
import { isAlphaWithinTolerance } from '../../types';

const { Text } = Typography;

function alphaFromColor(c: Color | string): number {
  if (typeof c === 'string') {
    const m = c.match(/rgba?\([^)]+,\s*([\d.]+)\)/);
    return m ? parseFloat(m[1]) : 1;
  }
  return c.toRgb().a ?? 1;
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

function colorMatchesInitial(current: Color | string, initial: Color | string): boolean {
  const a = rgbaTuple(current);
  const b = rgbaTuple(initial);
  return (
    a.r === b.r &&
    a.g === b.g &&
    a.b === b.b &&
    Math.abs(a.a - b.a) < 0.001
  );
}

function tooltipRgbString(c: Color | string): string {
  const t = rgbaTuple(c);
  return `rgba(${t.r}, ${t.g}, ${t.b}, ${t.a})`;
}

const INITIAL_BACKDROP: Color | string = 'rgba(0, 0, 0, 0.45)';

export default function T02({ onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const [draftTooltip, setDraftTooltip] = useState<Color | string>('rgba(48, 48, 48, 1)');
  const [draftBackdrop, setDraftBackdrop] = useState<Color | string>(INITIAL_BACKDROP);
  const [committedTooltip, setCommittedTooltip] = useState<Color | string>('rgba(48, 48, 48, 1)');
  const [committedBackdrop, setCommittedBackdrop] = useState<Color | string>(INITIAL_BACKDROP);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    const a = alphaFromColor(committedTooltip);
    if (
      isAlphaWithinTolerance(a, 0.7, 0.015) &&
      colorMatchesInitial(committedBackdrop, INITIAL_BACKDROP)
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [committedTooltip, committedBackdrop, onSuccess]);

  const apply = () => {
    setCommittedTooltip(draftTooltip);
    setCommittedBackdrop(draftBackdrop);
  };

  return (
    <div style={{ padding: 8 }}>
      <Button type="primary" onClick={() => setOpen(true)}>
        Tooltip Style
      </Button>
      <div style={{ marginTop: 16 }}>
        <Text type="secondary">Page preview (tooltip background)</Text>
        <div
          style={{
            marginTop: 8,
            padding: 16,
            borderRadius: 8,
            background: '#f0f0f0',
            border: '1px solid #d9d9d9',
          }}
        >
          <div
            style={{
              display: 'inline-block',
              padding: '8px 12px',
              borderRadius: 6,
              color: '#fff',
              background: tooltipRgbString(committedTooltip),
            }}
          >
            Sample tooltip
          </div>
        </div>
      </div>
      <Modal
        title="Tooltip Style"
        open={open}
        onCancel={() => setOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setOpen(false)}>
            Cancel
          </Button>,
          <Button key="apply" type="primary" onClick={apply}>
            Apply
          </Button>,
        ]}
        width={480}
      >
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <div
            style={{
              padding: 12,
              background: '#fafafa',
              borderRadius: 8,
              border: '1px solid #eee',
            }}
          >
            <Text type="secondary">Live preview (tooltip only)</Text>
            <div style={{ marginTop: 8 }}>
              <span
                style={{
                  display: 'inline-block',
                  padding: '8px 12px',
                  borderRadius: 6,
                  color: '#fff',
                  background: tooltipRgbString(draftTooltip),
                }}
              >
                Tooltip
              </span>
            </div>
          </div>
          <div>
            <Text strong>Tooltip background</Text>
            <div style={{ marginTop: 8 }}>
              <ColorPicker value={draftTooltip} onChange={setDraftTooltip} />
            </div>
          </div>
          <div>
            <Text strong>Backdrop tint</Text>
            <div style={{ marginTop: 8 }}>
              <ColorPicker value={draftBackdrop} onChange={setDraftBackdrop} />
            </div>
          </div>
          <Divider />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Switch defaultChecked size="small" />
            <Text type="secondary">Animate tooltips</Text>
          </div>
        </Space>
      </Modal>
    </div>
  );
}
