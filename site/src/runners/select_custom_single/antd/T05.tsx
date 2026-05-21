'use client';

/**
 * select_custom_single-antd-T05: Set Shipping country to Canada
 *
 * Layout: a form_section titled "Checkout address" centered on the page.
 * Spacing is comfortable and components are default size.
 *
 * The form contains two Ant Design Select components of the same type:
 * 1) "Billing country"
 * 2) "Shipping country"
 * Both are closed initially and both currently show "United States".
 *
 * Each dropdown contains a short list of 10 countries and uses custom option rendering:
 * a small flag icon is shown next to the country name (text is still present).
 *
 * Clutter: the same form section also shows standard text inputs for name and street address,
 * plus a non-interactive order summary block on the right. These are distractors and are not required.
 *
 * Feedback: selecting a country applies immediately to the field (no Save/Apply button).
 * The task must modify the Shipping country select, not the Billing country select.
 *
 * Success: The Select labeled "Shipping country" has selected value exactly "Canada".
 */

import React, { useState } from 'react';
import { Card, Select, Typography, Input, Row, Col } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

const countries = [
  { label: '🇺🇸 United States', value: 'United States' },
  { label: '🇨🇦 Canada', value: 'Canada' },
  { label: '🇲🇽 Mexico', value: 'Mexico' },
  { label: '🇬🇧 United Kingdom', value: 'United Kingdom' },
  { label: '🇩🇪 Germany', value: 'Germany' },
  { label: '🇫🇷 France', value: 'France' },
  { label: '🇯🇵 Japan', value: 'Japan' },
  { label: '🇨🇳 China', value: 'China' },
  { label: '🇦🇺 Australia', value: 'Australia' },
  { label: '🇧🇷 Brazil', value: 'Brazil' },
];

export default function T05({ onSuccess }: TaskComponentProps) {
  const [billingCountry, setBillingCountry] = useState<string>('United States');
  const [shippingCountry, setShippingCountry] = useState<string>('United States');

  const handleShippingChange = (newValue: string) => {
    setShippingCountry(newValue);
    if (newValue === 'Canada') {
      onSuccess();
    }
  };

  return (
    <Card title="Checkout address" style={{ width: 600 }}>
      <Row gutter={24}>
        <Col span={16}>
          <div style={{ marginBottom: 16 }}>
            <Text strong style={{ display: 'block', marginBottom: 8 }}>Name</Text>
            <Input placeholder="Full name" />
          </div>
          <div style={{ marginBottom: 16 }}>
            <Text strong style={{ display: 'block', marginBottom: 8 }}>Street address</Text>
            <Input placeholder="123 Main St" />
          </div>
          <div style={{ marginBottom: 16 }}>
            <Text strong style={{ display: 'block', marginBottom: 8 }}>Billing country</Text>
            <Select
              data-testid="billing-country-select"
              style={{ width: '100%' }}
              value={billingCountry}
              onChange={setBillingCountry}
              options={countries}
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <Text strong style={{ display: 'block', marginBottom: 8 }}>Shipping country</Text>
            <Select
              data-testid="shipping-country-select"
              style={{ width: '100%' }}
              value={shippingCountry}
              onChange={handleShippingChange}
              options={countries}
            />
          </div>
        </Col>
        <Col span={8}>
          <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 8 }}>
            <Text strong style={{ display: 'block', marginBottom: 8 }}>Order Summary</Text>
            <Text type="secondary">Subtotal: $99.00</Text><br />
            <Text type="secondary">Shipping: $9.99</Text><br />
            <Text strong>Total: $108.99</Text>
          </div>
        </Col>
      </Row>
    </Card>
  );
}
