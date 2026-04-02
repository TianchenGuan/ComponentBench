'use client';

/**
 * alpha_slider-antd-v2-T05: Gateway row scrim opacity with row save
 *
 * Dark table: Gateway and Billing rows; Gateway Scrim alpha 0.64 ±0.01; Billing unchanged; Save in Gateway row.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Table, ColorPicker, Typography, Button, Tag } from 'antd';
import type { Color } from 'antd/es/color-picker';
import type { TaskComponentProps } from '../../types';
import { isAlphaWithinTolerance } from '../../types';

const { Text } = Typography;

function alphaFromColor(c: Color | string): number {
  if (typeof c === 'string') {
    const m = c.match(/rgba?\([^)]+,\s*([\d.]+)\)/);
    return m ? parseFloat(m[1]) : 1;
  }
  return c.toRgb().a ?? 1;
}

function rgbaTuple(c: Color | string): { r: number; g: number; b: number; a: number } {
  if (typeof c === 'string') {
    const m = c.match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)/);
    if (m) {
      return {
        r: parseFloat(m[1]),
        g: parseFloat(m[2]),
        b: parseFloat(m[3]),
        a: m[4] !== undefined ? parseFloat(m[4]) : 1,
      };
    }
  } else {
    const rgb = c.toRgb();
    return { r: rgb.r, g: rgb.g, b: rgb.b, a: rgb.a ?? 1 };
  }
  return { r: 0, g: 0, b: 0, a: 1 };
}

function colorMatchesInitial(current: Color | string, initial: Color | string): boolean {
  const a = rgbaTuple(current);
  const b = rgbaTuple(initial);
  return (
    a.r === b.r &&
    a.g === b.g &&
    a.b === b.b &&
    Math.abs(a.a - b.a) < 0.001
  );
}

const INITIAL_GATEWAY: Color | string = 'rgba(0, 0, 0, 0.25)';
const INITIAL_BILLING: Color | string = 'rgba(0, 0, 0, 0.5)';

interface RowData {
  key: string;
  name: string;
  status: React.ReactNode;
  draft: Color | string;
  setDraft: (c: Color | string) => void;
  onSave: () => void;
}

export default function T05({ onSuccess }: TaskComponentProps) {
  const [draftG, setDraftG] = useState<Color | string>(INITIAL_GATEWAY);
  const [draftB, setDraftB] = useState<Color | string>(INITIAL_BILLING);
  const [committedG, setCommittedG] = useState<Color | string>(INITIAL_GATEWAY);
  const [committedB, setCommittedB] = useState<Color | string>(INITIAL_BILLING);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    const g = alphaFromColor(committedG);
    if (
      isAlphaWithinTolerance(g, 0.64, 0.01) &&
      colorMatchesInitial(committedB, INITIAL_BILLING)
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [committedG, committedB, onSuccess]);

  return (
    <div style={{ padding: 8, maxWidth: 560, background: '#141414', borderRadius: 8 }}>
      <Text style={{ color: 'rgba(255,255,255,0.85)' }}>Gateway routes</Text>
      <Table
        size="small"
        pagination={false}
        style={{ marginTop: 8 }}
        dataSource={[
          {
            key: 'gateway',
            name: 'Gateway',
            status: <Tag color="blue">live</Tag>,
            draft: draftG,
            setDraft: setDraftG,
            onSave: () => setCommittedG(draftG),
          },
          {
            key: 'billing',
            name: 'Billing',
            status: <Tag>idle</Tag>,
            draft: draftB,
            setDraft: setDraftB,
            onSave: () => setCommittedB(draftB),
          },
        ] as RowData[]}
        columns={[
          { title: 'Service', dataIndex: 'name', key: 'name', render: (v: string) => <span style={{ color: '#fff' }}>{v}</span> },
          { title: 'Status', dataIndex: 'status', key: 'status' },
          {
            title: 'Scrim opacity',
            key: 'scrim',
            render: (_: unknown, row: RowData) => (
              <ColorPicker value={row.draft} onChange={row.setDraft} size="small" />
            ),
          },
          {
            title: '',
            key: 'save',
            width: 120,
            render: (_: unknown, row: RowData) => (
              <Button
                size="small"
                type={row.key === 'gateway' ? 'primary' : 'default'}
                onClick={row.onSave}
                data-testid={row.key === 'gateway' ? 'save-gateway-row' : 'save-billing-row'}
              >
                Save
              </Button>
            ),
          },
        ]}
      />
    </div>
  );
}
