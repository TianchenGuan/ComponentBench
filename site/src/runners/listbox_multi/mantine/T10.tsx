'use client';

/**
 * listbox_multi-mantine-T10: Select all billing tags (choose correct group)
 *
 * Layout: settings_panel anchored near the bottom-left of the viewport.
 * Spacing is compact and the checkbox size is small (xs).
 * There are two separate checkbox listboxes (instances=2) stacked vertically:
 *   - "Billing tags" (top) with a master checkbox labeled "Select all" above the list.
 *     Options (8): Invoices, Refunds, Tax forms, Chargebacks, Trials, Renewals, Coupons, Credits.
 *   - "Support tags" (bottom) with its own "Select all" master checkbox.
 *     Options (8): Tickets, SLA breaches, On-call, Escalations, Chat, Email, Phone, Community.
 * Initial state: Billing tags has none selected; Support tags has "Tickets" preselected.
 *
 * Success: The target listbox (Billing tags) has all 8 items selected.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, Checkbox, Stack, Divider, Group } from '@mantine/core';
import type { TaskComponentProps } from '../types';
import { setsEqual } from '../types';

const billingTags = ['Invoices', 'Refunds', 'Tax forms', 'Chargebacks', 'Trials', 'Renewals', 'Coupons', 'Credits'];
const supportTags = ['Tickets', 'SLA breaches', 'On-call', 'Escalations', 'Chat', 'Email', 'Phone', 'Community'];

const targetSet = billingTags; // All billing tags

export default function T10({ onSuccess }: TaskComponentProps) {
  const [billingSelected, setBillingSelected] = useState<string[]>([]);
  const [supportSelected, setSupportSelected] = useState<string[]>(['Tickets']);
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && setsEqual(billingSelected, targetSet)) {
      successFired.current = true;
      onSuccess();
    }
  }, [billingSelected, onSuccess]);

  const isBillingAllSelected = billingSelected.length === billingTags.length;
  const isBillingIndeterminate = billingSelected.length > 0 && billingSelected.length < billingTags.length;

  const isSupportAllSelected = supportSelected.length === supportTags.length;
  const isSupportIndeterminate = supportSelected.length > 0 && supportSelected.length < supportTags.length;

  const handleBillingSelectAll = () => {
    if (isBillingAllSelected) {
      setBillingSelected([]);
    } else {
      setBillingSelected([...billingTags]);
    }
  };

  const handleSupportSelectAll = () => {
    if (isSupportAllSelected) {
      setSupportSelected([]);
    } else {
      setSupportSelected([...supportTags]);
    }
  };

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder style={{ width: 380 }}>
      <Text fw={600} size="md" mb="xs">
        Tag rules
      </Text>
      <Text size="xs" c="dimmed" mb="md">
        Tag rules: Billing tags and Support tags (each has Select all).
      </Text>

      {/* Billing tags */}
      <Text fw={500} size="sm" mb="xs">
        Billing tags
      </Text>
      <Checkbox
        label="Select all"
        checked={isBillingAllSelected}
        indeterminate={isBillingIndeterminate}
        onChange={handleBillingSelectAll}
        size="xs"
        mb="xs"
      />
      <Checkbox.Group
        data-testid="listbox-billing-tags"
        value={billingSelected}
        onChange={setBillingSelected}
      >
        <Stack gap={4} ml="md">
          {billingTags.map((opt) => (
            <Checkbox key={opt} value={opt} label={opt} size="xs" />
          ))}
        </Stack>
      </Checkbox.Group>

      <Divider my="md" />

      {/* Support tags */}
      <Text fw={500} size="sm" mb="xs">
        Support tags
      </Text>
      <Checkbox
        label="Select all"
        checked={isSupportAllSelected}
        indeterminate={isSupportIndeterminate}
        onChange={handleSupportSelectAll}
        size="xs"
        mb="xs"
      />
      <Checkbox.Group
        data-testid="listbox-support-tags"
        value={supportSelected}
        onChange={setSupportSelected}
      >
        <Stack gap={4} ml="md">
          {supportTags.map((opt) => (
            <Checkbox key={opt} value={opt} label={opt} size="xs" />
          ))}
        </Stack>
      </Checkbox.Group>
    </Card>
  );
}
