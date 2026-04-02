'use client';

/**
 * masked_input-mantine-T05: Match employee ID from badge
 * 
 * Dark theme isolated card centered in the viewport titled "HR onboarding".
 * A bold badge near the top displays the target employee ID formatted like "EMP-2048".
 * Below it is one masked Mantine TextInput labeled "Employee ID" with a fixed "EMP-####" pattern; the "EMP-" prefix is shown as part of the input value and the digits are typed into the remaining slots.
 * The field starts empty (or shows just the prefix, depending on implementation) and there is no submit/apply step.
 * 
 * Success: The "Employee ID" masked input equals "EMP-2048".
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Badge } from '@mantine/core';
import { IMaskInput } from 'react-imask';
import type { TaskComponentProps } from '../types';

export default function T05({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');
  const targetId = 'EMP-2048';

  useEffect(() => {
    if (value === targetId) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card 
      shadow="sm" 
      padding="lg" 
      radius="md" 
      withBorder 
      style={{ width: 400, background: '#1f1f1f', borderColor: '#303030' }}
    >
      <Text fw={600} size="lg" mb="md" style={{ color: '#fff' }}>HR onboarding</Text>
      
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <Text size="sm" c="dimmed" mb="xs">Reference badge:</Text>
        <Badge 
          size="xl" 
          radius="sm" 
          variant="filled"
          data-testid="reference-badge"
          style={{ fontFamily: 'monospace', fontSize: 18, padding: '12px 16px' }}
        >
          {targetId}
        </Badge>
      </div>
      
      <div style={{ marginBottom: 8 }}>
        <Text component="label" htmlFor="employee-id" fw={500} size="sm" mb={4} style={{ display: 'block', color: '#fff' }}>
          Employee ID
        </Text>
        <IMaskInput
          id="employee-id"
          mask="EMP-0000"
          definitions={{
            '0': /[0-9]/
          }}
          placeholder="EMP-____"
          value={value}
          onAccept={(val: string) => setValue(val)}
          data-testid="employee-id"
          style={{
            width: '100%',
            padding: '8px 12px',
            fontSize: 14,
            lineHeight: 1.55,
            border: '1px solid #434343',
            borderRadius: 4,
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
