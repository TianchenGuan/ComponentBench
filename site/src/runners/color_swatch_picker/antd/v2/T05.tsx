'use client';

/**
 * color_swatch_picker-antd-v2-T05: Map marker — scrollable presets, Teal Deep #0f766e, Save marker styling
 */

import React, { useState, useEffect, useRef } from 'react';
import { Button, Drawer, ColorPicker, Typography, Divider } from 'antd';
import type { Color } from 'antd/es/color-picker';
import type { TaskComponentProps } from '../../types';
import { normalizeHex, hexMatches, BRAND_SWATCHES, NEUTRAL_SWATCHES, TEAL_RAMP_SWATCHES, EXTENDED_MANTINE_SWATCHES } from '../../types';

const { Text } = Typography;

const TARGET = '#0f766e';

function toHex(c: Color | string): string {
  return typeof c === 'object' && c && 'toHexString' in c ? c.toHexString() : String(c);
}

const scrollPresets = [
  { label: 'Brand', colors: BRAND_SWATCHES.map((s) => s.color), defaultOpen: true },
  { label: 'Neutrals', colors: NEUTRAL_SWATCHES.map((s) => s.color), defaultOpen: true },
  { label: 'Extended', colors: EXTENDED_MANTINE_SWATCHES.slice(0, 40), defaultOpen: true },
  { label: 'Teal ramp', colors: TEAL_RAMP_SWATCHES, defaultOpen: true },
];

export default function T05({ task: _task, onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef(false);

  const initial: Color | string = '#1677ff';
  const [draft, setDraft] = useState<Color | string>(initial);
  const [committed, setCommitted] = useState<Color | string>(initial);

  useEffect(() => {
    if (doneRef.current) return;
    if (hexMatches(toHex(committed), TARGET)) {
      doneRef.current = true;
      onSuccess();
    }
  }, [committed, onSuccess]);

  const renderScrollPresets = (
    _panel: React.ReactNode,
    { components: { Presets } }: { components: { Presets: React.ComponentType } },
  ) => (
    <div>
      <Divider style={{ margin: '8px 0' }}>Preset Colors</Divider>
      <div style={{ maxHeight: 220, overflowY: 'auto' }}>
        <Presets />
      </div>
    </div>
  );

  return (
    <div ref={containerRef} style={{ padding: 8 }}>
      <Button type="primary" onClick={() => setOpen(true)}>
        Map marker styling
      </Button>
      <Drawer
        title="Map marker styling"
        placement="right"
        width={360}
        open={open}
        onClose={() => setOpen(false)}
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="primary" onClick={() => setCommitted(draft)}>
              Save marker styling
            </Button>
          </div>
        }
      >
        <Text type="secondary" style={{ display: 'block', marginBottom: 12, fontSize: 12 }}>
          Marker color uses a long preset list — scroll inside the popover to reach Teal ramp.
        </Text>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text>Marker color</Text>
          <ColorPicker
            value={draft}
            onChange={setDraft}
            showText
            presets={scrollPresets}
            panelRender={renderScrollPresets}
            getPopupContainer={() => containerRef.current || document.body}
          />
        </div>
        <div data-testid="marker-color-committed" style={{ display: 'none' }}>
          {normalizeHex(toHex(committed))}
        </div>
      </Drawer>
    </div>
  );
}
