'use client';

/**
 * combobox_editable_single-antd-T04: Choose Visa as payment method
 *
 * A single isolated card titled "Checkout" is centered in the viewport.
 * It contains one editable combobox labeled "Payment method" implemented with Ant Design AutoComplete.
 * - Scene: isolated_card, center placement, light theme, comfortable spacing, default scale.
 * - Component behavior: The dropdown opens on focus/click. User can type to filter or directly click an option.
 * - Options: Visa, Mastercard, American Express, Discover.
 * - Initial state: empty.
 * - Distractors: a non-interactive order summary paragraph under the field.
 *
 * Success: The "Payment method" combobox value equals "Visa".
 */

import React, { useState } from 'react';
import { Card, AutoComplete, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text, Paragraph } = Typography;

const options = [
  { value: 'Visa' },
  { value: 'Mastercard' },
  { value: 'American Express' },
  { value: 'Discover' },
];

export default function T04({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');

  const handleSelect = (selectedValue: string) => {
    setValue(selectedValue);
    if (selectedValue === 'Visa') {
      onSuccess();
    }
  };

  const handleBlur = () => {
    if (value === 'Visa') {
      onSuccess();
    }
  };

  return (
    <Card title="Checkout" style={{ width: 400 }}>
      <Text strong style={{ display: 'block', marginBottom: 8 }}>Payment method</Text>
      <AutoComplete
        data-testid="payment-method"
        style={{ width: '100%' }}
        options={options}
        placeholder="Select payment method"
        value={value}
        onChange={setValue}
        onSelect={handleSelect}
        onBlur={handleBlur}
        filterOption={(inputValue, option) =>
          option!.value.toLowerCase().includes(inputValue.toLowerCase())
        }
      />
      <Paragraph style={{ marginTop: 16, color: '#888', fontSize: 12 }}>
        Order Summary: 3 items, Total: $125.00
      </Paragraph>
    </Card>
  );
}
