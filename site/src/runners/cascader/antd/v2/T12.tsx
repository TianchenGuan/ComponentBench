'use client';

/**
 * cascader-antd-v2-T12: Search duplicate city names and save exact San Jose branch
 *
 * Dark-themed inline surface. Cascader "City selector" with showSearch enabled.
 * Typing "San Jose" reveals several matched paths: United States / California / San Jose,
 * Costa Rica / San José / Escazú, Philippines / Nueva Ecija / San Jose. Select the
 * US / California one, then click "Apply city".
 *
 * Success: path equals [United States, California, San Jose], "Apply city" clicked.
 */

import React, { useState, useRef } from 'react';
import { Card, Cascader, Button, ConfigProvider, theme } from 'antd';
import type { TaskComponentProps } from '../../types';
import { pathEquals } from '../../types';

const options = [
  {
    value: 'united-states',
    label: 'United States',
    children: [
      {
        value: 'california',
        label: 'California',
        children: [
          { value: 'san-jose-us', label: 'San Jose' },
          { value: 'los-angeles', label: 'Los Angeles' },
          { value: 'san-francisco', label: 'San Francisco' },
        ],
      },
      {
        value: 'texas',
        label: 'Texas',
        children: [
          { value: 'houston', label: 'Houston' },
          { value: 'dallas', label: 'Dallas' },
        ],
      },
    ],
  },
  {
    value: 'costa-rica',
    label: 'Costa Rica',
    children: [
      {
        value: 'san-jose-cr',
        label: 'San José',
        children: [
          { value: 'escazu', label: 'Escazú' },
          { value: 'heredia', label: 'Heredia' },
        ],
      },
    ],
  },
  {
    value: 'philippines',
    label: 'Philippines',
    children: [
      {
        value: 'nueva-ecija',
        label: 'Nueva Ecija',
        children: [
          { value: 'san-jose-ph', label: 'San Jose' },
          { value: 'cabanatuan', label: 'Cabanatuan' },
        ],
      },
    ],
  },
  {
    value: 'mexico',
    label: 'Mexico',
    children: [
      {
        value: 'jalisco',
        label: 'Jalisco',
        children: [
          { value: 'guadalajara', label: 'Guadalajara' },
        ],
      },
    ],
  },
];

const TARGET_PATH = ['united-states', 'california', 'san-jose-us'];

export default function T12({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string[]>([]);
  const successFired = useRef(false);

  const handleApply = () => {
    if (!successFired.current && pathEquals(value, TARGET_PATH)) {
      successFired.current = true;
      onSuccess();
    }
  };

  return (
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      <div style={{ background: '#141414', minHeight: '100vh', padding: 24 }}>
        <Card
          title="Logistics Configuration"
          style={{ width: 460, margin: '0 auto', background: '#1f1f1f', borderColor: '#333' }}
        >
          <div style={{ marginBottom: 12, fontSize: 12, color: '#999' }}>
            Select the primary city for distribution operations.
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
              City selector
            </label>
            <Cascader
              style={{ width: '100%' }}
              options={options}
              value={value}
              onChange={(val) => setValue(val as string[])}
              placeholder="Search or select city"
              showSearch
            />
          </div>
          <Button type="primary" style={{ marginTop: 16 }} onClick={handleApply}>
            Apply city
          </Button>
        </Card>
      </div>
    </ConfigProvider>
  );
}
