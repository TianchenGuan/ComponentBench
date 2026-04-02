'use client';

/**
 * cascader-antd-T30: Dark + visual: match Target breadcrumb for Policy category
 *
 * Theme: dark.
 * Layout: isolated card centered on the page.
 * Component: one AntD Cascader labeled "Policy category".
 * Guidance element: a "Target breadcrumb" preview above the field shows the desired path as styled crumb chips.
 * Options: Domain → Area → Policy:
 *   - Compliance → Data → Retention (target)
 *   - Compliance → Data → Classification
 *   - Security → Access → MFA
 * Initial state: blank.
 * Distractors: the Compliance/Data branch has multiple similar policy leaves.
 *
 * Success: path_labels equal [Compliance, Data, Retention], path_values equal ['compliance','data','retention']
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Cascader } from 'antd';
import type { TaskComponentProps } from '../types';
import { pathEquals } from '../types';

const options = [
  {
    value: 'compliance',
    label: 'Compliance',
    children: [
      {
        value: 'data',
        label: 'Data',
        children: [
          { value: 'retention', label: 'Retention' },
          { value: 'classification', label: 'Classification' },
        ],
      },
    ],
  },
  {
    value: 'security',
    label: 'Security',
    children: [
      {
        value: 'access',
        label: 'Access',
        children: [
          { value: 'mfa', label: 'MFA' },
        ],
      },
    ],
  },
];

const TARGET_PATH = ['compliance', 'data', 'retention'];

export default function T30({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string[]>([]);
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && pathEquals(value, TARGET_PATH)) {
      successFired.current = true;
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card title="Policy Configuration" style={{ width: 450 }}>
      <div
        data-testid="target-policy-breadcrumb"
        style={{
          marginBottom: 16,
          padding: 12,
          background: 'rgba(255,255,255,0.05)',
          borderRadius: 6,
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginBottom: 4 }}>Target breadcrumb:</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ background: 'rgba(24,144,255,0.2)', color: '#69c0ff', padding: '2px 8px', borderRadius: 4, fontSize: 13 }}>Compliance</span>
          <span style={{ color: 'rgba(255,255,255,0.45)' }}>›</span>
          <span style={{ background: 'rgba(24,144,255,0.2)', color: '#69c0ff', padding: '2px 8px', borderRadius: 4, fontSize: 13 }}>Data</span>
          <span style={{ color: 'rgba(255,255,255,0.45)' }}>›</span>
          <span style={{ background: 'rgba(24,144,255,0.2)', color: '#69c0ff', padding: '2px 8px', borderRadius: 4, fontSize: 13 }}>Retention</span>
        </div>
      </div>
      <div style={{ marginBottom: 8 }}>
        <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
          Policy category
        </label>
        <Cascader
          data-testid="policy-category-cascader"
          style={{ width: '100%' }}
          options={options}
          value={value}
          onChange={(val) => setValue(val as string[])}
          placeholder="Select policy"
        />
      </div>
    </Card>
  );
}
