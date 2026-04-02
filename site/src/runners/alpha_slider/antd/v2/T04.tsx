'use client';

/**
 * alpha_slider-antd-v2-T04: Scroll panel: Watermark tint opacity
 *
 * Scrollable settings panel; Watermark tint alpha 0.40 ±0.015; Highlight tint unchanged; Save overlays.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Button, ColorPicker, Typography, Space, Divider, Switch, Select } from 'antd';
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

const INITIAL_HIGHLIGHT: Color | string = 'rgba(250, 173, 20, 0.35)';

export default function T04({ onSuccess }: TaskComponentProps) {
  const [draftHighlight, setDraftHighlight] = useState<Color | string>(INITIAL_HIGHLIGHT);
  const [draftWatermark, setDraftWatermark] = useState<Color | string>('rgba(114, 46, 209, 1)');
  const [committedHighlight, setCommittedHighlight] = useState<Color | string>(INITIAL_HIGHLIGHT);
  const [committedWatermark, setCommittedWatermark] = useState<Color | string>('rgba(114, 46, 209, 1)');
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    const w = alphaFromColor(committedWatermark);
    if (
      colorMatchesInitial(committedHighlight, INITIAL_HIGHLIGHT) &&
      isAlphaWithinTolerance(w, 0.4, 0.015)
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [committedHighlight, committedWatermark, onSuccess]);

  const save = () => {
    setCommittedHighlight(draftHighlight);
    setCommittedWatermark(draftWatermark);
  };

  return (
    <div
      style={{
        padding: 8,
        width: 360,
        maxHeight: 320,
        overflow: 'auto',
        border: '1px solid #d9d9d9',
        borderRadius: 8,
        background: '#fff',
      }}
    >
      <Text strong>Appearance</Text>
      <Divider style={{ margin: '12px 0' }} />
      <Space direction="vertical" style={{ width: '100%' }} size="small">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text>Show grid</Text>
          <Switch defaultChecked size="small" />
        </div>
        <div>
          <Text type="secondary">Density</Text>
          <Select
            size="small"
            defaultValue="compact"
            style={{ width: '100%', marginTop: 4 }}
            options={[
              { value: 'comfortable', label: 'Comfortable' },
              { value: 'compact', label: 'Compact' },
            ]}
          />
        </div>
      </Space>
      <div style={{ height: 280 }} />
      <Text strong id="watermark-section">
        Watermark
      </Text>
      <Divider style={{ margin: '12px 0' }} />
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        <div>
          <Text>Highlight tint</Text>
          <div style={{ marginTop: 8 }}>
            <ColorPicker value={draftHighlight} onChange={setDraftHighlight} />
          </div>
        </div>
        <div>
          <Text>Watermark tint</Text>
          <div style={{ marginTop: 8 }}>
            <ColorPicker value={draftWatermark} onChange={setDraftWatermark} />
          </div>
        </div>
        <Button type="primary" onClick={save} block>
          Save overlays
        </Button>
      </Space>
    </div>
  );
}
