'use client';

/**
 * autocomplete_restricted-antd-T06: Choose shipping carrier among two selects
 *
 * setup_description:
 * The page is a centered "Delivery options" card with **two** Ant Design Select components of the same type:
 * 1) **Billing carrier** (Select)
 * 2) **Shipping carrier** (Select)  ← target
 *
 * Both are options-only selects (restricted), default size, comfortable spacing, light theme.
 * - Initial state: Billing carrier is set to "UPS Ground"; Shipping carrier is empty (placeholder "Choose a carrier").
 * - Each Select opens a dropdown with overlapping carrier names: UPS Ground, UPS Next Day, FedEx, FedEx Express Saver, DHL Express, USPS.
 * - No Save/Apply button; selection commits immediately.
 *
 * The two selects are stacked vertically with similar styling, so the agent must disambiguate by label and modify **Shipping carrier** only.
 *
 * Success: The "Shipping carrier" Select has selected value "DHL Express".
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, Select, Typography, Space } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

const carriers = [
  { label: 'UPS Ground', value: 'UPS Ground' },
  { label: 'UPS Next Day', value: 'UPS Next Day' },
  { label: 'FedEx', value: 'FedEx' },
  { label: 'FedEx Express Saver', value: 'FedEx Express Saver' },
  { label: 'DHL Express', value: 'DHL Express' },
  { label: 'USPS', value: 'USPS' },
];

export default function T06({ onSuccess }: TaskComponentProps) {
  const [billingCarrier, setBillingCarrier] = useState<string>('UPS Ground');
  const [shippingCarrier, setShippingCarrier] = useState<string | undefined>(undefined);
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && shippingCarrier === 'DHL Express') {
      successFired.current = true;
      onSuccess();
    }
  }, [shippingCarrier, onSuccess]);

  return (
    <Card title="Delivery options" style={{ width: 400 }}>
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        <div>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>Billing carrier</Text>
          <Select
            data-testid="billing-carrier-select"
            style={{ width: '100%' }}
            value={billingCarrier}
            onChange={(newValue) => setBillingCarrier(newValue)}
            options={carriers}
          />
        </div>

        <div>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>Shipping carrier</Text>
          <Select
            data-testid="shipping-carrier-select"
            style={{ width: '100%' }}
            placeholder="Choose a carrier"
            value={shippingCarrier}
            onChange={(newValue) => setShippingCarrier(newValue)}
            options={carriers}
          />
        </div>
      </Space>
    </Card>
  );
}
