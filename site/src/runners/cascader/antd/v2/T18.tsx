'use client';

/**
 * cascader-antd-v2-T18: Visual reference for intermediate changeOnSelect scope
 *
 * Inline surface with a Cascader "Reporting scope" using changeOnSelect. A breadcrumb
 * reference card shows "Engineering > Platform". The popup still reveals a third column
 * with API, Queues, Cache — which should NOT be selected. Select the intermediate path
 * Engineering / Platform, then click "Apply scope".
 *
 * Success: path matches reference and equals [Engineering, Platform], "Apply scope" clicked.
 */

import React, { useState, useRef } from 'react';
import { Card, Cascader, Button, Breadcrumb } from 'antd';
import type { TaskComponentProps } from '../../types';
import { pathEquals } from '../../types';

const options = [
  {
    value: 'engineering',
    label: 'Engineering',
    children: [
      {
        value: 'platform',
        label: 'Platform',
        children: [
          { value: 'api', label: 'API' },
          { value: 'queues', label: 'Queues' },
          { value: 'cache', label: 'Cache' },
        ],
      },
      {
        value: 'product',
        label: 'Product',
        children: [
          { value: 'search', label: 'Search' },
        ],
      },
    ],
  },
  {
    value: 'finance',
    label: 'Finance',
    children: [
      { value: 'payroll', label: 'Payroll' },
      { value: 'accounting', label: 'Accounting' },
    ],
  },
  {
    value: 'operations',
    label: 'Operations',
    children: [
      { value: 'logistics', label: 'Logistics' },
    ],
  },
];

const TARGET_PATH = ['engineering', 'platform'];

export default function T18({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string[]>([]);
  const successFired = useRef(false);

  const handleApply = () => {
    if (!successFired.current && pathEquals(value, TARGET_PATH)) {
      successFired.current = true;
      onSuccess();
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <div style={{ maxWidth: 460, margin: '20px 0 0 100px' }}>
        <Card
          size="small"
          style={{ marginBottom: 16, background: '#f6f8fa' }}
        >
          <div style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>
            Target scope (reference)
          </div>
          <Breadcrumb
            items={[
              { title: 'Engineering' },
              { title: 'Platform' },
            ]}
          />
        </Card>

        <Card title="Reporting Configuration">
          <div style={{ marginBottom: 12, fontSize: 12, color: '#888' }}>
            Select the scope for quarterly reporting. Intermediate levels are accepted.
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
              Reporting scope
            </label>
            <Cascader
              style={{ width: '100%' }}
              options={options}
              value={value}
              onChange={(val) => setValue(val as string[])}
              placeholder="Select scope"
              changeOnSelect
            />
          </div>
          <Button type="primary" style={{ marginTop: 16 }} onClick={handleApply}>
            Apply scope
          </Button>
        </Card>
      </div>
    </div>
  );
}
