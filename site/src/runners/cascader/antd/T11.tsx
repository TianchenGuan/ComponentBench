'use client';

/**
 * cascader-antd-T11: Two instances: set Billing region to United States / California / San Jose
 *
 * Layout: isolated card centered on the page.
 * Components: two similar AntD Cascader inputs stacked vertically:
 *   1) "Shipping region" (distractor)
 *   2) "Billing region" (target)
 * Options: Country → State/Territory → City, with several similar city names:
 *   - United States → California → San Jose (target), San Diego
 *   - United States → Texas → San Antonio
 *   - Puerto Rico → (territory) → San Juan
 * Initial state: Shipping region is set to "Puerto Rico / San Juan"; Billing region is blank.
 * Distractors: multiple cities start with "San …", so reading the full path is required.
 *
 * Success: Billing region has path_labels [United States, California, San Jose], path_values ['us','ca','san-jose']
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Cascader } from 'antd';
import type { TaskComponentProps } from '../types';
import { pathEquals } from '../types';

const options = [
  {
    value: 'us',
    label: 'United States',
    children: [
      {
        value: 'ca',
        label: 'California',
        children: [
          { value: 'san-jose', label: 'San Jose' },
          { value: 'san-diego', label: 'San Diego' },
        ],
      },
      {
        value: 'tx',
        label: 'Texas',
        children: [
          { value: 'san-antonio', label: 'San Antonio' },
        ],
      },
    ],
  },
  {
    value: 'pr',
    label: 'Puerto Rico',
    children: [
      {
        value: 'territory',
        label: 'Territory',
        children: [
          { value: 'san-juan', label: 'San Juan' },
        ],
      },
    ],
  },
];

const TARGET_PATH = ['us', 'ca', 'san-jose'];
const SHIPPING_INITIAL = ['pr', 'territory', 'san-juan'];

export default function T11({ onSuccess }: TaskComponentProps) {
  const [shippingValue, setShippingValue] = useState<string[]>(SHIPPING_INITIAL);
  const [billingValue, setBillingValue] = useState<string[]>([]);
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && pathEquals(billingValue, TARGET_PATH)) {
      successFired.current = true;
      onSuccess();
    }
  }, [billingValue, onSuccess]);

  return (
    <Card title="Region Settings" style={{ width: 450 }}>
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
          Shipping region
        </label>
        <Cascader
          data-testid="shipping-region-cascader"
          style={{ width: '100%' }}
          options={options}
          value={shippingValue}
          onChange={(val) => setShippingValue(val as string[])}
          placeholder="Please select"
        />
      </div>
      <div style={{ marginBottom: 8 }}>
        <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
          Billing region
        </label>
        <Cascader
          data-testid="billing-region-cascader"
          style={{ width: '100%' }}
          options={options}
          value={billingValue}
          onChange={(val) => setBillingValue(val as string[])}
          placeholder="Please select"
        />
      </div>
    </Card>
  );
}
