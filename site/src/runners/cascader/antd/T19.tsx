'use client';

/**
 * cascader-antd-T19: Two instances: clear Secondary tag
 *
 * Layout: isolated card centered on the page.
 * Components: two AntD Cascader inputs labeled "Primary tag" and "Secondary tag". Both allow clearing.
 * Initial state:
 *   - Primary tag is set to "Customer / Onboarding / High touch".
 *   - Secondary tag is set to "Region / EMEA / UK". (target to clear)
 * UI behavior: each input shows a small clear icon (×) on hover.
 * Distractors: the two fields are visually similar; only the label distinguishes which one to clear.
 *
 * Success: Secondary tag has no selected value (null/empty).
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Cascader } from 'antd';
import type { TaskComponentProps } from '../types';

const primaryOptions = [
  {
    value: 'customer',
    label: 'Customer',
    children: [
      {
        value: 'onboarding',
        label: 'Onboarding',
        children: [
          { value: 'high-touch', label: 'High touch' },
          { value: 'low-touch', label: 'Low touch' },
        ],
      },
    ],
  },
];

const secondaryOptions = [
  {
    value: 'region',
    label: 'Region',
    children: [
      {
        value: 'emea',
        label: 'EMEA',
        children: [
          { value: 'uk', label: 'UK' },
          { value: 'de', label: 'Germany' },
        ],
      },
      {
        value: 'americas',
        label: 'Americas',
        children: [
          { value: 'us', label: 'US' },
        ],
      },
    ],
  },
];

const PRIMARY_INITIAL = ['customer', 'onboarding', 'high-touch'];
const SECONDARY_INITIAL = ['region', 'emea', 'uk'];

export default function T19({ onSuccess }: TaskComponentProps) {
  const [primaryValue, setPrimaryValue] = useState<string[]>(PRIMARY_INITIAL);
  const [secondaryValue, setSecondaryValue] = useState<string[]>(SECONDARY_INITIAL);
  const successFired = useRef(false);

  useEffect(() => {
    // Success when secondary tag is cleared
    if (!successFired.current && (!secondaryValue || secondaryValue.length === 0)) {
      successFired.current = true;
      onSuccess();
    }
  }, [secondaryValue, onSuccess]);

  return (
    <Card title="Tag Management" style={{ width: 450 }}>
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
          Primary tag
        </label>
        <Cascader
          data-testid="primary-tag-cascader"
          style={{ width: '100%' }}
          options={primaryOptions}
          value={primaryValue}
          onChange={(val) => setPrimaryValue((val as string[]) || [])}
          placeholder="Please select"
          allowClear
        />
      </div>
      <div style={{ marginBottom: 8 }}>
        <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
          Secondary tag
        </label>
        <Cascader
          data-testid="secondary-tag-cascader"
          style={{ width: '100%' }}
          options={secondaryOptions}
          value={secondaryValue}
          onChange={(val) => setSecondaryValue((val as string[]) || [])}
          placeholder="Please select"
          allowClear
        />
      </div>
    </Card>
  );
}
