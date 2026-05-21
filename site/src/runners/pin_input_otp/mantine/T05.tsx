'use client';

/**
 * pin_input_otp-mantine-T25: Match code from SMS preview (Mantine visual guidance)
 * 
 * A centered isolated card titled "SMS verification". On the left is a Mantine
 * PinInput labeled "SMS code" (length=6, numeric). On the right is a non-interactive
 * "SMS preview" image resembling a phone message bubble that displays a 6-digit code
 * in large digits; the digits are rendered as an image/canvas, not selectable text.
 * Initial state: PinInput empty; no confirm button.
 * 
 * Success: Target PinInput value equals '138044'.
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, PinInput, Group, Box, Paper } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T05({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');
  const targetCode = '138044';

  useEffect(() => {
    if (value === targetCode) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 500 }}>
      <Text fw={600} size="lg" mb="md">SMS verification</Text>
      
      <Group align="flex-start" gap="xl">
        {/* PinInput */}
        <Box>
          <Text fw={500} size="sm" mb="xs">SMS code</Text>
          <Group data-testid="otp-sms-code">
            <PinInput
              length={6}
              type="number"
              value={value}
              onChange={setValue}
            />
          </Group>
        </Box>

        {/* SMS preview */}
        <Paper
          shadow="xs"
          p="md"
          radius="lg"
          style={{ backgroundColor: '#e8f5e9' }}
          data-testid="sms-preview-image"
        >
          <Text size="xs" c="dimmed" mb={4}>SMS preview</Text>
          <Box
            style={{
              fontFamily: 'monospace',
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: 4,
              color: '#2e7d32',
              userSelect: 'none',
            }}
          >
            {targetCode}
          </Box>
        </Paper>
      </Group>
    </Card>
  );
}
