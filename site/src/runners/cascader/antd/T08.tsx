'use client';

/**
 * cascader-antd-T08: Open the Support topic cascader dropdown (leave it open)
 *
 * Layout: isolated card anchored near the top-right of the viewport.
 * Component: one AntD Cascader input labeled "Support topic", initially blank.
 * Options: Topic → Subtopic → Detail (examples):
 *   - Account → Billing → Refunds
 *   - Account → Login → Password reset
 *   - Product → Mobile → Crashes
 * Behavior: clicking the input opens a floating multi-column dropdown. Clicking outside closes it.
 * Goal of this task: only the open/closed state matters; no selection should be made.
 *
 * Success: The Support topic cascader dropdown is open/visible (popup rendered), value is still null/empty.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Cascader } from 'antd';
import type { TaskComponentProps } from '../types';

const options = [
  {
    value: 'account',
    label: 'Account',
    children: [
      {
        value: 'billing',
        label: 'Billing',
        children: [
          { value: 'refunds', label: 'Refunds' },
        ],
      },
      {
        value: 'login',
        label: 'Login',
        children: [
          { value: 'password-reset', label: 'Password reset' },
        ],
      },
    ],
  },
  {
    value: 'product',
    label: 'Product',
    children: [
      {
        value: 'mobile',
        label: 'Mobile',
        children: [
          { value: 'crashes', label: 'Crashes' },
        ],
      },
    ],
  },
];

export default function T08({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    // Success when dropdown is open AND value is still empty
    if (!successFired.current && open && (!value || value.length === 0)) {
      successFired.current = true;
      onSuccess();
    }
  }, [open, value, onSuccess]);

  return (
    <Card title="Support Request" style={{ width: 400 }}>
      <div style={{ marginBottom: 8 }}>
        <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
          Support topic
        </label>
        <Cascader
          data-testid="support-topic-cascader"
          style={{ width: '100%' }}
          options={options}
          value={value}
          onChange={(val) => setValue(val as string[])}
          open={open}
          onDropdownVisibleChange={setOpen}
          placeholder="Please select"
        />
      </div>
    </Card>
  );
}
