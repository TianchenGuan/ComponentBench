'use client';

/**
 * alpha_slider-antd-v2-T03: Secondary overlay among three dashboard cards
 *
 * Primary / Secondary / Danger overlay ColorPickers; live apply. Secondary alpha 0.20 ±0.01; others unchanged.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, ColorPicker, Typography, Row, Col, Statistic, Badge } from 'antd';
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

const INITIAL_PRIMARY: Color | string = 'rgba(22, 119, 255, 1)';
const INITIAL_SECONDARY: Color | string = 'rgba(82, 196, 26, 1)';
const INITIAL_DANGER: Color | string = 'rgba(255, 77, 79, 1)';

function chipPreview(label: string, color: Color | string) {
  return (
    <div>
      <Text type="secondary">{label}</Text>
      <div
        style={{
          marginTop: 6,
          height: 56,
          borderRadius: 8,
          backgroundImage: `
            linear-gradient(45deg, #ccc 25%, transparent 25%),
            linear-gradient(-45deg, #ccc 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #ccc 75%),
            linear-gradient(-45deg, transparent 75%, #ccc 75%)
          `,
          backgroundSize: '12px 12px',
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
                : `rgba(${color.toRgb().r},${color.toRgb().g},${color.toRgb().b},${color.toRgb().a ?? 1})`,
          }}
        />
      </div>
    </div>
  );
}

export default function T03({ onSuccess }: TaskComponentProps) {
  const [primary, setPrimary] = useState<Color | string>(INITIAL_PRIMARY);
  const [secondary, setSecondary] = useState<Color | string>(INITIAL_SECONDARY);
  const [danger, setDanger] = useState<Color | string>(INITIAL_DANGER);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    const secA = alphaFromColor(secondary);
    if (
      isAlphaWithinTolerance(secA, 0.2, 0.01) &&
      colorMatchesInitial(primary, INITIAL_PRIMARY) &&
      colorMatchesInitial(danger, INITIAL_DANGER)
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [primary, secondary, danger, onSuccess]);

  return (
    <div style={{ padding: 8, maxWidth: 720 }}>
      <Row gutter={[8, 8]} style={{ marginBottom: 12 }}>
        <Col span={8}>
          <Statistic title="Active" value={128} prefix={<Badge status="processing" />} />
        </Col>
        <Col span={8}>
          <Statistic title="Queue" value={14} />
        </Col>
        <Col span={8}>
          <Statistic title="Errors" value={2} valueStyle={{ color: '#cf1322' }} />
        </Col>
      </Row>
      <Row gutter={[12, 12]}>
        <Col xs={24} md={8}>
          <Card size="small" title="Primary overlay">
            {chipPreview('Preview chip', primary)}
            <div style={{ marginTop: 12 }}>
              <ColorPicker value={primary} onChange={setPrimary} />
            </div>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card size="small" title="Secondary overlay">
            {chipPreview('Preview chip', secondary)}
            <div style={{ marginTop: 12 }}>
              <ColorPicker value={secondary} onChange={setSecondary} />
            </div>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card size="small" title="Danger overlay">
            {chipPreview('Preview chip', danger)}
            <div style={{ marginTop: 12 }}>
              <ColorPicker value={danger} onChange={setDanger} />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
