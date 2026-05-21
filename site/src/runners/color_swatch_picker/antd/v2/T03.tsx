'use client';

/**
 * color_swatch_picker-antd-v2-T03: Billing card accent #722ed1 among four cards, Apply palette
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, ColorPicker, Typography, Button, Divider, Badge, Space, Row, Col } from 'antd';
import type { Color } from 'antd/es/color-picker';
import type { TaskComponentProps } from '../../types';
import { normalizeHex, hexMatches, BRAND_SWATCHES, NEUTRAL_SWATCHES } from '../../types';

const { Text } = Typography;

const TARGET = '#722ed1';

const INIT = {
  gateway: '#1677ff' as Color | string,
  billing: '#faad14' as Color | string,
  search: '#13c2c2' as Color | string,
  auth: '#52c41a' as Color | string,
};

const presets = [
  { label: 'Brand', colors: BRAND_SWATCHES.map((s) => s.color), defaultOpen: true },
  { label: 'Neutrals', colors: NEUTRAL_SWATCHES.map((s) => s.color), defaultOpen: true },
];

function toHex(c: Color | string): string {
  return typeof c === 'object' && c && 'toHexString' in c ? c.toHexString() : String(c);
}

export default function T03({ task: _task, onSuccess }: TaskComponentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef(false);

  const [draft, setDraft] = useState({ ...INIT });
  const [committed, setCommitted] = useState({ ...INIT });

  useEffect(() => {
    if (doneRef.current) return;
    if (
      hexMatches(toHex(committed.billing), TARGET) &&
      hexMatches(toHex(committed.gateway), toHex(INIT.gateway)) &&
      hexMatches(toHex(committed.search), toHex(INIT.search)) &&
      hexMatches(toHex(committed.auth), toHex(INIT.auth))
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

  const miniCard = (title: string, key: keyof typeof draft) => (
    <Card size="small" title={title} style={{ marginBottom: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
        <Text type="secondary">Accent color</Text>
        <ColorPicker
          value={draft[key]}
          onChange={(v) => setDraft((d) => ({ ...d, [key]: v }))}
          showText
          presets={presets}
          panelRender={renderPresetsOnly}
          getPopupContainer={() => containerRef.current || document.body}
        />
      </div>
      <div
        style={{
          marginTop: 8,
          width: 36,
          height: 8,
          borderRadius: 2,
          background: toHex(draft[key]),
        }}
      />
    </Card>
  );

  return (
    <div ref={containerRef} style={{ padding: 8, maxWidth: 640 }}>
      <Space wrap style={{ marginBottom: 12 }}>
        <Badge count={12} />
        <Badge count={3} color="blue" />
        <Text type="secondary">KPI</Text>
      </Space>
      <Row gutter={[12, 12]}>
        <Col xs={24} sm={12}>
          {miniCard('Gateway', 'gateway')}
        </Col>
        <Col xs={24} sm={12}>
          <div data-testid="billing-card">{miniCard('Billing', 'billing')}</div>
        </Col>
        <Col xs={24} sm={12}>
          {miniCard('Search', 'search')}
        </Col>
        <Col xs={24} sm={12}>
          {miniCard('Auth', 'auth')}
        </Col>
      </Row>
      <div style={{ marginTop: 12, textAlign: 'right' }}>
        <Button type="primary" onClick={() => setCommitted({ ...draft })}>
          Apply palette
        </Button>
      </div>
      <div data-testid="billing-accent-committed" style={{ display: 'none' }}>
        {normalizeHex(toHex(committed.billing))}
      </div>
    </div>
  );
}
