'use client';

/**
 * radio_group-antd-T03: Invoices: match delivery method to the example
 *
 * A centered isolated card titled "Invoices" shows a short instruction row at the top: "Example: Email PDF" with a small envelope icon.
 * Below it is one Ant Design Radio.Group labeled "Invoice delivery" with three options:
 * - Email PDF
 * - Paper mail
 * - No invoice
 * Initial state: "Paper mail" is selected.
 * To the right of the radio group is a non-interactive preview tile that repeats the example (envelope icon + the text "Email PDF").
 * There is no Save button; selecting an option updates a read-only "Delivery method" summary line immediately.
 * No other instances of radio_group are present.
 *
 * Success: The "Invoice delivery" Radio.Group selected value equals "email_pdf" (label "Email PDF").
 */

import React, { useState } from 'react';
import { Card, Radio, Typography, Space } from 'antd';
import type { RadioChangeEvent } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

const options = [
  { label: 'Email PDF', value: 'email_pdf' },
  { label: 'Paper mail', value: 'paper_mail' },
  { label: 'No invoice', value: 'no_invoice' },
];

export default function T03({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string>('paper_mail');

  const handleChange = (e: RadioChangeEvent) => {
    const value = e.target.value;
    setSelected(value);
    if (value === 'email_pdf') {
      onSuccess();
    }
  };

  const selectedLabel = options.find(o => o.value === selected)?.label || '';

  return (
    <Card title="Invoices" style={{ width: 480 }}>
      {/* Example row */}
      <div style={{ 
        padding: '12px 16px', 
        background: '#e6f7ff', 
        borderRadius: 4, 
        marginBottom: 16,
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }}>
        <MailOutlined style={{ color: '#1890ff' }} />
        <Text strong>Example: Email PDF</Text>
      </div>

      <div style={{ display: 'flex', gap: 24 }}>
        <div style={{ flex: 1 }}>
          <Text strong style={{ display: 'block', marginBottom: 12 }}>Invoice delivery</Text>
          <Radio.Group
            data-canonical-type="radio_group"
            data-selected-value={selected}
            value={selected}
            onChange={handleChange}
          >
            <Space direction="vertical">
              {options.map(option => (
                <Radio key={option.value} value={option.value}>
                  {option.label}
                </Radio>
              ))}
            </Space>
          </Radio.Group>
        </div>

        {/* Non-interactive preview tile */}
        <div style={{ 
          padding: '16px 20px', 
          background: '#fafafa', 
          borderRadius: 8,
          border: '1px solid #d9d9d9',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: 120
        }}>
          <MailOutlined style={{ fontSize: 24, color: '#1890ff', marginBottom: 8 }} />
          <Text type="secondary">Email PDF</Text>
        </div>
      </div>

      <div style={{ marginTop: 16, padding: '8px 12px', background: '#f5f5f5', borderRadius: 4 }}>
        <Text type="secondary">Delivery method: {selectedLabel}</Text>
      </div>
    </Card>
  );
}
