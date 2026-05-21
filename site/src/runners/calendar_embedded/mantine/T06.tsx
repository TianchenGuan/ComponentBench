'use client';

/**
 * calendar_embedded-mantine-T06: Choose a shipping date (two calendars in a form)
 *
 * Layout: form_section centered (light theme, comfortable spacing, default scale) with low clutter.
 * The page shows a "Checkout scheduling" form with a few distractor controls (Name input, Address input, and a non-required checkbox "Save for later").
 * Below the form fields are two embedded Mantine Calendar instances:
 *   - "Billing calendar" (first)
 *   - "Shipping calendar" (second)
 * Both calendars start on April 2026 and both begin with no selected date.
 * Each calendar has its own "Selected date:" readout beneath it.
 * Only the Shipping calendar selection matters; Billing calendar should remain unchanged for success.
 *
 * Success: Shipping calendar selected_date equals 2026-04-22.
 *          Billing calendar remains unselected (null).
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, TextInput, Checkbox, Group, Stack, Box } from '@mantine/core';
import { Calendar } from '@mantine/dates';
import dayjs from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T06({ onSuccess }: TaskComponentProps) {
  const [billingDate, setBillingDate] = useState<Date | null>(null);
  const [shippingDate, setShippingDate] = useState<Date | null>(null);

  useEffect(() => {
    if (
      shippingDate &&
      dayjs(shippingDate).format('YYYY-MM-DD') === '2026-04-22' &&
      billingDate === null
    ) {
      onSuccess();
    }
  }, [billingDate, shippingDate, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 700 }} data-testid="form-card">
      <Text fw={600} size="lg" mb="md">Checkout scheduling</Text>

      <Stack gap="sm" mb="md">
        <TextInput label="Name" placeholder="Enter your name" data-testid="name-input" />
        <TextInput label="Address" placeholder="Enter your address" data-testid="address-input" />
        <Checkbox label="Save for later" data-testid="save-checkbox" />
      </Stack>

      <Group align="flex-start" gap="xl">
        {/* Billing Calendar */}
        <Box data-testid="calendar-billing">
          <Text fw={600} mb="xs">Billing calendar</Text>
          <Calendar
            defaultDate={new Date(2026, 3, 1)}
            getDayProps={(date) => ({
              selected: billingDate ? dayjs(date).isSame(billingDate, 'day') : false,
              onClick: () => setBillingDate(date),
            })}
          />
          <Text size="sm" mt="xs">
            <Text component="span" fw={500}>Selected date: </Text>
            <Text component="span" data-testid="billing-selected">
              {billingDate ? dayjs(billingDate).format('YYYY-MM-DD') : '—'}
            </Text>
          </Text>
        </Box>

        {/* Shipping Calendar */}
        <Box data-testid="calendar-shipping">
          <Text fw={600} mb="xs">Shipping calendar</Text>
          <Calendar
            defaultDate={new Date(2026, 3, 1)}
            getDayProps={(date) => ({
              selected: shippingDate ? dayjs(date).isSame(shippingDate, 'day') : false,
              onClick: () => setShippingDate(date),
            })}
          />
          <Text size="sm" mt="xs">
            <Text component="span" fw={500}>Selected date: </Text>
            <Text component="span" data-testid="shipping-selected">
              {shippingDate ? dayjs(shippingDate).format('YYYY-MM-DD') : '—'}
            </Text>
          </Text>
        </Box>
      </Group>
    </Card>
  );
}
