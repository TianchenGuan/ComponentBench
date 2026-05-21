'use client';

/**
 * radio_group-antd-T05: Billing form: set Billing cycle to Annual (two groups)
 *
 * A form_section layout titled "Account setup" is centered in the viewport. The section contains several typical form fields as distractors (a disabled Name input and a read-only Email field).
 * There are TWO Ant Design Radio.Group components stacked with clear labels:
 * 1) "Billing cycle" with options: Monthly, Annual
 * 2) "Support level" with options: Standard, Priority
 * Initial state: Billing cycle = Monthly; Support level = Standard.
 * No Save button is present; each group updates an inline value chip on change.
 * Both groups use identical radio styling and are visually close together, increasing the chance of changing the wrong one.
 *
 * Success: For the radio group labeled "Billing cycle", the selected value equals "annual" (label "Annual").
 */

import React, { useState } from 'react';
import { Card, Radio, Typography, Input, Tag, Space, Divider } from 'antd';
import type { RadioChangeEvent } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

export default function T05({ onSuccess }: TaskComponentProps) {
  const [billingCycle, setBillingCycle] = useState<string>('monthly');
  const [supportLevel, setSupportLevel] = useState<string>('standard');

  const handleBillingChange = (e: RadioChangeEvent) => {
    const value = e.target.value;
    setBillingCycle(value);
    if (value === 'annual') {
      onSuccess();
    }
  };

  const handleSupportChange = (e: RadioChangeEvent) => {
    setSupportLevel(e.target.value);
  };

  return (
    <Card title="Account setup" style={{ width: 420 }}>
      {/* Distractor fields */}
      <div style={{ marginBottom: 16 }}>
        <Text strong style={{ display: 'block', marginBottom: 4 }}>Name</Text>
        <Input disabled value="John Doe" />
      </div>
      <div style={{ marginBottom: 16 }}>
        <Text strong style={{ display: 'block', marginBottom: 4 }}>Email</Text>
        <Input readOnly value="john@example.com" />
      </div>

      <Divider />

      {/* Billing cycle group */}
      <div style={{ marginBottom: 16 }} data-instance="Billing cycle">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <Text strong>Billing cycle</Text>
          <Tag>{billingCycle === 'monthly' ? 'Monthly' : 'Annual'}</Tag>
        </div>
        <Radio.Group
          data-canonical-type="radio_group"
          data-selected-value={billingCycle}
          value={billingCycle}
          onChange={handleBillingChange}
        >
          <Space direction="vertical">
            <Radio value="monthly">Monthly</Radio>
            <Radio value="annual">Annual</Radio>
          </Space>
        </Radio.Group>
      </div>

      {/* Support level group */}
      <div data-instance="Support level">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <Text strong>Support level</Text>
          <Tag>{supportLevel === 'standard' ? 'Standard' : 'Priority'}</Tag>
        </div>
        <Radio.Group
          data-canonical-type="radio_group"
          data-selected-value={supportLevel}
          value={supportLevel}
          onChange={handleSupportChange}
        >
          <Space direction="vertical">
            <Radio value="standard">Standard</Radio>
            <Radio value="priority">Priority</Radio>
          </Space>
        </Radio.Group>
      </div>
    </Card>
  );
}
