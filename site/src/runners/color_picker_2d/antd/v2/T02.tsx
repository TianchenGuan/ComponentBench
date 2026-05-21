'use client';

/**
 * color_picker_2d-antd-v2-T02: Chart styling — match Series B to reference chip only
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  Card,
  ColorPicker,
  Select,
  Space,
  Statistic,
  Tag,
  Typography,
} from 'antd';
import type { Color } from 'antd/es/color-picker';
import type { TaskComponentProps, RGBA } from '../../types';
import { isColorWithinTolerance } from '../../types';

const { Text } = Typography;

const REFERENCE: RGBA = { r: 99, g: 141, b: 186, a: 0.82 };
const INITIAL_A: RGBA = { r: 60, g: 60, b: 60, a: 1 };
const INITIAL_B: RGBA = { r: 200, g: 100, b: 80, a: 1 };
const INITIAL_C: RGBA = { r: 180, g: 180, b: 180, a: 1 };

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

export default function T02({ onSuccess }: TaskComponentProps) {
  const done = useRef(false);
  const [a, setA] = useState<Color | string>(
    `rgb(${INITIAL_A.r}, ${INITIAL_A.g}, ${INITIAL_A.b})`
  );
  const [b, setB] = useState<Color | string>(
    `rgb(${INITIAL_B.r}, ${INITIAL_B.g}, ${INITIAL_B.b})`
  );
  const [c, setC] = useState<Color | string>(
    `rgb(${INITIAL_C.r}, ${INITIAL_C.g}, ${INITIAL_C.b})`
  );

  useEffect(() => {
    if (done.current) return;
    const ra = antdToRgba(a);
    const rb = antdToRgba(b);
    const rc = antdToRgba(c);
    if (!ra || !rb || !rc) return;
    if (
      isColorWithinTolerance(ra, INITIAL_A, 2, 0.02) &&
      isColorWithinTolerance(rc, INITIAL_C, 2, 0.02) &&
      isColorWithinTolerance(rb, REFERENCE, 20, 0.05)
    ) {
      done.current = true;
      onSuccess();
    }
  }, [a, b, c, onSuccess]);

  return (
    <div style={{ width: 520, position: 'relative', left: 24 }}>
      <Space wrap style={{ marginBottom: 10 }}>
        <Tag>Live</Tag>
        <Statistic title="QPS" value={1284} valueStyle={{ fontSize: 14 }} />
        <Statistic title="Errors" value={3} valueStyle={{ fontSize: 14 }} />
        <Select
          size="small"
          style={{ width: 120 }}
          defaultValue="1h"
          options={[
            { value: '1h', label: 'Last hour' },
            { value: '24h', label: '24h' },
          ]}
        />
        <Select
          size="small"
          style={{ width: 130 }}
          defaultValue="line"
          options={[
            { value: 'line', label: 'Line' },
            { value: 'bar', label: 'Bar' },
          ]}
        />
      </Space>

      <Card size="small" title="Chart styling">
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          {[
            { label: 'Series A', color: a, setColor: setA, refBg: null as RGBA | null },
            {
              label: 'Series B',
              color: b,
              setColor: setB,
              refBg: REFERENCE,
            },
            { label: 'Series C', color: c, setColor: setC, refBg: null },
          ].map((row) => (
            <div
              key={row.label}
              style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}
            >
              <Text style={{ width: 72 }}>{row.label}</Text>
              <ColorPicker
                value={row.color}
                onChange={row.setColor}
                size="small"
                showText
                presets={[]}
                data-testid={`picker-${row.label.replace(/\s/g, '-').toLowerCase()}`}
              />
              <span
                style={{
                  position: 'relative',
                  display: 'inline-block',
                  width: 28,
                  height: 20,
                  borderRadius: 4,
                  border: '1px solid #d9d9d9',
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
                    background: rgbaCss(antdToRgba(row.color) || INITIAL_A),
                    borderRadius: 'inherit',
                  }}
                />
              </span>
              {row.refBg && (
                <span
                  id="series-b-reference-chip"
                  title="Reference"
                  style={{
                    position: 'relative',
                    display: 'inline-block',
                    width: 28,
                    height: 20,
                    borderRadius: 4,
                    border: '1px solid #d9d9d9',
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
                      background: rgbaCss(row.refBg),
                      borderRadius: 'inherit',
                    }}
                  />
                </span>
              )}
            </div>
          ))}
        </Space>
      </Card>
    </div>
  );
}
