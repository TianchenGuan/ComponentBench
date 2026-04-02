'use client';

/**
 * cascader-antd-v2-T03: Multiple re-ground after first chip — exact Paris and Osaka
 *
 * Settings panel with a multiple Cascader labeled "Cities included". Select exactly
 * Europe / France / Paris and Asia / Japan / Osaka. Then click "Apply cities".
 * Distractors: Tokyo, Kyoto, Lyon.
 *
 * Success: set equals [[Europe, France, Paris], [Asia, Japan, Osaka]],
 *          "Apply cities" clicked.
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
    ],
  },
];

const TARGET_PATHS = [
  ['europe', 'france', 'paris'],
  ['asia', 'japan', 'osaka'],
];

export default function T03({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string[][]>([]);
  const successFired = useRef(false);

  const handleApply = () => {
    if (!successFired.current && pathSetsEqual(value, TARGET_PATHS)) {
      successFired.current = true;
      onSuccess();
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <Card
        title="Coverage Settings"
        style={{ width: 480, margin: '20px 0 0 100px' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <span style={{ fontWeight: 500 }}>Enable notifications</span>
          <Switch defaultChecked />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <span style={{ fontWeight: 500 }}>Auto-schedule</span>
          <Switch />
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
        <Button
          type="primary"
          style={{ marginTop: 16 }}
          onClick={handleApply}
        >
          Apply cities
        </Button>
      </Card>
    </div>
  );
}
