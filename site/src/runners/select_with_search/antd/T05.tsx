'use client';

/**
 * select_with_search-antd-T05: Set Billing country to Japan (two selects)
 *
 * Layout: form_section centered titled "Address".
 * Two Ant Design Select components of the same type are present:
 *  1) "Shipping country" (left column)
 *  2) "Billing country" (right column) ← TARGET
 * Both Selects use showSearch and share the same option set: United States, Canada, Mexico, United Kingdom, Germany, Japan, Australia.
 * Initial state:
 *  - Shipping country: "United States" selected
 *  - Billing country: empty (placeholder "Select a country")
 * Clutter (low): The form also shows non-target inputs (Name, Street, City) but they do not affect success.
 * Interaction: clicking a Select opens its dropdown popover with a search field for filtering options.
 *
 * Success: The selected value of the "Billing country" Select equals "Japan".
 */

import React, { useState } from 'react';
import { Card, Select, Typography, Row, Col, Input, Form } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

const countryOptions = [
  { value: 'United States', label: 'United States' },
  { value: 'Canada', label: 'Canada' },
  { value: 'Mexico', label: 'Mexico' },
  { value: 'United Kingdom', label: 'United Kingdom' },
  { value: 'Germany', label: 'Germany' },
  { value: 'Japan', label: 'Japan' },
  { value: 'Australia', label: 'Australia' },
];

export default function T05({ onSuccess }: TaskComponentProps) {
  const [shippingCountry, setShippingCountry] = useState<string>('United States');
  const [billingCountry, setBillingCountry] = useState<string | undefined>(undefined);

  const handleBillingChange = (newValue: string) => {
    setBillingCountry(newValue);
    if (newValue === 'Japan') {
      onSuccess();
    }
  };

  return (
    <Card title="Address" style={{ width: 600 }}>
      <Form layout="vertical">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Name">
              <Input defaultValue="John Doe" readOnly />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Street">
              <Input defaultValue="123 Main St" readOnly />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="City">
              <Input defaultValue="New York" readOnly />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Text strong style={{ display: 'block', marginBottom: 8 }}>Shipping country</Text>
            <Select
              data-testid="shipping-country-select"
              showSearch
              style={{ width: '100%' }}
              value={shippingCountry}
              onChange={setShippingCountry}
              options={countryOptions}
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
            />
          </Col>
          <Col span={12}>
            <Text strong style={{ display: 'block', marginBottom: 8 }}>Billing country</Text>
            <Select
              data-testid="billing-country-select"
              showSearch
              style={{ width: '100%' }}
              placeholder="Select a country"
              value={billingCountry}
              onChange={handleBillingChange}
              options={countryOptions}
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
            />
          </Col>
        </Row>
      </Form>
    </Card>
  );
}
