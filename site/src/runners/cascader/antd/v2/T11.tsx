'use client';

/**
 * cascader-antd-v2-T11: Intermediate-path commit with changeOnSelect and decoy selector
 *
 * Settings panel with two Cascaders: "Reporting scope" (empty, target) and "Billing scope"
 * (prefilled Finance / Payroll). Reporting scope uses changeOnSelect so an intermediate
 * two-level path is valid. Select Engineering / Platform (NOT a leaf), then click "Apply scope".
 * Billing scope must remain unchanged.
 *
 * Success: Reporting scope path equals [Engineering, Platform], Billing scope unchanged,
 *          "Apply scope" clicked.
 */

import React, { useState, useRef } from 'react';
import { Card, Cascader, Button } from 'antd';
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
          { value: 'recommendations', label: 'Recommendations' },
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
      {
        value: 'platform',
        label: 'Platform',
        children: [
          { value: 'invoicing', label: 'Invoicing' },
        ],
      },
    ],
  },
];

const BILLING_INITIAL = ['finance', 'payroll'];
const TARGET_PATH = ['engineering', 'platform'];

export default function T11({ onSuccess }: TaskComponentProps) {
  const [reportingValue, setReportingValue] = useState<string[]>([]);
  const [billingValue, setBillingValue] = useState<string[]>(BILLING_INITIAL);
  const successFired = useRef(false);

  const handleApply = () => {
    if (
      !successFired.current &&
      pathEquals(reportingValue, TARGET_PATH) &&
      pathEquals(billingValue, BILLING_INITIAL)
    ) {
      successFired.current = true;
      onSuccess();
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <Card title="Scope Configuration" style={{ width: 480, margin: '20px 0 0 100px' }}>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
            Reporting scope
          </label>
          <Cascader
            style={{ width: '100%' }}
            options={options}
            value={reportingValue}
            onChange={(val) => setReportingValue(val as string[])}
            placeholder="Select scope"
            changeOnSelect
          />
          <div style={{ marginTop: 4, fontSize: 12, color: '#888' }}>
            You may select an intermediate level.
          </div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
            Billing scope
          </label>
          <Cascader
            style={{ width: '100%' }}
            options={options}
            value={billingValue}
            onChange={(val) => setBillingValue(val as string[])}
            placeholder="Select scope"
            changeOnSelect
          />
        </div>
        <Button type="primary" onClick={handleApply}>Apply scope</Button>
      </Card>
    </div>
  );
}
