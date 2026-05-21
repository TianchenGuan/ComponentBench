'use client';

/**
 * alpha_slider-antd-v2-T01: Theme Tokens drawer: Header overlay only
 *
 * Drawer with Header overlay + Sidebar overlay ColorPickers; Save commits. Header alpha 0.88 ±0.01; Sidebar unchanged.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Button, Drawer, ColorPicker, Typography, InputNumber, Space, Divider, Row, Col } from 'antd';
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

export default function T01({ onSuccess }: TaskComponentProps) {
  const initialSidebar: Color | string = 'rgba(22, 119, 255, 1)';
  const [open, setOpen] = useState(false);
  const [draftHeader, setDraftHeader] = useState<Color | string>('rgba(22, 119, 255, 1)');
  const [draftSidebar, setDraftSidebar] = useState<Color | string>(initialSidebar);
  const [committedHeader, setCommittedHeader] = useState<Color | string>('rgba(22, 119, 255, 1)');
  const [committedSidebar, setCommittedSidebar] = useState<Color | string>(initialSidebar);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    const h = alphaFromColor(committedHeader);
    if (
      colorMatchesInitial(committedSidebar, initialSidebar) &&
      isAlphaWithinTolerance(h, 0.88, 0.01)
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [committedHeader, committedSidebar, initialSidebar, onSuccess]);

  const save = () => {
    setCommittedHeader(draftHeader);
    setCommittedSidebar(draftSidebar);
  };

  return (
    <div style={{ padding: 8 }}>
      <Button type="primary" onClick={() => setOpen(true)}>
        Theme Tokens
      </Button>
      <Drawer
        title="Theme Tokens"
        placement="right"
        width={420}
        open={open}
        onClose={() => setOpen(false)}
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="primary" onClick={save}>
              Save
            </Button>
          </div>
        }
      >
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Row gutter={8} align="middle">
            <Col span={12}>
              <Text type="secondary">Base spacing</Text>
            </Col>
            <Col span={12}>
              <InputNumber size="small" min={4} max={24} defaultValue={8} style={{ width: '100%' }} />
            </Col>
          </Row>
          <Row gutter={8} align="middle">
            <Col span={12}>
              <Text type="secondary">Corner radius</Text>
            </Col>
            <Col span={12}>
              <InputNumber size="small" min={0} max={24} defaultValue={6} style={{ width: '100%' }} />
            </Col>
          </Row>
          <Divider />
          <div>
            <Text strong>Header overlay</Text>
            <div style={{ marginTop: 8 }}>
              <ColorPicker value={draftHeader} onChange={setDraftHeader} />
            </div>
          </div>
          <div>
            <Text strong>Sidebar overlay</Text>
            <div style={{ marginTop: 8 }}>
              <ColorPicker value={draftSidebar} onChange={setDraftSidebar} />
            </div>
          </div>
        </Space>
      </Drawer>
    </div>
  );
}
