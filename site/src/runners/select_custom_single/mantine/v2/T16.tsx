'use client';

/**
 * select_custom_single-mantine-v2-T16: Reference badge — set Plan to the star option and save
 *
 * Subscription panel in a cluttered account dashboard. Two Mantine Select controls:
 * "Plan" and "Billing cycle". Plan options custom-rendered with badge icons:
 * Starter (circle ●), Pro (star ★), Enterprise (diamond ◆).
 * Nearby reference card shows only the star badge. Billing cycle = Monthly (must stay).
 * Footer: "Save subscription" / "Discard changes".
 *
 * Success: Plan = "Pro", Billing cycle still "Monthly", "Save subscription" clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, Text, Select, Button, Group, Badge, Stack, Divider, MantineProvider } from '@mantine/core';
import type { TaskComponentProps } from '../../types';

const PLAN_ICONS: Record<string, string> = { Starter: '●', Pro: '★', Enterprise: '◆' };

const planData = Object.entries(PLAN_ICONS).map(([plan, icon]) => ({
  value: plan,
  label: `${icon} ${plan}`,
}));

const billingOptions = [
  { value: 'Monthly', label: 'Monthly' },
  { value: 'Quarterly', label: 'Quarterly' },
  { value: 'Annual', label: 'Annual' },
];

export default function T16({ onSuccess }: TaskComponentProps) {
  const [plan, setPlan] = useState<string | null>('Starter');
  const [billingCycle, setBillingCycle] = useState<string | null>('Monthly');
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (saved && plan === 'Pro' && billingCycle === 'Monthly') {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, plan, billingCycle, onSuccess]);

  return (
    <MantineProvider>
      <div style={{ padding: 16 }}>
        <Text fw={700} size="xl" mb="md">Account Dashboard</Text>

        <Group gap="sm" mb="md">
          <Badge variant="light" color="blue">Plan: {plan}</Badge>
          <Badge variant="outline">Users: 14</Badge>
          <Badge variant="outline" color="gray">Storage: 82%</Badge>
        </Group>

        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 360 }}>
            <Text fw={600} size="md" mb="md">Subscription</Text>

            <Stack gap="md">
              <Select
                label="Plan"
                data={planData}
                value={plan}
                onChange={(val) => { setPlan(val); setSaved(false); }}
              />

              <Select
                label="Billing cycle"
                data={billingOptions}
                value={billingCycle}
                onChange={(val) => { setBillingCycle(val); setSaved(false); }}
              />

              <Divider />

              <Group gap="xs">
                <Badge size="sm" variant="outline">Next invoice: Apr 1</Badge>
                <Badge size="sm" variant="light">Auto-renew: On</Badge>
              </Group>

              <Group justify="flex-end" gap="sm">
                <Button variant="subtle" onClick={() => { setPlan('Starter'); setSaved(false); }}>Discard changes</Button>
                <Button onClick={() => setSaved(true)}>Save subscription</Button>
              </Group>
            </Stack>
          </Card>

          <Card shadow="sm" padding="md" radius="md" withBorder style={{ width: 160 }}>
            <Text size="xs" c="dimmed" mb="xs">Match this badge:</Text>
            <Badge size="lg" variant="light" color="yellow" style={{ fontSize: 16 }}>★</Badge>
            <Text size="xs" c="dimmed" mt="xs">Target plan icon</Text>
          </Card>
        </div>
      </div>
    </MantineProvider>
  );
}
