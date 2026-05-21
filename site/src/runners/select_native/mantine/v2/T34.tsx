'use client';

/**
 * select_native-mantine-v2-T34: Billing interval modal — choose Quarterly and save
 *
 * "Plan settings" button opens a Mantine Modal with two NativeSelect controls:
 * "Billing interval" (starts Monthly → Quarterly) and "Invoice locale"
 * (starts en-US, must stay). Short renewal note. Footer: "Save plan settings" / "Discard".
 *
 * Success: Billing interval = "quarterly"/"Quarterly", Invoice locale = "en-US", Save clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, Text, NativeSelect, Button, Group, Stack, Modal, Box } from '@mantine/core';
import type { TaskComponentProps } from '../../types';

const intervalOptions = [
  { label: 'Monthly', value: 'monthly' },
  { label: 'Quarterly', value: 'quarterly' },
  { label: 'Semi-annual', value: 'semi-annual' },
  { label: 'Yearly', value: 'yearly' },
];

const invoiceLocaleOptions = [
  { label: 'English (US)', value: 'en-US' },
  { label: 'English (UK)', value: 'en-GB' },
  { label: 'French', value: 'fr-FR' },
  { label: 'German', value: 'de-DE' },
  { label: 'Japanese', value: 'ja-JP' },
];

export default function T34({ onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const [billingInterval, setBillingInterval] = useState('monthly');
  const [invoiceLocale, setInvoiceLocale] = useState('en-US');
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (saved && billingInterval === 'quarterly' && invoiceLocale === 'en-US') {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, billingInterval, invoiceLocale, onSuccess]);

  const handleSave = () => {
    setSaved(true);
    setOpen(false);
  };

  const handleDiscard = () => {
    setBillingInterval('monthly');
    setInvoiceLocale('en-US');
    setSaved(false);
    setOpen(false);
  };

  return (
    <Box p="lg">
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ maxWidth: 400 }}>
        <Text fw={600} size="lg" mb="xs">Subscription</Text>
        <Text size="sm" c="dimmed" mb="md">
          Current plan: Pro — $19.99/month
        </Text>
        <Button onClick={() => setOpen(true)}>Plan settings</Button>
      </Card>

      <Modal opened={open} onClose={() => setOpen(false)} title="Plan Settings" centered>
        <Stack gap="md">
          <NativeSelect
            data-testid="billing-interval"
            data-canonical-type="select_native"
            data-selected-value={billingInterval}
            label="Billing interval"
            value={billingInterval}
            onChange={(e) => { setBillingInterval(e.target.value); setSaved(false); }}
            data={intervalOptions}
          />

          <NativeSelect
            data-testid="invoice-locale"
            data-canonical-type="select_native"
            data-selected-value={invoiceLocale}
            label="Invoice locale"
            value={invoiceLocale}
            onChange={(e) => { setInvoiceLocale(e.target.value); setSaved(false); }}
            data={invoiceLocaleOptions}
          />

          <Text size="xs" c="dimmed">
            Your next renewal date will adjust based on the selected billing interval.
            Changes take effect at the start of the next billing cycle.
          </Text>
        </Stack>

        <Group mt="lg" justify="flex-end" gap="sm">
          <Button variant="outline" onClick={handleDiscard}>Discard</Button>
          <Button onClick={handleSave}>Save plan settings</Button>
        </Group>
      </Modal>
    </Box>
  );
}
