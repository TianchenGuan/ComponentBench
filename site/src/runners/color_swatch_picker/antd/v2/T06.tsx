'use client';

/**
 * color_swatch_picker-antd-v2-T06: Edit card chrome — Border matches sample-b, Apply chrome
 */

import React, { useState, useEffect, useRef } from 'react';
import { Button, Modal, ColorPicker, Typography, Divider, Space } from 'antd';
import type { Color } from 'antd/es/color-picker';
import type { TaskComponentProps } from '../../types';
import { normalizeHex, hexMatches, GRAYSCALE_SWATCHES } from '../../types';

const { Text } = Typography;

const SAMPLE_B = '#ced4da';

function toHex(c: Color | string): string {
  return typeof c === 'object' && c && 'toHexString' in c ? c.toHexString() : String(c);
}

const grayPresets = [{ label: 'Grayscale', colors: GRAYSCALE_SWATCHES, defaultOpen: true }];

export default function T06({ task: _task, onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef(false);

  const initialFill: Color | string = '#ffffff';
  const initialBorder: Color | string = '#8c8c8c';

  const [dFill, setDFill] = useState<Color | string>(initialFill);
  const [dBorder, setDBorder] = useState<Color | string>(initialBorder);
  const [cFill, setCFill] = useState<Color | string>(initialFill);
  const [cBorder, setCBorder] = useState<Color | string>(initialBorder);

  useEffect(() => {
    if (doneRef.current) return;
    if (
      hexMatches(toHex(cBorder), SAMPLE_B) &&
      hexMatches(toHex(cFill), toHex(initialFill))
    ) {
      doneRef.current = true;
      onSuccess();
    }
  }, [cBorder, cFill, initialFill, onSuccess]);

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
    <div ref={containerRef} style={{ padding: 8 }}>
      <Button type="primary" onClick={() => setOpen(true)}>
        Edit card chrome
      </Button>
      <Modal
        title="Edit card chrome"
        open={open}
        onCancel={() => setOpen(false)}
        footer={[
          <Button key="c" onClick={() => setOpen(false)}>
            Cancel
          </Button>,
          <Button
            key="a"
            type="primary"
            onClick={() => {
              setCFill(dFill);
              setCBorder(dBorder);
            }}
          >
            Apply chrome
          </Button>,
        ]}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div
            style={{
              padding: 16,
              borderRadius: 8,
              background: toHex(dFill),
              border: `3px solid ${toHex(dBorder)}`,
            }}
          >
            <Text>Preview card</Text>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text>Fill</Text>
            <ColorPicker
              value={dFill}
              onChange={setDFill}
              showText
              presets={grayPresets}
              panelRender={renderPresetsOnly}
              getPopupContainer={() => containerRef.current || document.body}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Text>Border</Text>
              <div
                data-testid="sample-b"
                data-color={SAMPLE_B}
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 4,
                  background: SAMPLE_B,
                  border: '1px solid #999',
                }}
              />
              <Text type="secondary" style={{ fontSize: 12 }}>
                Sample B
              </Text>
            </div>
            <ColorPicker
              value={dBorder}
              onChange={setDBorder}
              showText
              presets={grayPresets}
              panelRender={renderPresetsOnly}
              getPopupContainer={() => containerRef.current || document.body}
            />
          </div>
        </Space>
        <div data-testid="border-committed" style={{ display: 'none' }}>
          {normalizeHex(toHex(cBorder))}
        </div>
      </Modal>
    </div>
  );
}
