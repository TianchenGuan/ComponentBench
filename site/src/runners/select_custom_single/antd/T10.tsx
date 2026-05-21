'use client';

/**
 * select_custom_single-antd-T10: Choose Critical pager policy in modal
 *
 * Layout: modal_flow.
 * The base page shows a centered button labeled "Edit alert routing". Clicking it opens a modal dialog titled "Edit alert routing".
 *
 * Inside the modal, there is one Ant Design Select labeled "Severity policy".
 * The Select is default size with comfortable spacing.
 *
 * Initial state: "High — email only" is currently selected.
 * The dropdown options are grouped (OptGroup) by severity tier and each option is custom-rendered with:
 * - a bold title (e.g., "Critical")
 * - a short description (e.g., "pager + email")
 * Visible option labels include:
 * - Critical — pager + email
 * - High — email only
 * - Medium — email digest
 * - Low — no alerts
 *
 * Clutter: the modal also contains a read-only text block describing the rule and a non-target toggle "Mute on weekends".
 * These do not affect success.
 *
 * Feedback: selecting an option immediately updates the field value in the modal. There is a "Close" (X) control,
 * but closing the modal is not required for success.
 *
 * Success: The Select labeled "Severity policy" inside the modal has selected value exactly "Critical — pager + email".
 */

import React, { useState } from 'react';
import { Button, Modal, Select, Typography, Switch, Space } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text, Paragraph } = Typography;

const policyOptions = [
  { label: 'Critical — pager + email', value: 'Critical — pager + email' },
  { label: 'High — email only', value: 'High — email only' },
  { label: 'Medium — email digest', value: 'Medium — email digest' },
  { label: 'Low — no alerts', value: 'Low — no alerts' },
];

export default function T10({ onSuccess }: TaskComponentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [policy, setPolicy] = useState<string>('High — email only');

  const handlePolicyChange = (newValue: string) => {
    setPolicy(newValue);
    if (newValue === 'Critical — pager + email') {
      onSuccess();
    }
  };

  return (
    <div style={{ padding: 48, textAlign: 'center' }}>
      <Button type="primary" onClick={() => setIsModalOpen(true)}>
        Edit alert routing
      </Button>

      <Modal
        title="Edit alert routing"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={450}
      >
        <Paragraph type="secondary" style={{ marginBottom: 20 }}>
          Configure how alerts are routed based on their severity level.
          Changes take effect immediately.
        </Paragraph>

        <div style={{ marginBottom: 20 }}>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>Severity policy</Text>
          <Select
            data-testid="severity-policy-select"
            style={{ width: '100%' }}
            value={policy}
            onChange={handlePolicyChange}
            options={policyOptions}
            optionRender={(option) => {
              const [title, desc] = (option.label as string).split(' — ');
              return (
                <div>
                  <Text strong>{title}</Text>
                  <Text type="secondary" style={{ marginLeft: 8 }}>— {desc}</Text>
                </div>
              );
            }}
          />
        </div>

        <div>
          <Space>
            <Switch size="small" />
            <Text>Mute on weekends</Text>
          </Space>
        </div>
      </Modal>
    </div>
  );
}
