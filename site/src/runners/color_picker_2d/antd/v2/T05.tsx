'use client';

/**
 * color_picker_2d-antd-v2-T05: Scroll panel — Map tint in Overlays; Save section
 */

import React, { useRef, useState } from 'react';
import { Button, Card, ColorPicker, Space, Typography } from 'antd';
import type { Color } from 'antd/es/color-picker';
import type { TaskComponentProps, RGBA } from '../../types';
import { isColorWithinTolerance } from '../../types';

const { Text, Title } = Typography;

const TARGET_MAP: RGBA = { r: 32, g: 85, b: 138, a: 0.52 };
const INITIAL_MAP: RGBA = { r: 255, g: 255, b: 255, a: 0.2 };
const INITIAL_LEGEND: RGBA = { r: 50, g: 50, b: 50, a: 0.9 };

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

export default function T05({ onSuccess }: TaskComponentProps) {
  const done = useRef(false);
  const [mapDraft, setMapDraft] = useState<Color | string>('rgba(255, 255, 255, 0.2)');
  const [legDraft, setLegDraft] = useState<Color | string>(
    `rgba(${INITIAL_LEGEND.r}, ${INITIAL_LEGEND.g}, ${INITIAL_LEGEND.b}, ${INITIAL_LEGEND.a})`
  );
  const saveSection = () => {
    if (done.current) return;
    const m = antdToRgba(mapDraft);
    const l = antdToRgba(legDraft);
    if (
      m &&
      l &&
      isColorWithinTolerance(m, TARGET_MAP, 2, 0.02) &&
      isColorWithinTolerance(l, INITIAL_LEGEND, 2, 0.02)
    ) {
      done.current = true;
      onSuccess();
    }
  };

  return (
    <div style={{ display: 'flex', gap: 16, justifyContent: 'flex-end', width: '100%', maxWidth: 720 }}>
      <Card size="small" style={{ flex: 1, minHeight: 120 }}>
        <Text type="secondary">Dashboard map preview</Text>
      </Card>
      <Card size="small" style={{ width: 280 }}>
        <div style={{ maxHeight: 280, overflowY: 'auto', paddingRight: 4 }}>
          <Title level={5} style={{ fontSize: 14 }}>
            Settings
          </Title>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Section {i + 1}
              </Text>
              <div style={{ height: 40, background: '#f0f0f0', borderRadius: 4, marginTop: 4 }} />
            </div>
          ))}
          <div style={{ marginTop: 8 }}>
            <Text strong>Overlays</Text>
            <Space direction="vertical" size="small" style={{ width: '100%', marginTop: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: 13 }}>Map tint</Text>
                <ColorPicker
                  value={mapDraft}
                  onChange={setMapDraft}
                  size="small"
                  showText
                  data-testid="map-tint"
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: 13 }}>Legend tint</Text>
                <ColorPicker
                  value={legDraft}
                  onChange={setLegDraft}
                  size="small"
                  showText
                  data-testid="legend-tint"
                />
              </div>
              <Button type="primary" size="small" block onClick={saveSection}>
                Save section
              </Button>
            </Space>
          </div>
        </div>
      </Card>
    </div>
  );
}
