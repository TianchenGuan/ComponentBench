'use client';

/**
 * color_picker_2d-antd-v2-T04: Service table — Gateway Badge tint; row Save; Billing unchanged
 */

import React, { useRef, useState } from 'react';
import { Badge, Button, Card, ColorPicker, Space, Table, Typography } from 'antd';
import type { Color } from 'antd/es/color-picker';
import type { TaskComponentProps, RGBA } from '../../types';
import { isColorWithinTolerance } from '../../types';

const { Text } = Typography;

const TARGET_GW: RGBA = { r: 31, g: 111, b: 235, a: 1 };
const INITIAL_GW: RGBA = { r: 160, g: 160, b: 160, a: 1 };
const INITIAL_BILL: RGBA = { r: 200, g: 120, b: 40, a: 1 };

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

export default function T04({ onSuccess }: TaskComponentProps) {
  const done = useRef(false);
  const [gwDraft, setGwDraft] = useState<Color | string>(
    `rgb(${INITIAL_GW.r}, ${INITIAL_GW.g}, ${INITIAL_GW.b})`
  );
  const [billDraft, setBillDraft] = useState<Color | string>(
    `rgb(${INITIAL_BILL.r}, ${INITIAL_BILL.g}, ${INITIAL_BILL.b})`
  );
  const saveGateway = () => {
    if (done.current) return;
    const g = antdToRgba(gwDraft);
    const b = antdToRgba(billDraft);
    if (
      g &&
      b &&
      isColorWithinTolerance(g, TARGET_GW, 2, 0) &&
      isColorWithinTolerance(b, INITIAL_BILL, 2, 0.02)
    ) {
      done.current = true;
      onSuccess();
    }
  };

  const gwRgba = antdToRgba(gwDraft) || INITIAL_GW;
  const billRgba = antdToRgba(billDraft) || INITIAL_BILL;

  return (
    <div style={{ width: 520, position: 'relative', left: 20 }}>
      <Card
        size="small"
        title="Services"
        styles={{ body: { background: '#141414', padding: 12 } }}
      >
        <Table
          size="small"
          pagination={false}
          showHeader={false}
          dataSource={[
            {
              key: 'gw',
              name: 'Gateway',
              body: (
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <Text style={{ color: '#fff', width: 80 }}>Badge tint</Text>
                    <ColorPicker
                      value={gwDraft}
                      onChange={setGwDraft}
                      size="small"
                      showText
                      disabledAlpha
                      data-testid="gateway-badge-tint"
                    />
                    <Badge
                      color={`rgb(${gwRgba.r},${gwRgba.g},${gwRgba.b})`}
                      text={<span style={{ color: '#ccc' }}>live</span>}
                    />
                  </div>
                  <Button size="small" type="primary" onClick={saveGateway} data-testid="save-gateway-row">
                    Save
                  </Button>
                </Space>
              ),
            },
            {
              key: 'bill',
              name: 'Billing',
              body: (
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <Text style={{ color: '#fff', width: 80 }}>Badge tint</Text>
                    <ColorPicker
                      value={billDraft}
                      onChange={setBillDraft}
                      size="small"
                      showText
                      disabledAlpha
                      data-testid="billing-badge-tint"
                    />
                    <Badge
                      color={`rgb(${billRgba.r},${billRgba.g},${billRgba.b})`}
                      text={<span style={{ color: '#ccc' }}>live</span>}
                    />
                  </div>
                  <Button size="small" onClick={() => undefined} data-testid="save-billing-row">
                    Save
                  </Button>
                </Space>
              ),
            },
          ]}
          columns={[
            {
              dataIndex: 'name',
              width: 90,
              render: (v: string) => <Text strong style={{ color: '#fff' }}>{v}</Text>,
            },
            { dataIndex: 'body' },
          ]}
        />
      </Card>
    </div>
  );
}
