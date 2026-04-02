'use client';

/**
 * cascader-antd-T16: Small scale: select Hardware / Networking / Routers
 *
 * Scale: small (the cascader input uses AntD size='small').
 * Layout: isolated card centered on the page.
 * Component: one AntD Cascader labeled "Asset category".
 * Options: Category → Subcategory → Type:
 *   - Hardware → Networking → Routers (target), Switches
 *   - Hardware → Computing → Laptops
 *   - Software → Security → Antivirus
 * Initial state: blank.
 * Distractors: none, but the smaller control reduces target size.
 *
 * Success: path_labels equal [Hardware, Networking, Routers], path_values equal ['hw','net','routers']
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Cascader } from 'antd';
import type { TaskComponentProps } from '../types';
import { pathEquals } from '../types';

const options = [
  {
    value: 'hw',
    label: 'Hardware',
    children: [
      {
        value: 'net',
        label: 'Networking',
        children: [
          { value: 'routers', label: 'Routers' },
          { value: 'switches', label: 'Switches' },
        ],
      },
      {
        value: 'computing',
        label: 'Computing',
        children: [
          { value: 'laptops', label: 'Laptops' },
        ],
      },
    ],
  },
  {
    value: 'sw',
    label: 'Software',
    children: [
      {
        value: 'security',
        label: 'Security',
        children: [
          { value: 'antivirus', label: 'Antivirus' },
        ],
      },
    ],
  },
];

const TARGET_PATH = ['hw', 'net', 'routers'];

export default function T16({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string[]>([]);
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && pathEquals(value, TARGET_PATH)) {
      successFired.current = true;
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card title="Asset Management" style={{ width: 350 }}>
      <div style={{ marginBottom: 8 }}>
        <label style={{ display: 'block', marginBottom: 4, fontWeight: 500, fontSize: 13 }}>
          Asset category
        </label>
        <Cascader
          data-testid="asset-category-cascader"
          style={{ width: '100%' }}
          options={options}
          value={value}
          onChange={(val) => setValue(val as string[])}
          placeholder="Please select"
          size="small"
        />
      </div>
    </Card>
  );
}
