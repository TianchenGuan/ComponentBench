'use client';

/**
 * masked_input-mantine-T10: Toggle raw mode and enter account digits
 * 
 * Baseline isolated card centered in the viewport titled "Payout settings".
 * It contains a single Mantine TextInput labeled "Account number".
 * The component has an in-field mode toggle in the right section with two states: "Formatted" (default) and "Raw".
 * - In Formatted mode, the input displays groups of 4 digits separated by spaces (e.g., "0000 1234 5678").
 * - In Raw mode, the input displays digits only with no spaces, but still enforces a 12-digit numeric mask.
 * The field starts empty in Formatted mode. The task requires switching to Raw mode and then entering the 12 digits.
 * 
 * Success: The "Account number" component is in Raw mode AND the value equals "000012345678".
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, SegmentedControl, Group } from '@mantine/core';
import { IMaskInput } from 'react-imask';
import type { TaskComponentProps } from '../types';

export default function T10({ onSuccess }: TaskComponentProps) {
  const [mode, setMode] = useState<'formatted' | 'raw'>('formatted');
  const [value, setValue] = useState('');

  useEffect(() => {
    // Check success: raw mode AND correct 12 digits
    if (mode === 'raw' && value === '000012345678') {
      onSuccess();
    }
  }, [mode, value, onSuccess]);

  // Handle mode switch - convert value between formats
  const handleModeChange = (newMode: string) => {
    const typedMode = newMode as 'formatted' | 'raw';
    
    if (typedMode === 'raw' && mode === 'formatted') {
      // Convert from formatted (with spaces) to raw (no spaces)
      setValue(value.replace(/\s/g, ''));
    } else if (typedMode === 'formatted' && mode === 'raw') {
      // Convert from raw to formatted (add spaces every 4 digits)
      const rawDigits = value.replace(/\s/g, '');
      const formatted = rawDigits.match(/.{1,4}/g)?.join(' ') || '';
      setValue(formatted);
    }
    
    setMode(typedMode);
  };

  const mask = mode === 'formatted' ? '0000 0000 0000' : '000000000000';
  const placeholder = mode === 'formatted' ? '____ ____ ____' : '____________';

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Payout settings</Text>
      <div style={{ marginBottom: 8 }}>
        <Group justify="space-between" mb={4}>
          <Text component="label" htmlFor="account-number" fw={500} size="sm">
            Account number
          </Text>
          <SegmentedControl
            size="xs"
            value={mode}
            onChange={handleModeChange}
            data={[
              { value: 'formatted', label: 'Formatted' },
              { value: 'raw', label: 'Raw' },
            ]}
            data-testid="mode-toggle"
          />
        </Group>
        <IMaskInput
          key={mode} // Force re-mount on mode change to reset mask
          id="account-number"
          mask={mask}
          definitions={{
            '0': /[0-9]/
          }}
          placeholder={placeholder}
          value={value}
          onAccept={(val: string) => setValue(val)}
          inputMode="numeric"
          data-testid="account-number"
          data-mode={mode}
          style={{
            width: '100%',
            padding: '8px 12px',
            fontSize: 14,
            lineHeight: 1.55,
            border: '1px solid #ced4da',
            borderRadius: 4,
            outline: 'none',
            fontFamily: 'monospace',
            letterSpacing: mode === 'raw' ? '2px' : '0',
          }}
        />
        <Text size="xs" c="dimmed" mt={4}>
          {mode === 'formatted' ? 'Digits grouped with spaces' : 'Raw digits only'}
        </Text>
      </div>
    </Card>
  );
}
