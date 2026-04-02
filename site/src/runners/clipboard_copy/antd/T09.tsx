'use client';

/**
 * clipboard_copy-antd-T09: Copy Billing reference in dark compact panel
 *
 * Layout: settings_panel, centered.
 * Universal factors: theme=dark, spacing=compact, scale=small.
 *
 * The page is a "Checkout settings" panel with two adjacent compact cards in a single column:
 * - Card A: "Billing"
 * - Card B: "Shipping"
 *
 * Each card contains a labeled reference value rendered as small monospace Typography.Text with a copyable icon:
 * - Billing card: "Billing reference" value "BILL-REF-60218"
 * - Shipping card: "Shipping reference" value "SHIP-REF-60218"
 *
 * The copy icons are small and close to the text due to compact spacing. A subtle tooltip "Copied" appears on success.
 *
 * Distractors: a couple of disabled toggles (e.g., "Enable VAT") inside each card; not required.
 * Requirement: instances=2; target instance is the "Billing reference" in the Billing card.
 *
 * Success: Clipboard text equals "BILL-REF-60218".
 */

import React, { useState } from 'react';
import { Card, Typography, Space, Switch } from 'antd';
import type { TaskComponentProps } from '../types';
import { copyToClipboard } from '../types';

const { Text, Title } = Typography;

export default function T09({ task, onSuccess }: TaskComponentProps) {
  const [completed, setCompleted] = useState(false);

  const handleCopyBilling = async () => {
    if (completed) return;
    
    const success = await copyToClipboard('BILL-REF-60218', 'Billing reference');
    if (success) {
      setCompleted(true);
      onSuccess();
    }
  };

  const handleCopyShipping = async () => {
    await copyToClipboard('SHIP-REF-60218', 'Shipping reference');
    // Does not complete the task
  };

  return (
    <div data-testid="checkout-settings-panel">
      <Title level={4} style={{ marginBottom: 16 }}>Checkout settings</Title>
      
      <Space direction="vertical" style={{ width: 350 }} size="small">
        {/* Billing Card */}
        <Card size="small" title="Billing" data-testid="billing-card">
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Text style={{ fontSize: 12 }}>Billing reference:</Text>
              <Text
                copyable={{
                  text: 'BILL-REF-60218',
                  onCopy: handleCopyBilling,
                  tooltips: ['Copy', 'Copied'],
                }}
                code
                style={{ fontFamily: 'monospace', fontSize: 11 }}
                data-testid="copy-billing-reference"
              >
                BILL-REF-60218
              </Text>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontSize: 12 }}>Enable VAT</Text>
              <Switch size="small" disabled />
            </div>
          </Space>
        </Card>

        {/* Shipping Card */}
        <Card size="small" title="Shipping" data-testid="shipping-card">
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Text style={{ fontSize: 12 }}>Shipping reference:</Text>
              <Text
                copyable={{
                  text: 'SHIP-REF-60218',
                  onCopy: handleCopyShipping,
                  tooltips: ['Copy', 'Copied'],
                }}
                code
                style={{ fontFamily: 'monospace', fontSize: 11 }}
                data-testid="copy-shipping-reference"
              >
                SHIP-REF-60218
              </Text>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontSize: 12 }}>Express delivery</Text>
              <Switch size="small" disabled />
            </div>
          </Space>
        </Card>
      </Space>
    </div>
  );
}
