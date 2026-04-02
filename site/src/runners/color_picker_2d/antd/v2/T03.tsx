'use client';

/**
 * color_picker_2d-antd-v2-T03: Modal shell — Header tint matches Target preview; Apply shell
 */

import React, { useRef, useState } from 'react';
import { Button, Card, ColorPicker, Modal, Space, Typography } from 'antd';
import type { Color } from 'antd/es/color-picker';
import type { TaskComponentProps, RGBA } from '../../types';
import { isColorWithinTolerance } from '../../types';

const { Text } = Typography;

const TARGET_HEADER: RGBA = { r: 120, g: 80, b: 200, a: 0.55 };
const INITIAL_HEADER: RGBA = { r: 90, g: 90, b: 90, a: 1 };
const INITIAL_SIDEBAR: RGBA = { r: 30, g: 30, b: 30, a: 1 };

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

export default function T03({ onSuccess }: TaskComponentProps) {
  const done = useRef(false);
  const [open, setOpen] = useState(false);
  const [committedHeader, setCommittedHeader] = useState<Color | string>(
    `rgb(${INITIAL_HEADER.r}, ${INITIAL_HEADER.g}, ${INITIAL_HEADER.b})`
  );
  const [committedSidebar, setCommittedSidebar] = useState<Color | string>(
    `rgb(${INITIAL_SIDEBAR.r}, ${INITIAL_SIDEBAR.g}, ${INITIAL_SIDEBAR.b})`
  );
  const [draftHeader, setDraftHeader] = useState(committedHeader);
  const [draftSidebar, setDraftSidebar] = useState(committedSidebar);

  const openModal = () => {
    setDraftHeader(committedHeader);
    setDraftSidebar(committedSidebar);
    setOpen(true);
  };

  const apply = () => {
    setCommittedHeader(draftHeader);
    setCommittedSidebar(draftSidebar);
    setOpen(false);
    if (done.current) return;
    const h = antdToRgba(draftHeader);
    const s = antdToRgba(draftSidebar);
    if (
      h &&
      s &&
      isColorWithinTolerance(s, INITIAL_SIDEBAR, 2, 0.02) &&
      isColorWithinTolerance(h, TARGET_HEADER, 20, 0.05)
    ) {
      done.current = true;
      onSuccess();
    }
  };

  const hdr = antdToRgba(draftHeader) || INITIAL_HEADER;

  return (
    <Card size="small" title="Appearance" style={{ width: 400 }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Text type="secondary">
          Shell header: {rgbaCss(antdToRgba(committedHeader) || INITIAL_HEADER)}
        </Text>
        <Button type="primary" onClick={openModal}>
          Customize shell
        </Button>
      </Space>

      <Modal
        title="Customize shell"
        open={open}
        onCancel={() => setOpen(false)}
        footer={[
          <Button key="c" onClick={() => setOpen(false)}>
            Cancel
          </Button>,
          <Button key="a" type="primary" onClick={apply}>
            Apply shell
          </Button>,
        ]}
      >
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text>Header tint</Text>
            <ColorPicker
              value={draftHeader}
              onChange={setDraftHeader}
              showText
              presets={[]}
              data-testid="header-tint"
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text>Sidebar tint</Text>
            <ColorPicker
              value={draftSidebar}
              onChange={setDraftSidebar}
              showText
              presets={[]}
              data-testid="sidebar-tint"
            />
          </div>
          <Space size="large">
            <div>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Current
              </Text>
              <div
                style={{
                  position: 'relative',
                  marginTop: 4,
                  width: 120,
                  height: 28,
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
                    background: rgbaCss(hdr),
                    borderRadius: 'inherit',
                  }}
                />
              </div>
            </div>
            <div>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Target
              </Text>
              <div
                id="header-target-preview"
                style={{
                  position: 'relative',
                  marginTop: 4,
                  width: 120,
                  height: 28,
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
                    background: rgbaCss(TARGET_HEADER),
                    borderRadius: 'inherit',
                  }}
                />
              </div>
            </div>
          </Space>
        </Space>
      </Modal>
    </Card>
  );
}
