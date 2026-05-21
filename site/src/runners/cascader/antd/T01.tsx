'use client';

/**
 * cascader-antd-T01: Select office location: Zhejiang / Hangzhou / West Lake
 *
 * Layout: isolated card centered on the page.
 * Component: a single AntD Cascader input labeled "Office location" with placeholder "Please select".
 * Behavior: clicking the input opens a 3-column dropdown (province → city → landmark). 
 * Selection is committed immediately when the final (leaf) item is clicked.
 * Options shown (representative):
 *   - Zhejiang → Hangzhou → West Lake
 *   - Jiangsu → Nanjing → Zhong Hua Men
 * Initial state: no selection (placeholder visible).
 * Distractors: none; only helper text under the field describing what a cascader is.
 *
 * Success: path_labels equal [Zhejiang, Hangzhou, West Lake], path_values equal ['zhejiang','hangzhou','xihu']
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Cascader } from 'antd';
import type { TaskComponentProps } from '../types';
import { pathEquals } from '../types';

const options = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [
          { value: 'xihu', label: 'West Lake' },
        ],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [
      {
        value: 'nanjing',
        label: 'Nanjing',
        children: [
          { value: 'zhonghuamen', label: 'Zhong Hua Men' },
        ],
      },
    ],
  },
];

const TARGET_PATH = ['zhejiang', 'hangzhou', 'xihu'];

export default function T01({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string[]>([]);
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && pathEquals(value, TARGET_PATH)) {
      successFired.current = true;
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card title="Office Location" style={{ width: 450 }}>
      <div style={{ marginBottom: 8 }}>
        <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
          Office location
        </label>
        <Cascader
          data-testid="office-location-cascader"
          style={{ width: '100%' }}
          options={options}
          value={value}
          onChange={(val) => setValue(val as string[])}
          placeholder="Please select"
        />
        <div style={{ marginTop: 8, fontSize: 12, color: '#888' }}>
          A cascader is a multi-level dropdown for selecting hierarchical data.
        </div>
      </div>
    </Card>
  );
}
