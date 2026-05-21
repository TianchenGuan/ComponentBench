'use client';

/**
 * cascader-antd-v2-T02: Compact hover-expand table row assign-to path
 *
 * Table with "Password reset" and "Billing dispute" rows, each containing a compact
 * Cascader labeled "Assign to" with expandTrigger="hover". Set the Password reset row
 * to Support / Tier 2 / Identity, then click "Save row". Billing dispute must remain
 * at Support / Tier 1 / Billing.
 *
 * Success: path equals [Support, Tier 2, Identity] for Password reset,
 *          Billing dispute unchanged, "Save row" clicked.
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
        value: 'tier1',
        label: 'Tier 1',
        children: [
          { value: 'billing', label: 'Billing' },
          { value: 'general', label: 'General' },
        ],
      },
      {
        value: 'tier2',
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
          { value: 'queues', label: 'Queues' },
        ],
      },
    ],
  },
];

const BILLING_INITIAL = ['support', 'tier1', 'billing'];
const TARGET_PATH = ['support', 'tier2', 'identity'];

export default function T02({ onSuccess }: TaskComponentProps) {
  const [pwResetValue, setPwResetValue] = useState<string[]>([]);
  const [billingValue, setBillingValue] = useState<string[]>(BILLING_INITIAL);
  const successFired = useRef(false);

  const handleSavePasswordReset = () => {
    if (
      !successFired.current &&
      pathEquals(pwResetValue, TARGET_PATH) &&
      pathEquals(billingValue, BILLING_INITIAL)
    ) {
      successFired.current = true;
      onSuccess();
    }
  };

  const handleSaveBilling = () => {};

  return (
    <ConfigProvider componentSize="small">
      <Card
        title="Routing Rules"
        style={{ width: 700, margin: '40px 0 0 60px' }}
        styles={{ body: { padding: 0 } }}
      >
        <div style={{ padding: '8px 16px', borderBottom: '1px solid #f0f0f0', display: 'flex', gap: 12, fontSize: 12, color: '#999' }}>
          <span style={{ flex: '0 0 140px', fontWeight: 600 }}>Rule</span>
          <span style={{ flex: 1, fontWeight: 600 }}>Assign to</span>
          <span style={{ flex: '0 0 50px', fontWeight: 600 }}>Priority</span>
          <span style={{ flex: '0 0 90px' }} />
        </div>

        <div style={{ padding: '8px 16px', borderBottom: '1px solid #f0f0f0', display: 'flex', gap: 12, alignItems: 'center' }}>
          <span style={{ flex: '0 0 140px', fontWeight: 500 }}>
            Password reset <Tag color="orange" style={{ marginLeft: 4 }}>New</Tag>
          </span>
          <div style={{ flex: 1 }}>
            <Cascader
              style={{ width: '100%' }}
              options={options}
              value={pwResetValue}
              onChange={(val) => setPwResetValue(val as string[])}
              placeholder="Select assignment"
              expandTrigger="hover"
            />
          </div>
          <span style={{ flex: '0 0 50px', fontSize: 12, color: '#999' }}>High</span>
          <div style={{ flex: '0 0 90px' }}>
            <Button size="small" type="primary" onClick={handleSavePasswordReset}>
              Save row
            </Button>
          </div>
        </div>

        <div style={{ padding: '8px 16px', display: 'flex', gap: 12, alignItems: 'center' }}>
          <span style={{ flex: '0 0 140px', fontWeight: 500 }}>
            Billing dispute <Tag color="blue" style={{ marginLeft: 4 }}>Active</Tag>
          </span>
          <div style={{ flex: 1 }}>
            <Cascader
              style={{ width: '100%' }}
              options={options}
              value={billingValue}
              onChange={(val) => setBillingValue(val as string[])}
              placeholder="Select assignment"
              expandTrigger="hover"
            />
          </div>
          <span style={{ flex: '0 0 50px', fontSize: 12, color: '#999' }}>Med</span>
          <div style={{ flex: '0 0 90px' }}>
            <Button size="small" onClick={handleSaveBilling}>Save row</Button>
          </div>
        </div>
      </Card>
    </ConfigProvider>
  );
}
