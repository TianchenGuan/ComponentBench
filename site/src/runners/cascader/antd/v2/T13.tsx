'use client';

/**
 * cascader-antd-v2-T13: Replace one wrong default chip and finish with exact two-city set
 *
 * Settings panel with a multiple Cascader "Cities included" starting with two preselected
 * chips: Europe / France / Paris and Europe / Spain / Madrid. Keep Paris, remove Madrid,
 * add Asia / Japan / Osaka. Then click "Save cities".
 *
 * Success: set equals [[Europe, France, Paris], [Asia, Japan, Osaka]], "Save cities" clicked.
 */

import React, { useState, useRef } from 'react';
import { Card, Cascader, Button, Switch } from 'antd';
import type { TaskComponentProps } from '../../types';
import { pathSetsEqual } from '../../types';

const options = [
  {
    value: 'europe',
    label: 'Europe',
    children: [
      {
        value: 'france',
        label: 'France',
        children: [
          { value: 'paris', label: 'Paris' },
          { value: 'lyon', label: 'Lyon' },
        ],
      },
      {
        value: 'spain',
        label: 'Spain',
        children: [
          { value: 'madrid', label: 'Madrid' },
          { value: 'barcelona', label: 'Barcelona' },
        ],
      },
    ],
  },
  {
    value: 'asia',
    label: 'Asia',
    children: [
      {
        value: 'japan',
        label: 'Japan',
        children: [
          { value: 'tokyo', label: 'Tokyo' },
          { value: 'osaka', label: 'Osaka' },
          { value: 'kyoto', label: 'Kyoto' },
        ],
      },
      {
        value: 'south-korea',
        label: 'South Korea',
        children: [
          { value: 'seoul', label: 'Seoul' },
        ],
      },
    ],
  },
];

const INITIAL_VALUE = [
  ['europe', 'france', 'paris'],
  ['europe', 'spain', 'madrid'],
];

const TARGET_PATHS = [
  ['europe', 'france', 'paris'],
  ['asia', 'japan', 'osaka'],
];

export default function T13({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string[][]>(INITIAL_VALUE);
  const successFired = useRef(false);

  const handleSave = () => {
    if (!successFired.current && pathSetsEqual(value, TARGET_PATHS)) {
      successFired.current = true;
      onSuccess();
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <Card title="Coverage Settings" style={{ width: 480, margin: '20px 0 0 100px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <span style={{ fontWeight: 500 }}>Enable alerts</span>
          <Switch defaultChecked />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
            Cities included
          </label>
          <Cascader
            style={{ width: '100%' }}
            options={options}
            value={value}
            onChange={(val) => setValue(val as string[][])}
            placeholder="Select cities"
            multiple
          />
        </div>
        <Button type="primary" style={{ marginTop: 16 }} onClick={handleSave}>
          Save cities
        </Button>
      </Card>
    </div>
  );
}
