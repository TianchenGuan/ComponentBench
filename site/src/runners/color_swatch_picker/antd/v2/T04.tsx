'use client';

/**
 * color_swatch_picker-antd-v2-T04: Worker row Badge #eb2f96, save-worker-row
 */

import React, { useState, useEffect, useRef } from 'react';
import { Table, ColorPicker, Typography, Button, Divider } from 'antd';
import type { Color } from 'antd/es/color-picker';
import type { TaskComponentProps } from '../../types';
import { normalizeHex, hexMatches, BRAND_SWATCHES, NEUTRAL_SWATCHES } from '../../types';

const { Text } = Typography;

const TARGET = '#eb2f96';

const presets = [
  { label: 'Brand', colors: BRAND_SWATCHES.map((s) => s.color), defaultOpen: true },
  { label: 'Neutrals', colors: NEUTRAL_SWATCHES.map((s) => s.color), defaultOpen: true },
];

function toHex(c: Color | string): string {
  return typeof c === 'object' && c && 'toHexString' in c ? c.toHexString() : String(c);
}

type RowState = { text: Color | string; badge: Color | string };

const INITIAL_GATEWAY: RowState = { text: '#434343', badge: '#1677ff' };
const INITIAL_WORKER: RowState = { text: '#000000', badge: '#d9d9d9' };

export default function T04({ task: _task, onSuccess }: TaskComponentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef(false);

  const [dGw, setDGw] = useState<RowState>({ ...INITIAL_GATEWAY });
  const [dWr, setDWr] = useState<RowState>({ ...INITIAL_WORKER });
  const [cGw, setCGw] = useState<RowState>({ ...INITIAL_GATEWAY });
  const [cWr, setCWr] = useState<RowState>({ ...INITIAL_WORKER });

  useEffect(() => {
    if (doneRef.current) return;
    if (
      hexMatches(toHex(cWr.badge), TARGET) &&
      toHex(cGw.text) === toHex(INITIAL_GATEWAY.text) &&
      toHex(cGw.badge) === toHex(INITIAL_GATEWAY.badge) &&
      toHex(cWr.text) === toHex(INITIAL_WORKER.text)
    ) {
      doneRef.current = true;
      onSuccess();
    }
  }, [cGw, cWr, onSuccess]);

  const renderPresetsOnly = (
    _panel: React.ReactNode,
    { components: { Presets } }: { components: { Presets: React.ComponentType } },
  ) => (
    <div>
      <Divider style={{ margin: '8px 0' }}>Preset Colors</Divider>
      <Presets />
    </div>
  );

  const rowPickers = (st: RowState, set: React.Dispatch<React.SetStateAction<RowState>>) => (
    <div>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap', marginBottom: 8 }}>
        <Text style={{ minWidth: 72 }}>Text color</Text>
        <ColorPicker
          value={st.text}
          onChange={(v) => set((s) => ({ ...s, text: v }))}
          presets={presets}
          panelRender={renderPresetsOnly}
          getPopupContainer={() => containerRef.current || document.body}
        />
      </div>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        <Text style={{ minWidth: 72 }}>Badge color</Text>
        <ColorPicker
          value={st.badge}
          onChange={(v) => set((s) => ({ ...s, badge: v }))}
          presets={presets}
          panelRender={renderPresetsOnly}
          getPopupContainer={() => containerRef.current || document.body}
        />
      </div>
    </div>
  );

  const dataSource = [
    {
      key: 'gateway',
      name: 'Gateway',
      editors: rowPickers(dGw, setDGw),
      actions: (
        <Button
          size="small"
          onClick={() => {
            setCGw({ ...dGw });
          }}
        >
          Save
        </Button>
      ),
    },
    {
      key: 'worker',
      name: 'Worker',
      editors: rowPickers(dWr, setDWr),
      actions: (
        <Button
          size="small"
          type="primary"
          data-testid="save-worker-row"
          onClick={() => {
            setCWr({ ...dWr });
          }}
        >
          Save
        </Button>
      ),
    },
  ];

  return (
    <div ref={containerRef} style={{ padding: 8, maxWidth: 720 }}>
      <Table
        size="small"
        pagination={false}
        dataSource={dataSource}
        columns={[
          { title: 'Service', dataIndex: 'name', width: 100 },
          { title: 'Colors', dataIndex: 'editors' },
          { title: '', dataIndex: 'actions', width: 100 },
        ]}
      />
      <div data-testid="worker-badge-committed" style={{ display: 'none' }}>
        {normalizeHex(toHex(cWr.badge))}
      </div>
    </div>
  );
}
