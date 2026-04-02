'use client';

/**
 * cascader-antd-T22: Hover-to-expand in compact spacing: Tools / Power Tools / Sanders
 *
 * Spacing: compact.
 * Layout: isolated card centered on the page.
 * Component: one AntD Cascader labeled "Inventory category", configured with expandTrigger='hover'.
 * Behavior: submenus open when the pointer hovers over an item in a column (not when it is clicked).
 * The final leaf is selected by clicking.
 * Options: Department → Category → Item:
 *   - Tools → Power Tools → Sanders (target), Drills
 *   - Tools → Hand Tools → Hammers
 *   - Supplies → Safety → Gloves
 * Initial state: blank.
 * Distractors: in compact mode, list items are shorter and closer together.
 *
 * Success: path_labels equal [Tools, Power Tools, Sanders], path_values equal ['tools','power-tools','sanders']
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Cascader, ConfigProvider } from 'antd';
import type { TaskComponentProps } from '../types';
import { pathEquals } from '../types';

const options = [
  {
    value: 'tools',
    label: 'Tools',
    children: [
      {
        value: 'power-tools',
        label: 'Power Tools',
        children: [
          { value: 'sanders', label: 'Sanders' },
          { value: 'drills', label: 'Drills' },
        ],
      },
      {
        value: 'hand-tools',
        label: 'Hand Tools',
        children: [
          { value: 'hammers', label: 'Hammers' },
        ],
      },
    ],
  },
  {
    value: 'supplies',
    label: 'Supplies',
    children: [
      {
        value: 'safety',
        label: 'Safety',
        children: [
          { value: 'gloves', label: 'Gloves' },
        ],
      },
    ],
  },
];

const TARGET_PATH = ['tools', 'power-tools', 'sanders'];

export default function T22({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string[]>([]);
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && pathEquals(value, TARGET_PATH)) {
      successFired.current = true;
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <ConfigProvider componentSize="middle">
      <Card title="Inventory Management" style={{ width: 400 }} styles={{ body: { padding: 12 } }}>
        <div style={{ marginBottom: 4 }}>
          <label style={{ display: 'block', marginBottom: 2, fontWeight: 500, fontSize: 13 }}>
            Inventory category
          </label>
          <Cascader
            data-testid="inventory-category-cascader"
            style={{ width: '100%' }}
            options={options}
            value={value}
            onChange={(val) => setValue(val as string[])}
            placeholder="Hover to navigate"
            expandTrigger="hover"
          />
        </div>
      </Card>
    </ConfigProvider>
  );
}
