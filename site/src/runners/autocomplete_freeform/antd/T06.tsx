'use client';

/**
 * autocomplete_freeform-antd-T06: Set Billing city when two autocompletes are present
 *
 * setup_description:
 * A centered isolated card titled "Address" contains two stacked Ant Design AutoComplete inputs.
 *
 * Instance 1 is labeled "Shipping city" with placeholder "Type shipping city".
 * Instance 2 is labeled "Billing city" with placeholder "Type billing city".
 *
 * Both AutoCompletes use the same suggestion set of US cities (Austin, Atlanta, Boston, Chicago, Denver). The dropdown opens on typing, but selecting from suggestions is optional.
 *
 * Initial state: both fields are empty. Distractors: none outside the two similar AutoComplete controls. Feedback: the entered text is visible in the chosen field.
 *
 * Success: The AutoComplete labeled "Billing city" has displayed value "Austin" (after trimming whitespace). Case-insensitive.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, AutoComplete, Typography, Space } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

const cities = [
  { value: 'Austin' },
  { value: 'Atlanta' },
  { value: 'Boston' },
  { value: 'Chicago' },
  { value: 'Denver' },
];

export default function T06({ onSuccess }: TaskComponentProps) {
  const [shippingCity, setShippingCity] = useState('');
  const [billingCity, setBillingCity] = useState('');
  const successFired = useRef(false);

  const normalizedBillingCity = billingCity.trim().toLowerCase();
  const targetValue = 'austin';

  useEffect(() => {
    if (!successFired.current && normalizedBillingCity === targetValue) {
      successFired.current = true;
      onSuccess();
    }
  }, [normalizedBillingCity, onSuccess]);

  return (
    <Card title="Address" style={{ width: 400 }}>
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        <div>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>Shipping city</Text>
          <AutoComplete
            data-testid="shipping-city"
            style={{ width: '100%' }}
            options={cities}
            placeholder="Type shipping city"
            value={shippingCity}
            onChange={(newValue) => setShippingCity(newValue)}
            filterOption={(inputValue, option) =>
              option!.value.toLowerCase().includes(inputValue.toLowerCase())
            }
          />
        </div>
        <div>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>Billing city</Text>
          <AutoComplete
            data-testid="billing-city"
            style={{ width: '100%' }}
            options={cities}
            placeholder="Type billing city"
            value={billingCity}
            onChange={(newValue) => setBillingCity(newValue)}
            filterOption={(inputValue, option) =>
              option!.value.toLowerCase().includes(inputValue.toLowerCase())
            }
          />
        </div>
      </Space>
    </Card>
  );
}
