'use client';

/**
 * cascader-antd-v2-T22: Table-row exact two-path set with row-local save
 *
 * Table with "Enterprise onboarding" and "Trial conversion" rows. Each row has a
 * multiple Cascader "Teams included" and a "Save row" button. Select exactly
 * Support / Tier 2 / Identity and Customer Success / Enterprise / Onboarding
 * for the Enterprise onboarding row. Trial conversion must remain unchanged.
 *
 * Success: Enterprise onboarding set equals 2 paths, Trial conversion unchanged,
 *          "Save row" clicked.
 */

import React, { useState, useRef } from 'react';
import { Card, Cascader, Button, Tag, ConfigProvider } from 'antd';
import type { TaskComponentProps } from '../../types';
import { pathSetsEqual } from '../../types';

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
          { value: 'identity', label: 'Identity' },
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
    value: 'customer-success',
    label: 'Customer Success',
    children: [
      {
        value: 'enterprise',
        label: 'Enterprise',
        children: [
          { value: 'onboarding', label: 'Onboarding' },
          { value: 'adoption', label: 'Adoption' },
        ],
      },
    ],
  },
  {
    value: 'platform',
    label: 'Platform',
    children: [
      {
        value: 'database',
        label: 'Database',
        children: [
          { value: 'primary', label: 'Primary' },
        ],
      },
    ],
  },
];

const TRIAL_INITIAL: string[][] = [['support', 'tier-1', 'billing']];

const TARGET_PATHS = [
  ['support', 'tier-2', 'identity'],
  ['customer-success', 'enterprise', 'onboarding'],
];

export default function T22({ onSuccess }: TaskComponentProps) {
  const [enterpriseValue, setEnterpriseValue] = useState<string[][]>([]);
  const [trialValue, setTrialValue] = useState<string[][]>(TRIAL_INITIAL);
  const successFired = useRef(false);

  const handleSaveEnterprise = () => {
    if (
      !successFired.current &&
      pathSetsEqual(enterpriseValue, TARGET_PATHS) &&
      pathSetsEqual(trialValue, TRIAL_INITIAL)
    ) {
      successFired.current = true;
      onSuccess();
    }
  };

  return (
    <ConfigProvider componentSize="small">
      <Card
        title="Workflow Rules"
        style={{ width: 700, margin: '40px 0 0 40px' }}
        styles={{ body: { padding: 0 } }}
      >
        <div style={{ padding: '8px 16px', borderBottom: '1px solid #f0f0f0', display: 'flex', gap: 12, fontSize: 12, color: '#999' }}>
          <span style={{ flex: '0 0 160px', fontWeight: 600 }}>Workflow</span>
          <span style={{ flex: 1, fontWeight: 600 }}>Teams included</span>
          <span style={{ flex: '0 0 90px' }} />
        </div>

        <div style={{ padding: '8px 16px', borderBottom: '1px solid #f0f0f0', display: 'flex', gap: 12, alignItems: 'center' }}>
          <span style={{ flex: '0 0 160px', fontWeight: 500, fontSize: 13 }}>
            Enterprise onboarding
            <Tag color="green" style={{ marginLeft: 6 }}>Live</Tag>
          </span>
          <div style={{ flex: 1 }}>
            <Cascader
              style={{ width: '100%' }}
              options={options}
              value={enterpriseValue}
              onChange={(val) => setEnterpriseValue(val as string[][])}
              placeholder="Select teams"
              multiple
              maxTagCount="responsive"
            />
          </div>
          <div style={{ flex: '0 0 90px' }}>
            <Button size="small" type="primary" onClick={handleSaveEnterprise}>
              Save row
            </Button>
          </div>
        </div>

        <div style={{ padding: '8px 16px', display: 'flex', gap: 12, alignItems: 'center' }}>
          <span style={{ flex: '0 0 160px', fontWeight: 500, fontSize: 13 }}>
            Trial conversion
            <Tag color="blue" style={{ marginLeft: 6 }}>Active</Tag>
          </span>
          <div style={{ flex: 1 }}>
            <Cascader
              style={{ width: '100%' }}
              options={options}
              value={trialValue}
              onChange={(val) => setTrialValue(val as string[][])}
              placeholder="Select teams"
              multiple
              maxTagCount="responsive"
            />
          </div>
          <div style={{ flex: '0 0 90px' }}>
            <Button size="small">Save row</Button>
          </div>
        </div>
      </Card>
    </ConfigProvider>
  );
}
