'use client';

/**
 * color_swatch_picker-antd-v2-T08: Series C matches series-c-reference-chip, Apply palette
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, ColorPicker, Typography, Button, Divider, Space } from 'antd';
import type { Color } from 'antd/es/color-picker';
import type { TaskComponentProps } from '../../types';
import { normalizeHex, hexMatches, BLUES_SWATCHES, BRAND_SWATCHES } from '../../types';

const { Text } = Typography;

const SERIES_C_REF = '#0891b2';

function toHex(c: Color | string): string {
  return typeof c === 'object' && c && 'toHexString' in c ? c.toHexString() : String(c);
}

const blues = BLUES_SWATCHES.map((s) => s.color);
const INIT_SERIES = {
  a: '#1677ff' as Color | string,
  b: '#52c41a' as Color | string,
  c: '#fa8c16' as Color | string,
  d: '#722ed1' as Color | string,
};

const seriesPresets = [
  { label: 'Blues & cyans', colors: [...blues, '#13c2c2', '#22b8cf', SERIES_C_REF, '#06b6d4', '#0ea5e9'], defaultOpen: true },
  { label: 'Brand', colors: BRAND_SWATCHES.map((s) => s.color), defaultOpen: true },
];

export default function T08({ task: _task, onSuccess }: TaskComponentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef(false);

  const [draft, setDraft] = useState({ ...INIT_SERIES });
  const [committed, setCommitted] = useState({ ...INIT_SERIES });

  useEffect(() => {
    if (doneRef.current) return;
    if (
      hexMatches(toHex(committed.c), SERIES_C_REF) &&
      hexMatches(toHex(committed.a), toHex(INIT_SERIES.a)) &&
      hexMatches(toHex(committed.b), toHex(INIT_SERIES.b)) &&
      hexMatches(toHex(committed.d), toHex(INIT_SERIES.d))
    ) {
      doneRef.current = true;
      onSuccess();
    }
  }, [committed, onSuccess]);

  const renderPresetsOnly = (
    _panel: React.ReactNode,
    { components: { Presets } }: { components: { Presets: React.ComponentType } },
  ) => (
    <div>
      <Divider style={{ margin: '8px 0' }}>Preset Colors</Divider>
      <Presets />
    </div>
  );

  const row = (label: string, key: keyof typeof draft) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
      <Text strong style={{ minWidth: 72 }}>
        {label}
      </Text>
      {key === 'c' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div
            data-testid="series-c-reference-chip"
            data-color={SERIES_C_REF}
            style={{
              width: 20,
              height: 20,
              borderRadius: 4,
              background: SERIES_C_REF,
              border: '1px solid #d9d9d9',
            }}
          />
          <Text type="secondary" style={{ fontSize: 11 }}>
            ref
          </Text>
        </div>
      )}
      <ColorPicker
        value={draft[key]}
        onChange={(v) => setDraft((d) => ({ ...d, [key]: v }))}
        showText
        presets={seriesPresets}
        panelRender={renderPresetsOnly}
        getPopupContainer={() => containerRef.current || document.body}
      />
    </div>
  );

  return (
    <div ref={containerRef}>
      <Card title="Series palette" style={{ maxWidth: 520 }}>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <div>{row('Series A', 'a')}</div>
          <div>{row('Series B', 'b')}</div>
          <div data-testid="series-c-row">{row('Series C', 'c')}</div>
          <div>{row('Series D', 'd')}</div>
        </Space>
        <div style={{ marginTop: 16, textAlign: 'right' }}>
          <Button type="primary" onClick={() => setCommitted({ ...draft })}>
            Apply palette
          </Button>
        </div>
        <div data-testid="series-c-committed" style={{ display: 'none' }}>
          {normalizeHex(toHex(committed.c))}
        </div>
      </Card>
    </div>
  );
}
