'use client';

/**
 * color_swatch_picker-antd-v2-T02: Notifications — Warning matches Target Amber, Apply
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, ColorPicker, Typography, Button, Divider, Space } from 'antd';
import type { Color } from 'antd/es/color-picker';
import type { TaskComponentProps } from '../../types';
import { normalizeHex, hexMatches, BRAND_SWATCHES, NEUTRAL_SWATCHES } from '../../types';

const { Text, Title } = Typography;

const AMBER_REF = '#f59e0b';

const warmPresets = [
  {
    label: 'Warm tones',
    colors: ['#faad14', '#f59e0b', '#d97706', '#fa8c16', '#f5222d', '#eb2f96', '#ffc53d'],
    defaultOpen: true,
  },
  { label: 'Brand', colors: BRAND_SWATCHES.map((s) => s.color), defaultOpen: true },
  { label: 'Neutrals', colors: NEUTRAL_SWATCHES.map((s) => s.color), defaultOpen: true },
];

const infoSuccessPresets = [
  { label: 'Brand', colors: BRAND_SWATCHES.map((s) => s.color), defaultOpen: true },
  { label: 'Neutrals', colors: NEUTRAL_SWATCHES.map((s) => s.color), defaultOpen: true },
];

function toHex(c: Color | string): string {
  return typeof c === 'object' && c && 'toHexString' in c ? c.toHexString() : String(c);
}

export default function T02({ task: _task, onSuccess }: TaskComponentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef(false);

  const INIT_INFO: Color | string = '#1677ff';
  const INIT_WARN: Color | string = '#d9d9d9';
  const INIT_OK: Color | string = '#52c41a';

  const [dInfo, setDInfo] = useState<Color | string>(INIT_INFO);
  const [dWarn, setDWarn] = useState<Color | string>(INIT_WARN);
  const [dOk, setDOk] = useState<Color | string>(INIT_OK);
  const [cInfo, setCInfo] = useState<Color | string>(INIT_INFO);
  const [cWarn, setCWarn] = useState<Color | string>(INIT_WARN);
  const [cOk, setCOk] = useState<Color | string>(INIT_OK);

  useEffect(() => {
    if (doneRef.current) return;
    if (
      hexMatches(toHex(cWarn), AMBER_REF) &&
      hexMatches(toHex(cInfo), toHex(INIT_INFO)) &&
      hexMatches(toHex(cOk), toHex(INIT_OK))
    ) {
      doneRef.current = true;
      onSuccess();
    }
  }, [cInfo, cOk, cWarn, onSuccess]);

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
      <Card title="Notifications" style={{ maxWidth: 520 }} styles={{ body: { padding: 16 } }}>
        <Title level={5} style={{ marginTop: 0 }}>
          Badge colors
        </Title>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text>Info badge color</Text>
            <ColorPicker
              value={dInfo}
              onChange={setDInfo}
              showText
              presets={infoSuccessPresets}
              panelRender={renderPresetsOnly}
              getPopupContainer={() => containerRef.current || document.body}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Text>Warning badge color</Text>
              <div
                data-testid="warning-target-amber"
                data-color={AMBER_REF}
                title="Target: Amber"
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 4,
                  background: AMBER_REF,
                  border: '1px solid #d9d9d9',
                }}
              />
              <Text type="secondary" style={{ fontSize: 12 }}>
                Target: Amber
              </Text>
            </div>
            <ColorPicker
              value={dWarn}
              onChange={setDWarn}
              showText
              presets={warmPresets}
              panelRender={renderPresetsOnly}
              getPopupContainer={() => containerRef.current || document.body}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text>Success badge color</Text>
            <ColorPicker
              value={dOk}
              onChange={setDOk}
              showText
              presets={infoSuccessPresets}
              panelRender={renderPresetsOnly}
              getPopupContainer={() => containerRef.current || document.body}
            />
          </div>
        </Space>
        <div style={{ marginTop: 20, textAlign: 'right' }}>
          <Button
            type="primary"
            onClick={() => {
              setCInfo(dInfo);
              setCWarn(dWarn);
              setCOk(dOk);
            }}
          >
            Apply notifications
          </Button>
        </div>
        <div data-testid="warning-badge-committed" style={{ display: 'none' }}>
          {normalizeHex(toHex(cWarn))}
        </div>
      </Card>
    </div>
  );
}
