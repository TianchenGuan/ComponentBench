'use client';

/**
 * listbox_multi-antd-T10: Match reference feature chips
 *
 * Layout: isolated_card centered titled "Feature flags".
 * Above the listbox is a small preview row labeled "Reference selection" showing 4 pill-shaped chips with text labels.
 * Target component: a Checkbox.Group multi-select listbox labeled "Feature flags", rendered as a scrollable list of 25 options.
 * The list includes the same labels as chips plus many distractors with similar wording.
 * Initial state: none selected.
 * Guidance: the target set is specified visually by the chips, not by enumerating items in the instruction.
 *
 * Success: The target listbox has exactly: Two-factor authentication, Audit log, SAML SSO, API access.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Checkbox, Space, Typography, Tag } from 'antd';
import type { TaskComponentProps } from '../types';
import { setsEqual } from '../types';

const { Text } = Typography;

const referenceChips = ['Two-factor authentication', 'Audit log', 'SAML SSO', 'API access'];

const options = [
  'Two-factor authentication',
  'Audit log',
  'SAML SSO',
  'API access',
  'API access (legacy)',
  'Single sign-on (OIDC)',
  'Advanced reports',
  'Data export',
  'Custom branding',
  'Team management',
  'Role-based access',
  'Session management',
  'IP allowlisting',
  'Webhooks',
  'Integrations',
  'Mobile app access',
  'Desktop app access',
  'Offline mode',
  'Priority support',
  'Dedicated account manager',
  'SLA guarantees',
  'Compliance reports',
  'Data retention policies',
  'Audit log (extended)',
  'Multi-region support',
];

const targetSet = referenceChips;

export default function T10({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && setsEqual(selected, targetSet)) {
      successFired.current = true;
      onSuccess();
    }
  }, [selected, onSuccess]);

  return (
    <Card title="Feature flags" style={{ width: 500 }}>
      <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
        Feature flags (match the Reference selection).
      </Text>
      <div style={{ marginBottom: 16 }}>
        <Text strong>Reference selection:</Text>
        <div style={{ marginTop: 8 }}>
          {referenceChips.map((chip) => (
            <Tag key={chip} color="blue" style={{ marginBottom: 4 }}>
              {chip}
            </Tag>
          ))}
        </div>
      </div>
      <div style={{ maxHeight: 300, overflowY: 'auto', border: '1px solid #f0f0f0', padding: 12, borderRadius: 4 }}>
        <Checkbox.Group
          data-testid="listbox-feature-flags"
          value={selected}
          onChange={(values) => setSelected(values as string[])}
          style={{ width: '100%' }}
        >
          <Space direction="vertical" style={{ width: '100%' }}>
            {options.map((opt) => (
              <Checkbox key={opt} value={opt} data-value={opt}>
                {opt}
              </Checkbox>
            ))}
          </Space>
        </Checkbox.Group>
      </div>
    </Card>
  );
}
