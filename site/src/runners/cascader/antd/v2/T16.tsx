'use client';

/**
 * cascader-antd-v2-T16: Dark hover-expand policy path with narrow final leaf
 *
 * Dark-themed settings panel. Cascader "Policy path" uses expandTrigger="hover".
 * The final column contains visually similar leaves: "Password change",
 * "Password reset", "Passwordless login". Select Policies / Access / Password reset,
 * then click "Save policy".
 *
 * Success: path equals [Policies, Access, Password reset], "Save policy" clicked.
 */

import React, { useState, useRef } from 'react';
import { Card, Cascader, Button, Switch, ConfigProvider, theme } from 'antd';
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
          { value: 'password-change', label: 'Password change' },
          { value: 'password-reset', label: 'Password reset' },
          { value: 'passwordless-login', label: 'Passwordless login' },
          { value: 'session-timeout', label: 'Session timeout' },
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
          { value: 'escalation', label: 'Escalation' },
        ],
      },
    ],
  },
];

const TARGET_PATH = ['policies', 'access', 'password-reset'];

export default function T16({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string[]>([]);
  const successFired = useRef(false);

  const handleSave = () => {
    if (!successFired.current && pathEquals(value, TARGET_PATH)) {
      successFired.current = true;
      onSuccess();
    }
  };

  return (
    <ConfigProvider
      theme={{ algorithm: theme.darkAlgorithm }}
      componentSize="small"
    >
      <div style={{ background: '#141414', minHeight: '100vh', padding: 24 }}>
        <Card
          title="Security Policies"
          style={{ width: 420, margin: '20px 0 0 80px', background: '#1f1f1f', borderColor: '#333' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 500 }}>Enforce MFA</span>
            <Switch defaultChecked size="small" />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span style={{ fontSize: 12, fontWeight: 500 }}>Audit logging</span>
            <Switch defaultChecked size="small" />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 4, fontWeight: 500, fontSize: 13 }}>
              Policy path
            </label>
            <Cascader
              style={{ width: '100%' }}
              options={options}
              value={value}
              onChange={(val) => setValue(val as string[])}
              placeholder="Hover to navigate"
              expandTrigger="hover"
            />
          </div>
          <Button type="primary" style={{ marginTop: 16 }} onClick={handleSave}>
            Save policy
          </Button>
        </Card>
      </div>
    </ConfigProvider>
  );
}
