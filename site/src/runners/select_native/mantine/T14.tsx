'use client';

/**
 * select_native-mantine-T14: Match shipping speed to rocket icon (visual reference)
 *
 * Layout: an order form section with an "Order summary" card on the right (clutter low).
 * In the Order summary, a single icon indicates the intended shipping tier:
 * - 🚀 (rocket) indicates the fastest shipping tier for this page state.
 * The icon includes an aria-label like "Express shipping" for accessibility.
 *
 * The form contains TWO Mantine NativeSelect components:
 * 1) "Shipping speed"  ← TARGET
 * 2) "Gift wrap" (Yes/No; distractor select)
 *
 * Shipping speed options (label → value):
 * - Standard (3–5 days) → standard
 * - Express (1–2 days) → express  ← TARGET (matches 🚀)
 * - Overnight → overnight
 *
 * Gift wrap options (label → value):
 * - No → no
 * - Yes → yes
 *
 * Initial state:
 * - Shipping speed: Standard
 * - Gift wrap: No
 *
 * Feedback: immediate; no Apply/Save.
 *
 * Success: The target native select labeled "Shipping speed" has selected option value 'express' (label 'Express (1–2 days)').
 */

import React, { useState } from 'react';
import { Card, Text, NativeSelect, Grid, Box, Group, Stack } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const shippingOptions = [
  { label: 'Standard (3–5 days)', value: 'standard' },
  { label: 'Express (1–2 days)', value: 'express' },
  { label: 'Overnight', value: 'overnight' },
];

const giftWrapOptions = [
  { label: 'No', value: 'no' },
  { label: 'Yes', value: 'yes' },
];

export default function T14({ onSuccess }: TaskComponentProps) {
  const [shippingSpeed, setShippingSpeed] = useState<string>('standard');
  const [giftWrap, setGiftWrap] = useState<string>('no');

  const handleShippingChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setShippingSpeed(value);
    if (value === 'express') {
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 550 }}>
      <Text fw={600} size="lg" mb="md">Order Options</Text>

      <Grid>
        <Grid.Col span={7}>
          <Stack gap="md">
            <NativeSelect
              data-testid="shipping-speed"
              data-canonical-type="select_native"
              data-selected-value={shippingSpeed}
              label="Shipping speed"
              value={shippingSpeed}
              onChange={handleShippingChange}
              data={shippingOptions}
            />

            <NativeSelect
              data-testid="gift-wrap"
              data-canonical-type="select_native"
              data-selected-value={giftWrap}
              label="Gift wrap"
              value={giftWrap}
              onChange={(e) => setGiftWrap(e.target.value)}
              data={giftWrapOptions}
            />
          </Stack>
        </Grid.Col>

        <Grid.Col span={5}>
          <Box 
            p="md" 
            style={{ 
              border: '1px solid #e0e0e0', 
              borderRadius: 8,
              height: '100%'
            }}
          >
            <Text size="sm" c="dimmed" mb="sm">Order summary</Text>
            
            <Group gap="md" mb="md">
              <Box 
                component="span" 
                style={{ fontSize: 32 }}
                aria-label="Express shipping"
                role="img"
              >
                🚀
              </Box>
              <Text size="sm" c="dimmed">
                Fast delivery recommended
              </Text>
            </Group>

            <Text size="sm" fw={500}>Subtotal: $49.99</Text>
          </Box>
        </Grid.Col>
      </Grid>
    </Card>
  );
}
