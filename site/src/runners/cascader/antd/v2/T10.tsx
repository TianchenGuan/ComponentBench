'use client';

/**
 * cascader-antd-v2-T10: Dark visual breadcrumb match with exact policy branch
 *
 * Dark-themed dashboard panel. A breadcrumb reference card shows "Policies > Access >
 * Password reset". One Cascader labeled "Policy category" uses standard three-column
 * popup. Select the matching path, then click "Apply policy".
 *
 * Success: path matches reference and equals [Policies, Access, Password reset],
 *          "Apply policy" clicked.
 */

import React, { useState, useRef } from 'react';
import { Card, Cascader, Button, Breadcrumb, ConfigProvider, theme } from 'antd';
import type { TaskComponentProps } from '../../types';
import { pathEquals } from '../../types';

const options = [
  {
    value: 'policies',
    label: 'Policies',
    children: [
      {
        value: 'access',
        label: 'Access',
        children: [
          { value: 'password-reset', label: 'Password reset' },
          { value: 'password-change', label: 'Password change' },
          { value: 'mfa', label: 'MFA' },
        ],
      },
      {
        value: 'data',
        label: 'Data',
        children: [
          { value: 'retention', label: 'Retention' },
          { value: 'encryption', label: 'Encryption' },
        ],
      },
      {
        value: 'compliance',
        label: 'Compliance',
        children: [
          { value: 'soc2', label: 'SOC 2' },
          { value: 'hipaa', label: 'HIPAA' },
        ],
      },
    ],
  },
  {
    value: 'procedures',
    label: 'Procedures',
    children: [
      {
        value: 'incident',
        label: 'Incident',
        children: [
          { value: 'response', label: 'Response' },
        ],
      },
    ],
  },
];

const TARGET_PATH = ['policies', 'access', 'password-reset'];

export default function T10({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string[]>([]);
  const successFired = useRef(false);

  const handleApply = () => {
    if (!successFired.current && pathEquals(value, TARGET_PATH)) {
      successFired.current = true;
      onSuccess();
    }
  };

  return (
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      <div style={{ background: '#141414', minHeight: '100vh', padding: 24 }}>
        <div style={{ maxWidth: 500, margin: '0 0 0 100px' }}>
          <Card
            size="small"
            style={{ marginBottom: 16, background: '#1f1f1f', borderColor: '#333' }}
          >
            <div style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>
              Target path (reference)
            </div>
            <Breadcrumb
              items={[
                { title: 'Policies' },
                { title: 'Access' },
                { title: 'Password reset' },
              ]}
            />
          </Card>

          <Card
            title="Policy Configuration"
            style={{ background: '#1f1f1f', borderColor: '#333' }}
          >
            <div>
              <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
                Policy category
              </label>
              <Cascader
                style={{ width: '100%' }}
                options={options}
                value={value}
                onChange={(val) => setValue(val as string[])}
                placeholder="Select policy"
              />
            </div>
            <Button type="primary" style={{ marginTop: 16 }} onClick={handleApply}>
              Apply policy
            </Button>
          </Card>
        </div>
      </div>
    </ConfigProvider>
  );
}
