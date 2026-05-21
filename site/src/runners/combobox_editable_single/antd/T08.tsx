'use client';

/**
 * combobox_editable_single-antd-T08: Set Billing city to San José (diacritics + two fields)
 *
 * A compact "Address dashboard" panel is shown with two editable comboboxes.
 * - Scene: dashboard layout, center placement, light theme, compact spacing, default scale.
 * - Instances: 2 AutoComplete fields in two-column layout:
 *   - Left: "Shipping city" (distractor, prefilled with "San Jose")
 *   - Right: "Billing city" (target, empty)
 * - Options include confusable variants: San Jose, San José (accented), San Juan, Santa Rosa, etc.
 * - Distractors: map thumbnail, Refresh/Export buttons.
 *
 * Success: The combobox instance labeled "Billing city" has value exactly "San José" (Unicode-normalized).
 */

import React, { useState } from 'react';
import { Card, AutoComplete, Typography, Button, Row, Col, Space } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text, Title } = Typography;

const cities = [
  { value: 'San Jose' },
  { value: 'San José' },
  { value: 'San Juan' },
  { value: 'Santa Rosa' },
  { value: 'San Diego' },
  { value: 'San Mateo' },
  { value: 'San Marcos' },
  { value: 'Austin' },
  { value: 'Boston' },
  { value: 'Denver' },
  { value: 'Dallas' },
  { value: 'Chicago' },
  { value: 'Portland' },
  { value: 'Seattle' },
  { value: 'Phoenix' },
  { value: 'Miami' },
];

export default function T08({ onSuccess }: TaskComponentProps) {
  const [shippingCity, setShippingCity] = useState('San Jose');
  const [billingCity, setBillingCity] = useState('');

  const handleBillingSelect = (selectedValue: string) => {
    setBillingCity(selectedValue);
    // Unicode NFC normalize for comparison
    if (selectedValue.normalize('NFC') === 'San José'.normalize('NFC')) {
      onSuccess();
    }
  };

  const handleBillingBlur = () => {
    if (billingCity.normalize('NFC') === 'San José'.normalize('NFC')) {
      onSuccess();
    }
  };

  return (
    <Card style={{ width: 600, padding: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>Address dashboard</Title>
        <Space>
          <Button size="small">Refresh</Button>
          <Button size="small">Export</Button>
        </Space>
      </div>

      {/* Map thumbnail placeholder */}
      <div style={{ 
        width: '100%', 
        height: 80, 
        background: '#f0f0f0', 
        marginBottom: 16,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#999',
        fontSize: 12
      }}>
        Map Preview
      </div>

      <Row gutter={16}>
        <Col span={12}>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>Shipping city</Text>
          <AutoComplete
            data-testid="shipping-city"
            style={{ width: '100%' }}
            options={cities}
            placeholder="Select city"
            value={shippingCity}
            onChange={setShippingCity}
            filterOption={(inputValue, option) =>
              option!.value.toLowerCase().includes(inputValue.toLowerCase())
            }
          />
        </Col>
        <Col span={12}>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>Billing city</Text>
          <AutoComplete
            data-testid="billing-city"
            style={{ width: '100%' }}
            options={cities}
            placeholder="Select city"
            value={billingCity}
            onChange={setBillingCity}
            onSelect={handleBillingSelect}
            onBlur={handleBillingBlur}
            filterOption={(inputValue, option) =>
              option!.value.toLowerCase().includes(inputValue.toLowerCase())
            }
          />
        </Col>
      </Row>
    </Card>
  );
}
