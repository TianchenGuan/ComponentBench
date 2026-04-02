'use client';

/**
 * segmented_control-antd-T09: SMS frequency → Weekly (3 instances)
 *
 * Layout: form section titled "Notification frequencies".
 * Three Ant Design Segmented controls are shown with very similar structure:
 * - "Email frequency" options: Never / Daily / Weekly (initial: Daily)
 * - "SMS frequency" options: Never / Daily / Weekly (initial: Never)
 * - "Push frequency" options: Never / Daily / Weekly (initial: Daily)
 *
 * The segmented controls are stacked with consistent spacing and identical option labels,
 * increasing the chance of selecting the wrong instance.
 *
 * Clutter (low): a short paragraph describes what each channel means, but there are no other required inputs.
 * Changes apply immediately; no confirmation.
 *
 * Success: The segmented control labeled "SMS frequency" has selected value = Weekly.
 * Modifying Email or Push frequency instead must not count as success.
 */

import React, { useState } from 'react';
import { Card, Typography, Space } from 'antd';
import { Segmented } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text, Paragraph } = Typography;

const frequencyOptions = ['Never', 'Daily', 'Weekly'];

export default function T09({ onSuccess }: TaskComponentProps) {
  const [emailFreq, setEmailFreq] = useState<string>('Daily');
  const [smsFreq, setSmsFreq] = useState<string>('Never');
  const [pushFreq, setPushFreq] = useState<string>('Daily');

  const handleEmailChange = (value: string | number) => {
    setEmailFreq(String(value));
    // No success for email
  };

  const handleSmsChange = (value: string | number) => {
    const val = String(value);
    setSmsFreq(val);
    if (val === 'Weekly') {
      onSuccess();
    }
  };

  const handlePushChange = (value: string | number) => {
    setPushFreq(String(value));
    // No success for push
  };

  return (
    <Card title="Notification frequencies" style={{ width: 450 }}>
      <Paragraph type="secondary" style={{ marginBottom: 16 }}>
        Choose how often you want to receive notifications through each channel.
        Email for important updates, SMS for urgent alerts, and push for real-time notifications.
      </Paragraph>

      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>Email frequency</Text>
          <Segmented
            data-testid="seg-email-freq"
            data-canonical-type="segmented_control"
            data-selected-value={emailFreq}
            options={frequencyOptions}
            value={emailFreq}
            onChange={handleEmailChange}
          />
        </div>

        <div>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>SMS frequency</Text>
          <Segmented
            data-testid="seg-sms-freq"
            data-canonical-type="segmented_control"
            data-selected-value={smsFreq}
            options={frequencyOptions}
            value={smsFreq}
            onChange={handleSmsChange}
          />
        </div>

        <div>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>Push frequency</Text>
          <Segmented
            data-testid="seg-push-freq"
            data-canonical-type="segmented_control"
            data-selected-value={pushFreq}
            options={frequencyOptions}
            value={pushFreq}
            onChange={handlePushChange}
          />
        </div>
      </Space>
    </Card>
  );
}
