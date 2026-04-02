'use client';

/**
 * cascader-antd-T12: Mixed guidance: match Target breadcrumb for Cost center
 *
 * Layout: isolated card centered on the page.
 * Component: one AntD Cascader labeled "Cost center".
 * Guidance elements:
 *   - A "Target" breadcrumb preview directly above the field showing the full desired path as styled crumb chips.
 *   - A small text hint under the preview: "Target starts with Finance".
 * Options tree: Division → Department → Team:
 *   - Finance → Accounting → Accounts Payable (target)
 *   - Finance → Accounting → Accounts Receivable
 *   - Finance → FP&A → Forecasting
 *   - Operations → Procurement → Vendor Management
 * Initial state: blank.
 * Distractors: Finance has multiple similar teams under Accounting.
 *
 * Success: path_labels equal [Finance, Accounting, Accounts Payable], path_values equal ['finance','acct','ap']
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Cascader } from 'antd';
import type { TaskComponentProps } from '../types';
import { pathEquals } from '../types';

const options = [
  {
    value: 'finance',
    label: 'Finance',
    children: [
      {
        value: 'acct',
        label: 'Accounting',
        children: [
          { value: 'ap', label: 'Accounts Payable' },
          { value: 'ar', label: 'Accounts Receivable' },
        ],
      },
      {
        value: 'fpa',
        label: 'FP&A',
        children: [
          { value: 'forecasting', label: 'Forecasting' },
        ],
      },
    ],
  },
  {
    value: 'ops',
    label: 'Operations',
    children: [
      {
        value: 'procurement',
        label: 'Procurement',
        children: [
          { value: 'vendor-mgmt', label: 'Vendor Management' },
        ],
      },
    ],
  },
];

const TARGET_PATH = ['finance', 'acct', 'ap'];

export default function T12({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string[]>([]);
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && pathEquals(value, TARGET_PATH)) {
      successFired.current = true;
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card title="Cost Center Selection" style={{ width: 450 }}>
      <div
        data-testid="target-cost-center-breadcrumb"
        style={{
          marginBottom: 16,
          padding: 12,
          background: '#f5f5f5',
          borderRadius: 6,
          border: '1px solid #e8e8e8',
        }}
      >
        <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>Target:</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ background: '#e6f7ff', padding: '2px 8px', borderRadius: 4, fontSize: 13 }}>Finance</span>
          <span style={{ color: '#999' }}>›</span>
          <span style={{ background: '#e6f7ff', padding: '2px 8px', borderRadius: 4, fontSize: 13 }}>Accounting</span>
          <span style={{ color: '#999' }}>›</span>
          <span style={{ background: '#e6f7ff', padding: '2px 8px', borderRadius: 4, fontSize: 13 }}>Accounts Payable</span>
        </div>
        <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
          Target starts with Finance
        </div>
      </div>
      <div style={{ marginBottom: 8 }}>
        <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
          Cost center
        </label>
        <Cascader
          data-testid="cost-center-cascader"
          style={{ width: '100%' }}
          options={options}
          value={value}
          onChange={(val) => setValue(val as string[])}
          placeholder="Please select"
        />
      </div>
    </Card>
  );
}
