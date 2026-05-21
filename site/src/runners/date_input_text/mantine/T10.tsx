'use client';

/**
 * date_input_text-mantine-T10: Mantine DateInput inside a drawer with Save/Cancel
 * 
 * Layout: drawer_flow. The base page shows a subscription summary and a button "Edit subscription".
 * Clicking it opens a right-side Drawer that slides in from the edge.
 * Inside the drawer is a small form with:
 *   - "Plan" select (disabled; not required)
 *   - "Next billing date" (Mantine DateInput, valueFormat YYYY-MM-DD, manual typing enabled)
 * Initial state: drawer is closed; when opened, Next billing date is empty.
 * Drawer footer: "Cancel" and primary "Save changes".
 * Clutter (low): a short paragraph explaining billing (non-interactive).
 * Feedback: after clicking "Save changes", the drawer closes and the summary updates the displayed next billing date.
 * 
 * Success: The "Next billing date" value equals 2026-11-15 AND user clicked "Save changes".
 */

import React, { useState, useRef } from 'react';
import { Card, Text, Button, Drawer, Select, Stack, Group } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import dayjs from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T10({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [billingDate, setBillingDate] = useState<Date | null>(null);
  const [savedDate, setSavedDate] = useState<Date | null>(null);
  const successTriggered = useRef(false);

  const handleSave = () => {
    if (billingDate && dayjs(billingDate).format('YYYY-MM-DD') === '2026-11-15' && !successTriggered.current) {
      successTriggered.current = true;
      setSavedDate(billingDate);
      setDrawerOpen(false);
      onSuccess();
    } else {
      setSavedDate(billingDate);
      setDrawerOpen(false);
    }
  };

  const handleCancel = () => {
    setDrawerOpen(false);
    setBillingDate(null);
  };

  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
        <Text fw={600} size="lg" mb="md">Subscription Summary</Text>
        
        <Stack gap="sm">
          <Group>
            <Text c="dimmed" size="sm">Plan:</Text>
            <Text size="sm">Pro Plan</Text>
          </Group>
          <Group>
            <Text c="dimmed" size="sm">Status:</Text>
            <Text size="sm" c="green">Active</Text>
          </Group>
          <Group>
            <Text c="dimmed" size="sm">Next billing date:</Text>
            <Text size="sm">{savedDate ? dayjs(savedDate).format('YYYY-MM-DD') : 'Not set'}</Text>
          </Group>
        </Stack>

        <Button
          mt="lg"
          onClick={() => setDrawerOpen(true)}
          data-testid="edit-subscription"
        >
          Edit subscription
        </Button>
      </Card>

      <Drawer
        opened={drawerOpen}
        onClose={handleCancel}
        title="Edit Subscription"
        position="right"
        size="md"
        data-testid="subscription-drawer"
      >
        <Stack gap="md">
          <Text size="sm" c="dimmed">
            Update your subscription settings. Changes will take effect immediately after saving.
          </Text>

          <Select
            label="Plan"
            value="pro"
            data={[
              { value: 'basic', label: 'Basic Plan' },
              { value: 'pro', label: 'Pro Plan' },
              { value: 'enterprise', label: 'Enterprise Plan' },
            ]}
            disabled
          />

          <div>
            <Text component="label" htmlFor="next-billing-date" fw={500} size="sm" mb={4} style={{ display: 'block' }}>
              Next billing date
            </Text>
            <DateInput
              id="next-billing-date"
              value={billingDate}
              onChange={setBillingDate}
              valueFormat="YYYY-MM-DD"
              placeholder="YYYY-MM-DD"
              data-testid="next-billing-date"
            />
          </div>

          <Group justify="flex-end" mt="xl">
            <Button variant="subtle" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave} data-testid="save-changes">
              Save changes
            </Button>
          </Group>
        </Stack>
      </Drawer>
    </>
  );
}
