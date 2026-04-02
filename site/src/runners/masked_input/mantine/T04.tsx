'use client';

/**
 * masked_input-mantine-T04: Clear prefilled promo code
 * 
 * Form section layout titled "Checkout" with a few unrelated inputs (Email, Notes) that are not masked.
 * The target is a masked Mantine TextInput labeled "Promo code" with the format AAAA-9999 and placeholder "____-____".
 * The field is prefilled with "SAVE-2026".
 * A small clear icon button appears in the input's right section (aria-label "Clear promo code") when the field is focused.
 * No Apply/Submit action is required for success; the goal is an empty value.
 * 
 * Success: The "Promo code" masked input value is empty (zero characters).
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, TextInput, Textarea, ActionIcon } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { IMaskInput } from 'react-imask';
import type { TaskComponentProps } from '../types';

export default function T04({ onSuccess }: TaskComponentProps) {
  const [promoValue, setPromoValue] = useState('SAVE-2026');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (promoValue === '') {
      onSuccess();
    }
  }, [promoValue, onSuccess]);

  const handleClear = () => {
    setPromoValue('');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 450 }}>
      <Text fw={600} size="lg" mb="md">Checkout</Text>
      
      <TextInput
        label="Email"
        value="customer@example.com"
        disabled
        mb="md"
      />
      
      <Textarea
        label="Notes"
        placeholder="Any special instructions"
        mb="md"
      />
      
      <div style={{ marginBottom: 8 }}>
        <Text component="label" htmlFor="promo-code" fw={500} size="sm" mb={4} style={{ display: 'block' }}>
          Promo code
        </Text>
        <div style={{ position: 'relative' }}>
          <IMaskInput
            id="promo-code"
            inputRef={inputRef}
            mask="aaaa-0000"
            definitions={{
              'a': /[A-Za-z]/,
              '0': /[0-9]/
            }}
            prepare={(str: string) => str.toUpperCase()}
            placeholder="____-____"
            value={promoValue}
            onAccept={(val: string) => setPromoValue(val)}
            unmask={false}
            data-testid="promo-code"
            style={{
              width: '100%',
              padding: '8px 36px 8px 12px',
              fontSize: 14,
              lineHeight: 1.55,
              border: '1px solid #ced4da',
              borderRadius: 4,
              outline: 'none',
              fontFamily: 'monospace',
            }}
          />
          {promoValue && (
            <ActionIcon
              variant="subtle"
              color="gray"
              size="sm"
              aria-label="Clear promo code"
              onClick={handleClear}
              style={{
                position: 'absolute',
                right: 8,
                top: '50%',
                transform: 'translateY(-50%)',
              }}
            >
              <IconX size={14} />
            </ActionIcon>
          )}
        </div>
      </div>
    </Card>
  );
}
