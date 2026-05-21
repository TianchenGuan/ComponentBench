'use client';

/**
 * color_swatch_picker-antd-v2-T07: Token panel — Secondary accent #d9d9d9, Save tokens
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, ColorPicker, Typography, Button, Divider } from 'antd';
import type { Color } from 'antd/es/color-picker';
import type { TaskComponentProps } from '../../types';
import { normalizeHex, hexMatches, NEUTRAL_SWATCHES, BRAND_SWATCHES } from '../../types';

const { Text, Title } = Typography;

const TARGET = '#d9d9d9';

function toHex(c: Color | string): string {
  return typeof c === 'object' && c && 'toHexString' in c ? c.toHexString() : String(c);
}

const presets = [
  { label: 'Neutrals', colors: NEUTRAL_SWATCHES.map((s) => s.color), defaultOpen: true },
  { label: 'Brand', colors: BRAND_SWATCHES.map((s) => s.color), defaultOpen: true },
];

export default function T07({ task: _task, onSuccess }: TaskComponentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef(false);

  const initialPrimary: Color | string = '#1677ff';
  const initialSecondary: Color | string = '#8c8c8c';

  const [dPri, setDPri] = useState<Color | string>(initialPrimary);
  const [dSec, setDSec] = useState<Color | string>(initialSecondary);
  const [cPri, setCPri] = useState<Color | string>(initialPrimary);
  const [cSec, setCSec] = useState<Color | string>(initialSecondary);

  useEffect(() => {
    if (doneRef.current) return;
    if (hexMatches(toHex(cSec), TARGET) && hexMatches(toHex(cPri), toHex(initialPrimary))) {
      doneRef.current = true;
      onSuccess();
    }
  }, [cPri, cSec, initialPrimary, onSuccess]);

  const renderPresetsOnly = (
    _panel: React.ReactNode,
    { components: { Presets } }: { components: { Presets: React.ComponentType } },
  ) => (
    <div>
      <Divider style={{ margin: '8px 0' }}>Preset Colors</Divider>
      <Presets />
    </div>
  );

  return (
    <div ref={containerRef}>
      <Card title="Design tokens" style={{ maxWidth: 420 }}>
        <Title level={5} style={{ marginTop: 0 }}>
          Token panel
        </Title>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Text>Primary accent</Text>
          <ColorPicker
            value={dPri}
            onChange={setDPri}
            showText
            presets={presets}
            panelRender={renderPresetsOnly}
            getPopupContainer={() => containerRef.current || document.body}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Text>Secondary accent</Text>
          <ColorPicker
            value={dSec}
            onChange={setDSec}
            showText
            presets={presets}
            panelRender={renderPresetsOnly}
            getPopupContainer={() => containerRef.current || document.body}
          />
        </div>
        <Button
          type="primary"
          onClick={() => {
            setCPri(dPri);
            setCSec(dSec);
          }}
        >
          Save tokens
        </Button>
        <div data-testid="secondary-accent-committed" style={{ display: 'none' }}>
          {normalizeHex(toHex(cSec))}
        </div>
      </Card>
    </div>
  );
}
