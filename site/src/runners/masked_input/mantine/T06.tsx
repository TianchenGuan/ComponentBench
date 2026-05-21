'use client';

/**
 * masked_input-mantine-T06: Set emergency phone (two fields)
 * 
 * Isolated card placed near the top-left of the viewport titled "Emergency contact".
 * Two masked Mantine TextInputs are shown with identical US phone formatting:
 * - "Primary contact phone" is prefilled with "(718) 555-0100".
 * - "Emergency contact phone" starts empty.
 * Both show the same placeholder "(###) ###-####". No Save button is required; the task targets the "Emergency contact phone" instance.
 * 
 * Success: The masked input instance labeled "Emergency contact phone" equals "(917) 555-0120".
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Stack } from '@mantine/core';
import { IMaskInput } from 'react-imask';
import type { TaskComponentProps } from '../types';

export default function T06({ onSuccess }: TaskComponentProps) {
  const [primaryPhone] = useState('(718) 555-0100');
  const [emergencyPhone, setEmergencyPhone] = useState('');

  useEffect(() => {
    if (emergencyPhone === '(917) 555-0120') {
      onSuccess();
    }
  }, [emergencyPhone, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Emergency contact</Text>
      <Stack gap="md">
        <div>
          <Text component="label" htmlFor="contact-primary" fw={500} size="sm" mb={4} style={{ display: 'block' }}>
            Primary contact phone
          </Text>
          <IMaskInput
            id="contact-primary"
            mask="(000) 000-0000"
            definitions={{
              '0': /[0-9]/
            }}
            placeholder="(###) ###-####"
            value={primaryPhone}
            readOnly
            data-testid="contact-primary"
            style={{
              width: '100%',
              padding: '8px 12px',
              fontSize: 14,
              lineHeight: 1.55,
              border: '1px solid #ced4da',
              borderRadius: 4,
              outline: 'none',
              backgroundColor: '#f5f5f5',
            }}
          />
        </div>
        <div>
          <Text component="label" htmlFor="contact-emergency" fw={500} size="sm" mb={4} style={{ display: 'block' }}>
            Emergency contact phone
          </Text>
          <IMaskInput
            id="contact-emergency"
            mask="(000) 000-0000"
            definitions={{
              '0': /[0-9]/
            }}
            placeholder="(###) ###-####"
            value={emergencyPhone}
            onAccept={(val: string) => setEmergencyPhone(val)}
            data-testid="contact-emergency"
            style={{
              width: '100%',
              padding: '8px 12px',
              fontSize: 14,
              lineHeight: 1.55,
              border: '1px solid #ced4da',
              borderRadius: 4,
              outline: 'none',
            }}
          />
        </div>
      </Stack>
    </Card>
  );
}
