'use client';

/**
 * color_swatch_picker-antd-v2-T01: Banner drawer — Background only (#1d39c4), Save banner
 */

import React, { useState, useEffect, useRef } from 'react';
import { Button, Drawer, ColorPicker, Typography, Input, Switch, Divider } from 'antd';
import type { Color } from 'antd/es/color-picker';
import type { TaskComponentProps } from '../../types';
import { normalizeHex, hexMatches, BLUES_SWATCHES, BRAND_SWATCHES, NEUTRAL_SWATCHES } from '../../types';

const { Text } = Typography;

const TARGET_BG = '#1d39c4';

function toHex(c: Color | string): string {
  return typeof c === 'object' && c && 'toHexString' in c ? c.toHexString() : String(c);
}

const headlinePresets = [
  { label: 'Brand', colors: BRAND_SWATCHES.map((s) => s.color), defaultOpen: true },
  { label: 'Neutrals', colors: NEUTRAL_SWATCHES.map((s) => s.color), defaultOpen: true },
];

const bgPresets = [
  { label: 'Blues', colors: BLUES_SWATCHES.map((s) => s.color), defaultOpen: true },
  { label: 'Brand', colors: BRAND_SWATCHES.map((s) => s.color), defaultOpen: true },
];

export default function T01({ task: _task, onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef(false);

  const initialHeadline: Color | string = '#722ed1';
  const initialText: Color | string = '#434343';
  const initialBg: Color | string = '#ffffff';

  const [draftHeadline, setDraftHeadline] = useState<Color | string>(initialHeadline);
  const [draftText, setDraftText] = useState<Color | string>(initialText);
  const [draftBg, setDraftBg] = useState<Color | string>(initialBg);
  const [committedHeadline, setCommittedHeadline] = useState<Color | string>(initialHeadline);
  const [committedText, setCommittedText] = useState<Color | string>(initialText);
  const [committedBg, setCommittedBg] = useState<Color | string>(initialBg);

  useEffect(() => {
    if (doneRef.current) return;
    if (
      hexMatches(toHex(committedBg), TARGET_BG) &&
      hexMatches(toHex(committedHeadline), toHex(initialHeadline)) &&
      hexMatches(toHex(committedText), toHex(initialText))
    ) {
      doneRef.current = true;
      onSuccess();
    }
  }, [committedBg, committedHeadline, committedText, initialHeadline, initialText, onSuccess]);

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
        Edit banner
      </Button>
      <Drawer
        title="Edit banner"
        placement="right"
        width={400}
        open={open}
        onClose={() => setOpen(false)}
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button
              type="primary"
              onClick={() => {
                setCommittedHeadline(draftHeadline);
                setCommittedText(draftText);
                setCommittedBg(draftBg);
              }}
            >
              Save banner
            </Button>
          </div>
        }
      >
        <div style={{ marginBottom: 16 }}>
          <Text style={{ display: 'block', marginBottom: 4 }}>Banner title</Text>
          <Input defaultValue="Spring sale" placeholder="Headline" />
        </div>
        <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Text>Visible on homepage</Text>
          <Switch defaultChecked />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Text>Headline</Text>
          <ColorPicker
            value={draftHeadline}
            onChange={setDraftHeadline}
            showText
            presets={headlinePresets}
            panelRender={renderPresetsOnly}
            getPopupContainer={() => containerRef.current || document.body}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Text>Text</Text>
          <ColorPicker
            value={draftText}
            onChange={setDraftText}
            showText
            presets={headlinePresets}
            panelRender={renderPresetsOnly}
            getPopupContainer={() => containerRef.current || document.body}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text>Background</Text>
          <div data-testid="banner-background">
            <ColorPicker
              value={draftBg}
              onChange={setDraftBg}
              showText
              presets={bgPresets}
              panelRender={renderPresetsOnly}
              getPopupContainer={() => containerRef.current || document.body}
            />
          </div>
        </div>
        <div data-testid="banner-background-committed" style={{ display: 'none' }}>
          {normalizeHex(toHex(committedBg))}
        </div>
      </Drawer>
    </div>
  );
}
