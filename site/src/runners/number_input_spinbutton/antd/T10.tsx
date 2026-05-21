'use client';

/**
 * number_input_spinbutton-antd-T10: Enter formatted invoice amount
 * 
 * A centered isolated card titled "Create invoice" contains one Ant Design InputNumber labeled "Invoice amount".
 * The InputNumber is configured with a currency formatter/parser so that:
 * - A leading "$" is shown (USD) and thousands separators are displayed.
 * - Two decimal places are supported (precision=2).
 * - Step is 0.25 (quarter-dollar increments) to encourage decimal handling.
 * Constraints: min=0, max=100000.
 * Initial state: value is formatted as $0.00.
 * A read-only line below shows "Amount due: $0.00" and updates immediately as the number changes; no Save button is required.
 * 
 * Success: The committed numeric value of "Invoice amount" is within ±0.005 of 1250.75.
 */

import React, { useState, useEffect } from 'react';
import { Card, InputNumber, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

export default function T10({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<number | null>(0);

  useEffect(() => {
    if (value !== null && Math.abs(value - 1250.75) < 0.005) {
      onSuccess();
    }
  }, [value, onSuccess]);

  const formatCurrency = (val: number | undefined): string => {
    if (val === undefined || val === null) return '';
    return `$ ${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const parseCurrency = (val: string | undefined): number => {
    if (!val) return 0;
    return parseFloat(val.replace(/\$\s?|(,*)/g, '')) || 0;
  };

  return (
    <Card title="Create invoice" style={{ width: 400 }}>
      <div style={{ marginBottom: 8 }}>
        <label htmlFor="invoice-amount-input" style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>
          Invoice amount
        </label>
        <InputNumber
          id="invoice-amount-input"
          min={0}
          max={100000}
          step={0.25}
          precision={2}
          value={value}
          onChange={(val) => setValue(val)}
          formatter={(val) => formatCurrency(val as number)}
          parser={(val) => parseCurrency(val) as unknown as 0}
          style={{ width: '100%' }}
          data-testid="invoice-amount-input"
        />
        <Text type="secondary" style={{ fontSize: 12, marginTop: 4, display: 'block' }}>
          USD (shows thousands separators)
        </Text>
      </div>
      <Text style={{ fontSize: 14, marginTop: 16, display: 'block' }}>
        Amount due: {formatCurrency(value ?? 0)}
      </Text>
    </Card>
  );
}
