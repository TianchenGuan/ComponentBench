'use client';

/**
 * masked_input-antd-T06: Match membership ID from reference badge
 * 
 * Dark theme isolated card centered in the viewport titled "Loyalty program".
 * At the top of the card there is a prominent reference badge displaying the target Membership ID (formatted like "AB-1234-XZ").
 * Below it is one masked Ant Design Input labeled "Membership ID" with a mask that enforces two letters, a dash, four digits, a dash, and two letters.
 * The field starts empty and automatically uppercases letters. There are no other masked inputs and no apply/submit step.
 * 
 * Success: The "Membership ID" masked input equals "AB-5731-XZ".
 */

import React, { useState, useEffect } from 'react';
import { Card, Typography, Tag } from 'antd';
import { IMaskInput } from 'react-imask';
import type { TaskComponentProps } from '../types';

const { Text, Title } = Typography;

export default function T06({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');
  const targetId = 'AB-5731-XZ';

  useEffect(() => {
    if (value === targetId) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card 
      title="Loyalty program" 
      style={{ width: 400, background: '#1f1f1f', borderColor: '#303030' }}
      headStyle={{ color: '#fff', borderColor: '#303030' }}
    >
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <Text type="secondary" style={{ display: 'block', marginBottom: 8, color: '#888' }}>
          Reference badge:
        </Text>
        <Tag 
          color="blue" 
          style={{ 
            fontSize: 20, 
            padding: '8px 16px', 
            fontWeight: 600,
            fontFamily: 'monospace',
          }}
          data-testid="reference-badge"
        >
          {targetId}
        </Tag>
      </div>
      <div style={{ marginBottom: 8 }}>
        <label htmlFor="membership-id" style={{ fontWeight: 500, marginBottom: 4, display: 'block', color: '#fff' }}>
          Membership ID
        </label>
        <IMaskInput
          id="membership-id"
          mask="aa-0000-aa"
          definitions={{
            'a': /[A-Za-z]/,
            '0': /[0-9]/
          }}
          prepare={(str: string) => str.toUpperCase()}
          placeholder="AA-####-AA"
          value={value}
          onAccept={(val: string) => setValue(val)}
          data-testid="membership-id"
          style={{
            width: '100%',
            padding: '4px 11px',
            fontSize: 14,
            lineHeight: '1.5714285714285714',
            border: '1px solid #434343',
            borderRadius: 6,
            outline: 'none',
            background: '#141414',
            color: '#fff',
            fontFamily: 'monospace',
          }}
        />
      </div>
    </Card>
  );
}
