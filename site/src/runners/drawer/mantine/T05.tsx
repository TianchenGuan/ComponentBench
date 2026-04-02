'use client';

/**
 * drawer-mantine-T05: Open the correct drawer among three labeled options
 *
 * Layout: isolated_card centered with comfortable spacing.
 *
 * On the card are three similar Mantine Buttons stacked vertically:
 * - "Open Billing"
 * - "Open Shipping"
 * - "Open Returns"
 *
 * Each button opens a separate Mantine Drawer instance (all position="right") with matching titles:
 * - Billing drawer title "Billing"
 * - Shipping drawer title "Shipping"
 * - Returns drawer title "Returns"
 *
 * Initial state:
 * - All drawers are CLOSED.
 *
 * Distractors:
 * - The three buttons are similar in size/style, and all open drawers with the same animation and overlay, increasing the chance of choosing the wrong one.
 *
 * Feedback:
 * - The opened drawer shows its title in the header, allowing verification.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, Text, Drawer, Stack } from '@mantine/core';
import '@mantine/core/styles.css';
import type { TaskComponentProps } from '../types';

type DrawerType = 'billing' | 'shipping' | 'returns' | null;

export default function T05({ task, onSuccess }: TaskComponentProps) {
  const [openDrawer, setOpenDrawer] = useState<DrawerType>(null);
  const successCalledRef = useRef(false);

  // Target is the Shipping drawer
  useEffect(() => {
    if (openDrawer === 'shipping' && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [openDrawer, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 350 }}>
      <Text fw={500} size="lg" mb="md">
        Order Management
      </Text>
      <Stack gap="sm">
        <Button variant="outline" onClick={() => setOpenDrawer('billing')} data-testid="open-billing">
          Open Billing
        </Button>
        <Button variant="outline" onClick={() => setOpenDrawer('shipping')} data-testid="open-shipping">
          Open Shipping
        </Button>
        <Button variant="outline" onClick={() => setOpenDrawer('returns')} data-testid="open-returns">
          Open Returns
        </Button>
      </Stack>

      {/* Billing Drawer */}
      <Drawer
        opened={openDrawer === 'billing'}
        onClose={() => setOpenDrawer(null)}
        title="Billing"
        position="right"
        data-testid="drawer-billing"
      >
        <Text size="sm">Manage your billing information and payment methods.</Text>
      </Drawer>

      {/* Shipping Drawer */}
      <Drawer
        opened={openDrawer === 'shipping'}
        onClose={() => setOpenDrawer(null)}
        title="Shipping"
        position="right"
        data-testid="drawer-shipping"
      >
        <Text size="sm">View and update your shipping addresses and preferences.</Text>
      </Drawer>

      {/* Returns Drawer */}
      <Drawer
        opened={openDrawer === 'returns'}
        onClose={() => setOpenDrawer(null)}
        title="Returns"
        position="right"
        data-testid="drawer-returns"
      >
        <Text size="sm">Request returns or check return status.</Text>
      </Drawer>
    </Card>
  );
}
