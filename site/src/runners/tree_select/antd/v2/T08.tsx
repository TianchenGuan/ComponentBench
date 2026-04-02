'use client';

/**
 * tree_select-antd-v2-T08: Nested-scroll long policy selector with final leaf confirmation
 *
 * Nested-scroll layout with a deep scrollable popup tree. Policy path TreeSelect contains
 * Handbook > Security > Access > VPN > many siblings including "Rotate keys" near the bottom.
 * Click "Apply policy" to commit.
 *
 * Success: value = handbook-security-access-vpn-rotate-keys, Apply clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, TreeSelect, Button, Typography, Space, Tag } from 'antd';
import type { TaskComponentProps } from '../../types';

const { Text } = Typography;

const policyTree = [
  {
    value: 'handbook', title: 'Handbook', selectable: false, children: [
      {
        value: 'handbook-security', title: 'Security', selectable: false, children: [
          {
            value: 'handbook-security-access', title: 'Access', selectable: false, children: [
              {
                value: 'handbook-security-access-vpn', title: 'VPN', selectable: false, children: [
                  { value: 'handbook-security-access-vpn-issue-token', title: 'Issue token' },
                  { value: 'handbook-security-access-vpn-revoke-token', title: 'Revoke token' },
                  { value: 'handbook-security-access-vpn-session-mgmt', title: 'Session mgmt' },
                  { value: 'handbook-security-access-vpn-policy-update', title: 'Policy update' },
                  { value: 'handbook-security-access-vpn-audit-logs', title: 'Audit logs' },
                  { value: 'handbook-security-access-vpn-rotate-keys', title: 'Rotate keys' },
                ],
              },
              {
                value: 'handbook-security-access-ssh', title: 'SSH', selectable: false, children: [
                  { value: 'handbook-security-access-ssh-keygen', title: 'Key generation' },
                  { value: 'handbook-security-access-ssh-agent', title: 'Agent config' },
                ],
              },
            ],
          },
          {
            value: 'handbook-security-data', title: 'Data Handling', selectable: false, children: [
              { value: 'handbook-security-data-encryption', title: 'Encryption' },
              { value: 'handbook-security-data-retention', title: 'Retention' },
            ],
          },
        ],
      },
      {
        value: 'handbook-it', title: 'IT', selectable: false, children: [
          { value: 'handbook-it-devices', title: 'Devices' },
          { value: 'handbook-it-software', title: 'Software' },
        ],
      },
      {
        value: 'handbook-hr', title: 'HR', selectable: false, children: [
          { value: 'handbook-hr-onboarding', title: 'Onboarding' },
          { value: 'handbook-hr-offboarding', title: 'Offboarding' },
        ],
      },
    ],
  },
];

export default function T08({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string | undefined>(undefined);
  const [committed, setCommitted] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (committed && value === 'handbook-security-access-vpn-rotate-keys') {
      successFired.current = true;
      onSuccess();
    }
  }, [committed, value, onSuccess]);

  return (
    <div style={{ padding: 16, height: '150vh' }}>
      <div style={{ maxWidth: 440, margin: '40px auto' }}>
        <Text strong style={{ fontSize: 16, display: 'block', marginBottom: 8 }}>Policy Review</Text>
        <Space style={{ marginBottom: 12 }}>
          <Tag>Compliance</Tag>
          <Tag color="orange">Pending review</Tag>
        </Space>
        <Card title="Policy Selector" size="small">
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
              <Text strong style={{ display: 'block', marginBottom: 4 }}>Policy path</Text>
              <TreeSelect
                size="small"
                style={{ width: '100%' }}
                value={value}
                onChange={(val) => { setValue(val); setCommitted(false); }}
                treeData={policyTree}
                placeholder="Select policy path"
                showSearch={false}
                dropdownStyle={{ maxHeight: 280, overflow: 'auto' }}
              />
            </div>
            <Button type="primary" size="small" onClick={() => setCommitted(true)}>Apply policy</Button>
          </Space>
        </Card>
      </div>
    </div>
  );
}
