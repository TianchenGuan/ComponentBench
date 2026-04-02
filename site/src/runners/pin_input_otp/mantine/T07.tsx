'use client';

/**
 * pin_input_otp-mantine-T27: Three PinInputs, bottom-left placement (choose Secondary)
 * 
 * An isolated_card placed near the bottom-left corner titled "Device approval".
 * It contains three Mantine PinInputs stacked vertically: "Primary code",
 * "Secondary code", and "Tertiary code", each configured as numeric length=6.
 * All three look nearly identical except for their labels.
 * Initial state: all boxes empty; no confirm button.
 * 
 * Success: Target OTP value equals '905173' in "Secondary code" instance only.
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, PinInput, Group, Stack } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T07({ onSuccess }: TaskComponentProps) {
  const [primaryCode, setPrimaryCode] = useState('');
  const [secondaryCode, setSecondaryCode] = useState('');
  const [tertiaryCode, setTertiaryCode] = useState('');

  useEffect(() => {
    if (secondaryCode === '905173') {
      onSuccess();
    }
  }, [secondaryCode, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Device approval</Text>
      
      <Stack gap="lg">
        {/* Primary code */}
        <div aria-labelledby="primary-label">
          <Text id="primary-label" fw={500} size="sm" mb="xs">Primary code</Text>
          <Group data-testid="otp-primary-code" aria-label="Primary code">
            <PinInput
              length={6}
              type="number"
              value={primaryCode}
              onChange={setPrimaryCode}
            />
          </Group>
        </div>

        {/* Secondary code */}
        <div aria-labelledby="secondary-label">
          <Text id="secondary-label" fw={500} size="sm" mb="xs">Secondary code</Text>
          <Group data-testid="otp-secondary-code" aria-label="Secondary code">
            <PinInput
              length={6}
              type="number"
              value={secondaryCode}
              onChange={setSecondaryCode}
            />
          </Group>
        </div>

        {/* Tertiary code */}
        <div aria-labelledby="tertiary-label">
          <Text id="tertiary-label" fw={500} size="sm" mb="xs">Tertiary code</Text>
          <Group data-testid="otp-tertiary-code" aria-label="Tertiary code">
            <PinInput
              length={6}
              type="number"
              value={tertiaryCode}
              onChange={setTertiaryCode}
            />
          </Group>
        </div>
      </Stack>
    </Card>
  );
}
