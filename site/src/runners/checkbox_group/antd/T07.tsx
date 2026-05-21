'use client';

/**
 * checkbox_group-antd-T07: Set Account emails preferences (two groups)
 *
 * Scene: light theme; comfortable spacing; a form section centered in the viewport; instances=2.
 * Ant Design page in a light theme showing a "Communication preferences" form section (not a modal).
 * The section contains two Checkbox.Group instances with similar styling:
 * 1) "Account emails" (target group)
 *    Options: Security alerts (checked), Billing receipts (unchecked), Weekly summary (unchecked), Product updates (unchecked)
 * 2) "Marketing emails" (distractor group)
 *    Options: Promotions (checked), Events (unchecked), Surveys (unchecked)
 * Other low-clutter form elements appear above the groups (disabled email input, non-functional link).
 * Success: In the 'Account emails' group, exactly Weekly summary and Product updates are checked.
 */

import React, { useState, useEffect } from 'react';
import { Card, Checkbox, Typography, Input, Divider } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text, Title, Link } = Typography;

const accountEmailOptions = ['Security alerts', 'Billing receipts', 'Weekly summary', 'Product updates'];
const marketingEmailOptions = ['Promotions', 'Events', 'Surveys'];

export default function T07({ onSuccess }: TaskComponentProps) {
  const [accountEmails, setAccountEmails] = useState<string[]>(['Security alerts']);
  const [marketingEmails, setMarketingEmails] = useState<string[]>(['Promotions']);

  useEffect(() => {
    const targetSet = new Set(['Weekly summary', 'Product updates']);
    const currentSet = new Set(accountEmails);
    if (currentSet.size === targetSet.size && Array.from(targetSet).every(v => currentSet.has(v))) {
      onSuccess();
    }
  }, [accountEmails, onSuccess]);

  return (
    <Card style={{ width: 500 }}>
      <Title level={4}>Communication preferences</Title>
      
      {/* Distractor elements */}
      <div style={{ marginBottom: 16 }}>
        <Text strong style={{ display: 'block', marginBottom: 8 }}>Email address</Text>
        <Input value="user@example.com" disabled style={{ maxWidth: 300 }} />
        <div style={{ marginTop: 4 }}>
          <Link disabled>Edit profile</Link>
        </div>
      </div>

      <Divider />

      {/* Target group: Account emails */}
      <div style={{ marginBottom: 24 }}>
        <Text strong style={{ display: 'block', marginBottom: 12 }}>Account emails</Text>
        <Checkbox.Group
          data-testid="cg-account-emails"
          value={accountEmails}
          onChange={(checkedValues) => setAccountEmails(checkedValues as string[])}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {accountEmailOptions.map(option => (
              <Checkbox key={option} value={option}>
                {option}
              </Checkbox>
            ))}
          </div>
        </Checkbox.Group>
      </div>

      {/* Distractor group: Marketing emails */}
      <div>
        <Text strong style={{ display: 'block', marginBottom: 12 }}>Marketing emails</Text>
        <Checkbox.Group
          data-testid="cg-marketing-emails"
          value={marketingEmails}
          onChange={(checkedValues) => setMarketingEmails(checkedValues as string[])}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {marketingEmailOptions.map(option => (
              <Checkbox key={option} value={option}>
                {option}
              </Checkbox>
            ))}
          </div>
        </Checkbox.Group>
      </div>
    </Card>
  );
}
