'use client';

/**
 * cascader-antd-v2-T07: Compact row-embedded trigger in rules table
 *
 * Table with "Auth lockout" and "Billing retry" rows. Each has a compact Cascader
 * in the Category cell and a row-local "Save row" button. Set Auth lockout's Category
 * to Support / Tier 2 / Identity. Billing retry must remain at Support / Tier 1 / Billing.
 *
 * Success: Auth lockout path equals [Support, Tier 2, Identity], Billing retry unchanged,
 *          "Save row" clicked.
 */

import React, { useState, useRef } from 'react';
import { Card, Cascader, Button, Tag, ConfigProvider } from 'antd';
import type { TaskComponentProps } from '../../types';
import { pathEquals } from '../../types';

const options = [
  {
    value: 'support',
    label: 'Support',
    children: [
      {
        value: 'tier-1',
        label: 'Tier 1',
        children: [
          { value: 'billing', label: 'Billing' },
          { value: 'general', label: 'General' },
        ],
      },
      {
        value: 'tier-2',
        label: 'Tier 2',
        children: [
          { value: 'identity', label: 'Identity' },
          { value: 'billing', label: 'Billing' },
          { value: 'escalation', label: 'Escalation' },
        ],
      },
    ],
  },
  {
    value: 'engineering',
    label: 'Engineering',
    children: [
      {
        value: 'platform',
        label: 'Platform',
        children: [
          { value: 'api', label: 'API' },
        ],
      },
    ],
  },
];

const BILLING_RETRY_INITIAL = ['support', 'tier-1', 'billing'];
const TARGET_PATH = ['support', 'tier-2', 'identity'];

export default function T07({ onSuccess }: TaskComponentProps) {
  const [authValue, setAuthValue] = useState<string[]>([]);
  const [billingValue, setBillingValue] = useState<string[]>(BILLING_RETRY_INITIAL);
  const successFired = useRef(false);

  const handleSaveAuth = () => {
    if (
      !successFired.current &&
      pathEquals(authValue, TARGET_PATH) &&
      pathEquals(billingValue, BILLING_RETRY_INITIAL)
    ) {
      successFired.current = true;
      onSuccess();
    }
  };

  return (
    <ConfigProvider componentSize="small">
      <Card
        title="Routing Rules"
        style={{ width: 680, margin: '60px 0 0 40px' }}
        styles={{ body: { padding: 0 } }}
      >
        <div style={{ padding: '8px 16px', borderBottom: '1px solid #f0f0f0', display: 'flex', gap: 12, fontSize: 12, color: '#999' }}>
          <span style={{ flex: '0 0 120px', fontWeight: 600 }}>Rule</span>
          <span style={{ flex: 1, fontWeight: 600 }}>Category</span>
          <span style={{ flex: '0 0 60px', fontWeight: 600 }}>Status</span>
          <span style={{ flex: '0 0 90px' }} />
        </div>

        <div style={{ padding: '8px 16px', borderBottom: '1px solid #f0f0f0', display: 'flex', gap: 12, alignItems: 'center' }}>
          <span style={{ flex: '0 0 120px', fontWeight: 500, fontSize: 13 }}>Auth lockout</span>
          <div style={{ flex: 1 }}>
            <Cascader
              style={{ width: '100%' }}
              options={options}
              value={authValue}
              onChange={(val) => setAuthValue(val as string[])}
              placeholder="Select category"
            />
          </div>
          <span style={{ flex: '0 0 60px' }}><Tag color="orange">Open</Tag></span>
          <div style={{ flex: '0 0 90px' }}>
            <Button size="small" type="primary" onClick={handleSaveAuth}>Save row</Button>
          </div>
        </div>

        <div style={{ padding: '8px 16px', display: 'flex', gap: 12, alignItems: 'center' }}>
          <span style={{ flex: '0 0 120px', fontWeight: 500, fontSize: 13 }}>Billing retry</span>
          <div style={{ flex: 1 }}>
            <Cascader
              style={{ width: '100%' }}
              options={options}
              value={billingValue}
              onChange={(val) => setBillingValue(val as string[])}
              placeholder="Select category"
            />
          </div>
          <span style={{ flex: '0 0 60px' }}><Tag color="green">Active</Tag></span>
          <div style={{ flex: '0 0 90px' }}>
            <Button size="small">Save row</Button>
          </div>
        </div>
      </Card>
    </ConfigProvider>
  );
}
