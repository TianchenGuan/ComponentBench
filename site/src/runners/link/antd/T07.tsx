'use client';

/**
 * link-antd-T07: Reset Billing Preferences using the correct reset link
 * 
 * setup_description:
 * A settings_panel layout shows two stacked sections with bordered headers:
 * - "Billing Preferences"
 * - "Shipping Preferences"
 * 
 * Each section contains a few read-only setting rows and an Ant Design Typography.Link
 * on the right side of the section header labeled "Reset to defaults". Both reset links
 * have identical text and styling.
 * 
 * Initial state: Billing Preferences are marked as "Customized" with a small status pill.
 * Shipping Preferences are already at default. Therefore, the Billing reset link is
 * enabled (aria-disabled="false"), while the Shipping reset link is disabled
 * (aria-disabled="true") and visually muted.
 * 
 * success_trigger:
 * - The Billing Preferences reset link (data-testid="reset-billing") was activated.
 * - After activation, the Billing reset link has aria-disabled="true" (disabled).
 * - The Billing section status reads "Default".
 */

import React, { useState } from 'react';
import { Card, Typography, Tag } from 'antd';
import type { TaskComponentProps } from '../types';

const { Link, Text } = Typography;

interface SectionProps {
  title: string;
  status: 'Customized' | 'Default';
  onReset: () => void;
  disabled: boolean;
  testId: string;
  settings: { label: string; value: string }[];
}

function SettingsSection({ title, status, onReset, disabled, testId, settings }: SectionProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!disabled) {
      onReset();
    }
  };

  return (
    <div style={{ 
      border: '1px solid #f0f0f0', 
      borderRadius: 8, 
      marginBottom: 16,
      overflow: 'hidden',
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '12px 16px',
        background: '#fafafa',
        borderBottom: '1px solid #f0f0f0',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Text strong>{title}</Text>
          <Tag color={status === 'Customized' ? 'blue' : 'default'} data-testid={`${testId}-status`}>
            {status}
          </Tag>
        </div>
        <Link
          onClick={handleClick}
          data-testid={testId}
          aria-disabled={disabled}
          style={{ 
            cursor: disabled ? 'not-allowed' : 'pointer',
            color: disabled ? '#d9d9d9' : undefined,
            pointerEvents: disabled ? 'none' : 'auto',
          }}
        >
          Reset to defaults
        </Link>
      </div>
      <div style={{ padding: 16 }}>
        {settings.map((setting, index) => (
          <div key={index} style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            padding: '8px 0',
            borderBottom: index < settings.length - 1 ? '1px solid #f0f0f0' : 'none',
          }}>
            <Text type="secondary">{setting.label}</Text>
            <Text>{setting.value}</Text>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function T07({ onSuccess }: TaskComponentProps) {
  const [billingStatus, setBillingStatus] = useState<'Customized' | 'Default'>('Customized');

  const handleBillingReset = () => {
    if (billingStatus === 'Customized') {
      setBillingStatus('Default');
      onSuccess();
    }
  };

  return (
    <Card title="Settings" style={{ width: 500 }}>
      <SettingsSection
        title="Billing Preferences"
        status={billingStatus}
        onReset={handleBillingReset}
        disabled={billingStatus === 'Default'}
        testId="reset-billing"
        settings={[
          { label: 'Invoice format', value: 'PDF' },
          { label: 'Payment method', value: 'Credit Card' },
          { label: 'Auto-pay', value: 'Enabled' },
        ]}
      />
      <SettingsSection
        title="Shipping Preferences"
        status="Default"
        onReset={() => {}}
        disabled={true}
        testId="reset-shipping"
        settings={[
          { label: 'Shipping speed', value: 'Standard' },
          { label: 'Carrier', value: 'Any' },
        ]}
      />
    </Card>
  );
}
