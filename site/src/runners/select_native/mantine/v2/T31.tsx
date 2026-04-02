'use client';

/**
 * select_native-mantine-v2-T31: Reference rocket — set Shipping speed to Express and apply
 *
 * Shipping-preferences card with two Mantine NativeSelect controls:
 * "Shipping speed" (starts Standard) and "Gift wrap" (starts No, must stay).
 * A reference chip shows a rocket icon 🚀 corresponding to Express.
 * "Apply shipping preferences" commits.
 *
 * Success: Shipping speed = "express"/"Express (1–2 days)", Gift wrap = "no", Apply clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, Text, NativeSelect, Button, Group, Stack, Badge, Box } from '@mantine/core';
import { IconRocket } from '@tabler/icons-react';
import type { TaskComponentProps } from '../../types';

const speedOptions = [
  { label: 'Standard (5–7 days)', value: 'standard' },
  { label: 'Express (1–2 days)', value: 'express' },
  { label: 'Overnight', value: 'overnight' },
  { label: 'Economy (10–14 days)', value: 'economy' },
];

const giftWrapOptions = [
  { label: 'No', value: 'no' },
  { label: 'Yes', value: 'yes' },
];

export default function T31({ onSuccess }: TaskComponentProps) {
  const [shippingSpeed, setShippingSpeed] = useState('standard');
  const [giftWrap, setGiftWrap] = useState('no');
  const [applied, setApplied] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (applied && shippingSpeed === 'express' && giftWrap === 'no') {
      successFired.current = true;
      onSuccess();
    }
  }, [applied, shippingSpeed, giftWrap, onSuccess]);

  return (
    <Box p="lg" style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ maxWidth: 440 }}>
        <Text fw={600} size="lg" mb="xs">Shipping Preferences</Text>

        <Group mb="md" gap="sm" align="center">
          <Text size="sm" c="dimmed">Reference:</Text>
          <Badge
            size="lg"
            variant="outline"
            leftSection={<IconRocket size={16} />}
            aria-label="Rocket — Express shipping"
          >
            🚀
          </Badge>
        </Group>

        <Stack gap="md">
          <NativeSelect
            data-testid="shipping-speed"
            data-canonical-type="select_native"
            data-selected-value={shippingSpeed}
            label="Shipping speed"
            description="Select the option matching the reference icon"
            value={shippingSpeed}
            onChange={(e) => { setShippingSpeed(e.target.value); setApplied(false); }}
            data={speedOptions}
          />

          <NativeSelect
            data-testid="gift-wrap"
            data-canonical-type="select_native"
            data-selected-value={giftWrap}
            label="Gift wrap"
            value={giftWrap}
            onChange={(e) => { setGiftWrap(e.target.value); setApplied(false); }}
            data={giftWrapOptions}
          />
        </Stack>

        <Text size="xs" c="dimmed" mt="md">
          Order total: $49.95 — Free shipping on orders over $50.
        </Text>

        <Group mt="lg" gap="sm">
          <Button onClick={() => setApplied(true)}>Apply shipping preferences</Button>
          <Button variant="outline" onClick={() => { setShippingSpeed('standard'); setGiftWrap('no'); setApplied(false); }}>
            Cancel
          </Button>
        </Group>
      </Card>
    </Box>
  );
}
