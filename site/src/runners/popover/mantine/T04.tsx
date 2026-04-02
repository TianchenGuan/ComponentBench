'use client';

/**
 * popover-mantine-T04: Open Billing ZIP help popover (2 instances in form)
 *
 * Form section layout centered in the viewport.
 * Two compact input rows are shown: 'Shipping ZIP' and 'Billing ZIP'.
 * Each label has an ActionIcon (ⓘ) that toggles a Mantine Popover dropdown on click.
 * The popover dropdown titles match the labels.
 * Initial state: both popovers closed.
 * Distractors: a 'Copy shipping to billing' checkbox and a 'Continue' button.
 * Success: Open only the 'Billing ZIP' popover.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, Text, Popover, TextInput, ActionIcon, Checkbox, Stack, Group } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import '@mantine/core/styles.css';
import type { TaskComponentProps } from '../types';

export default function T04({ task, onSuccess }: TaskComponentProps) {
  const [shippingOpened, setShippingOpened] = useState(false);
  const [billingOpened, setBillingOpened] = useState(false);
  const successCalledRef = useRef(false);

  useEffect(() => {
    if (billingOpened && !shippingOpened && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [billingOpened, shippingOpened, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={500} size="lg" mb="md">
        Address Information
      </Text>
      
      <Stack gap="md">
        <div>
          <Group gap="xs" mb={4}>
            <Text size="sm" fw={500}>Shipping ZIP</Text>
            <Popover
              opened={shippingOpened}
              onChange={setShippingOpened}
              width={220}
              position="right"
              withArrow
              shadow="md"
            >
              <Popover.Target>
                <ActionIcon
                  variant="subtle"
                  size="xs"
                  onClick={() => setShippingOpened((o) => !o)}
                  data-testid="popover-target-shipping-zip"
                >
                  <IconInfoCircle size={14} />
                </ActionIcon>
              </Popover.Target>
              <Popover.Dropdown data-testid="popover-shipping-zip">
                <Text size="sm" fw={500} mb={4}>Shipping ZIP</Text>
                <Text size="xs">Enter the ZIP code where your order will be delivered.</Text>
              </Popover.Dropdown>
            </Popover>
          </Group>
          <TextInput placeholder="12345" />
        </div>

        <div>
          <Group gap="xs" mb={4}>
            <Text size="sm" fw={500}>Billing ZIP</Text>
            <Popover
              opened={billingOpened}
              onChange={setBillingOpened}
              width={220}
              position="right"
              withArrow
              shadow="md"
            >
              <Popover.Target>
                <ActionIcon
                  variant="subtle"
                  size="xs"
                  onClick={() => setBillingOpened((o) => !o)}
                  data-testid="popover-target-billing-zip"
                >
                  <IconInfoCircle size={14} />
                </ActionIcon>
              </Popover.Target>
              <Popover.Dropdown data-testid="popover-billing-zip">
                <Text size="sm" fw={500} mb={4}>Billing ZIP</Text>
                <Text size="xs">Enter the ZIP code associated with your payment method.</Text>
              </Popover.Dropdown>
            </Popover>
          </Group>
          <TextInput placeholder="12345" />
        </div>

        <Checkbox label="Copy shipping to billing" />
        
        <Button>Continue</Button>
      </Stack>
    </Card>
  );
}
