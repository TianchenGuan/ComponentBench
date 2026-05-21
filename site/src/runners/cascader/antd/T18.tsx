'use client';

/**
 * cascader-antd-T18: Change-on-select: choose parent path Engineering / Platform
 *
 * Layout: isolated card centered on the page.
 * Component: one AntD Cascader labeled "Reporting scope" configured with changeOnSelect=true.
 * Behavior: the value updates on each selection level; selecting a parent is allowed and commits immediately.
 * Options: Division → Group → Team:
 *   - Engineering → Platform → Infrastructure, Developer Experience
 *   - Engineering → Product → Web, Mobile
 *   - Operations → IT → Helpdesk
 * Initial state: blank.
 * Key nuance: success requires stopping at the parent path "Engineering / Platform" (2 levels), not choosing a leaf team.
 *
 * Success: path_labels equal [Engineering, Platform] (exactly two levels), path_values equal ['eng','platform']
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Cascader } from 'antd';
import type { TaskComponentProps } from '../types';
import { pathEquals } from '../types';

const options = [
  {
    value: 'eng',
    label: 'Engineering',
    children: [
      {
        value: 'platform',
        label: 'Platform',
        children: [
          { value: 'infra', label: 'Infrastructure' },
          { value: 'devex', label: 'Developer Experience' },
        ],
      },
      {
        value: 'product',
        label: 'Product',
        children: [
          { value: 'web', label: 'Web' },
          { value: 'mobile', label: 'Mobile' },
        ],
      },
    ],
  },
  {
    value: 'ops',
    label: 'Operations',
    children: [
      {
        value: 'it',
        label: 'IT',
        children: [
          { value: 'helpdesk', label: 'Helpdesk' },
        ],
      },
    ],
  },
];

const TARGET_PATH = ['eng', 'platform'];

export default function T18({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string[]>([]);
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && pathEquals(value, TARGET_PATH)) {
      successFired.current = true;
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card title="Report Configuration" style={{ width: 450 }}>
      <div style={{ marginBottom: 8 }}>
        <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
          Reporting scope
        </label>
        <Cascader
          data-testid="reporting-scope-cascader"
          style={{ width: '100%' }}
          options={options}
          value={value}
          onChange={(val) => setValue(val as string[])}
          placeholder="Select scope"
          changeOnSelect
        />
        <div style={{ marginTop: 8, fontSize: 12, color: '#888' }}>
          You can select any level in the hierarchy.
        </div>
      </div>
    </Card>
  );
}
