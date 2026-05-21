'use client';

/**
 * cascader-antd-v2-T06: Three routes with prefilled neighbor — set only Tertiary route
 *
 * Dashboard panel with three Cascaders: "Primary route" (prefilled EU-West / Ireland / Zone 1),
 * "Secondary route" (prefilled EU-Central / Germany / Zone 1), and "Tertiary route" (empty).
 * Set Tertiary route to EU-West / Ireland / Zone 2 and click "Apply routes".
 * Non-targets must remain unchanged.
 *
 * Success: Tertiary path equals [EU-West, Ireland, Zone 2], others unchanged,
 *          "Apply routes" clicked.
 */

import React, { useState, useRef } from 'react';
import { Card, Cascader, Button, Tag, ConfigProvider } from 'antd';
import type { TaskComponentProps } from '../../types';
import { pathEquals } from '../../types';

const options = [
  {
    value: 'eu-west',
    label: 'EU-West',
    children: [
      {
        value: 'ireland',
        label: 'Ireland',
        children: [
          { value: 'zone-1', label: 'Zone 1' },
          { value: 'zone-2', label: 'Zone 2' },
        ],
      },
    ],
  },
  {
    value: 'eu-central',
    label: 'EU-Central',
    children: [
      {
        value: 'germany',
        label: 'Germany',
        children: [
          { value: 'zone-1', label: 'Zone 1' },
          { value: 'zone-2', label: 'Zone 2' },
        ],
      },
    ],
  },
  {
    value: 'eu-north',
    label: 'EU-North',
    children: [
      {
        value: 'sweden',
        label: 'Sweden',
        children: [
          { value: 'zone-1', label: 'Zone 1' },
        ],
      },
    ],
  },
];

const PRIMARY_INITIAL = ['eu-west', 'ireland', 'zone-1'];
const SECONDARY_INITIAL = ['eu-central', 'germany', 'zone-1'];
const TARGET_PATH = ['eu-west', 'ireland', 'zone-2'];

export default function T06({ onSuccess }: TaskComponentProps) {
  const [primaryValue, setPrimaryValue] = useState<string[]>(PRIMARY_INITIAL);
  const [secondaryValue, setSecondaryValue] = useState<string[]>(SECONDARY_INITIAL);
  const [tertiaryValue, setTertiaryValue] = useState<string[]>([]);
  const successFired = useRef(false);

  const handleApply = () => {
    if (
      !successFired.current &&
      pathEquals(tertiaryValue, TARGET_PATH) &&
      pathEquals(primaryValue, PRIMARY_INITIAL) &&
      pathEquals(secondaryValue, SECONDARY_INITIAL)
    ) {
      successFired.current = true;
      onSuccess();
    }
  };

  return (
    <ConfigProvider componentSize="small">
      <div style={{ padding: 24 }}>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 16, marginLeft: 80 }}>
          <Card size="small" style={{ width: 140 }}>
            <div style={{ fontSize: 11, color: '#999' }}>Uptime</div>
            <div style={{ fontSize: 20, fontWeight: 600 }}>99.97%</div>
          </Card>
          <Card size="small" style={{ width: 140 }}>
            <div style={{ fontSize: 11, color: '#999' }}>Latency</div>
            <div style={{ fontSize: 20, fontWeight: 600 }}>42 ms</div>
          </Card>
        </div>

        <Card
          title="Route Configuration"
          extra={<Tag color="blue">Active</Tag>}
          style={{ width: 520, marginLeft: 80 }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 2, fontWeight: 500, fontSize: 13 }}>
                Primary route
              </label>
              <Cascader
                style={{ width: '100%' }}
                options={options}
                value={primaryValue}
                onChange={(val) => setPrimaryValue(val as string[])}
                placeholder="Select"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 2, fontWeight: 500, fontSize: 13 }}>
                Secondary route
              </label>
              <Cascader
                style={{ width: '100%' }}
                options={options}
                value={secondaryValue}
                onChange={(val) => setSecondaryValue(val as string[])}
                placeholder="Select"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 2, fontWeight: 500, fontSize: 13 }}>
                Tertiary route
              </label>
              <Cascader
                style={{ width: '100%' }}
                options={options}
                value={tertiaryValue}
                onChange={(val) => setTertiaryValue(val as string[])}
                placeholder="Select"
              />
            </div>
          </div>
          <Button type="primary" style={{ marginTop: 16 }} onClick={handleApply}>
            Apply routes
          </Button>
        </Card>
      </div>
    </ConfigProvider>
  );
}
