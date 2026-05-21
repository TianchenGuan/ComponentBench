'use client';

/**
 * autocomplete_restricted-mantine-T10: Modal: match discount tier from the banner
 *
 * setup_description:
 * The main page shows a "Cart" card with a button **Apply discount**.
 *
 * Clicking **Apply discount** opens a centered modal dialog (modal_flow).
 * In the modal:
 * - A colorful promo banner at the top contains a bold tier label **TIER 2** (reference).
 * - Below it is one Mantine Select labeled **Discount tier** (target component).
 *
 * Options: Tier 1, Tier 2, Tier 3.
 * - Theme: light; spacing: comfortable; size: default.
 * - Restricted options-only behavior; selecting commits immediately.
 * - Closing or submitting the modal is NOT required for success.
 *
 * The agent must read the tier from the promo banner and apply it in the Discount tier field.
 *
 * Success: The "Discount tier" Select has selected value "Tier 2".
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, Text, Select, Button, Modal, Box, Badge, Stack } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const tiers = [
  { label: 'Tier 1', value: 'Tier 1' },
  { label: 'Tier 2', value: 'Tier 2' },
  { label: 'Tier 3', value: 'Tier 3' },
];

export default function T10({ onSuccess }: TaskComponentProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [value, setValue] = useState<string | null>(null);
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && value === 'Tier 2') {
      successFired.current = true;
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 350 }}>
        <Text fw={600} size="lg" mb="md">Cart</Text>
        <Stack gap="xs">
          <Text size="sm" c="dimmed">Items: 3</Text>
          <Text size="sm" c="dimmed">Subtotal: $89.97</Text>
          <Text size="sm" c="dimmed">Discount: None applied</Text>
          <Button mt="md" onClick={() => setModalOpen(true)}>
            Apply discount
          </Button>
        </Stack>
      </Card>

      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Apply Discount"
        centered
      >
        {/* Promo banner (reference) */}
        <Box
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: 8,
            padding: 16,
            marginBottom: 20,
            textAlign: 'center',
          }}
        >
          <Text size="sm" c="white" mb={8}>Special Promo!</Text>
          <Badge
            data-testid="promo-banner.discount-tier"
            color="yellow"
            size="xl"
            variant="filled"
            style={{ fontWeight: 'bold' }}
          >
            TIER 2
          </Badge>
        </Box>

        {/* Discount tier selector */}
        <Text fw={500} size="sm" mb={4}>Discount tier</Text>
        <Select
          data-testid="discount-tier-select"
          placeholder="Select tier"
          data={tiers}
          value={value}
          onChange={setValue}
        />
      </Modal>
    </>
  );
}
