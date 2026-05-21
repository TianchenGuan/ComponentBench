'use client';

/**
 * date_picker_range-mantine-v2-T20: Reference-matched manual range in a compact settings panel
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, Stack, Group, Badge, Button, Switch, SegmentedControl } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import dayjs from 'dayjs';
import type { TaskComponentProps } from '../../types';

const BILLING_FIXED: [Date, Date] = [new Date(2027, 5, 1), new Date(2027, 5, 7)];
const RETURNS_FIXED: [Date, Date] = [new Date(2027, 5, 10), new Date(2027, 5, 12)];

export default function T20({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);

  const [billingValue] = useState<[Date | null, Date | null]>(BILLING_FIXED);
  const [shippingValue, setShippingValue] = useState<[Date | null, Date | null]>([null, null]);
  const [returnsValue] = useState<[Date | null, Date | null]>(RETURNS_FIXED);
  const [applied, setApplied] = useState(false);
  const [mode, setMode] = useState('standard');
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    if (successFired.current) return;
    if (
      applied &&
      shippingValue[0] &&
      shippingValue[1] &&
      dayjs(shippingValue[0]).format('YYYY-MM-DD') === '2027-06-18' &&
      dayjs(shippingValue[1]).format('YYYY-MM-DD') === '2027-06-26' &&
      dayjs(billingValue[0]!).format('YYYY-MM-DD') === '2027-06-01' &&
      dayjs(billingValue[1]!).format('YYYY-MM-DD') === '2027-06-07' &&
      dayjs(returnsValue[0]!).format('YYYY-MM-DD') === '2027-06-10' &&
      dayjs(returnsValue[1]!).format('YYYY-MM-DD') === '2027-06-12'
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [applied, shippingValue, billingValue, returnsValue, onSuccess]);

  return (
    <Card shadow="sm" padding="sm" radius="md" withBorder maw={420}>
      {/* Reference card */}
      <Card shadow="xs" padding="xs" radius="sm" withBorder mb="sm" data-testid="shipping-reference">
        <Group gap="xs" mb={4}>
          <Badge size="xs" color="orange" variant="light">Reference</Badge>
        </Group>
        <Text size="xs" fw={500}>Shipping window target</Text>
        <Text size="xs" c="dimmed">
          Start: <Text span fw={600} size="xs">June 18, 2027</Text>
          {' — '}
          End: <Text span fw={600} size="xs">June 26, 2027</Text>
        </Text>
      </Card>

      <Group gap="xs" mb="sm" wrap="wrap">
        <Badge size="xs">Filters</Badge>
        <SegmentedControl
          size="xs"
          value={mode}
          onChange={setMode}
          data={['standard', 'express', 'freight']}
        />
        <Switch
          size="xs"
          label="Auto-refresh"
          checked={autoRefresh}
          onChange={(e) => setAutoRefresh(e.currentTarget.checked)}
        />
      </Group>

      <Stack gap="sm">
        <div>
          <Text component="label" fw={500} size="xs" mb={2} style={{ display: 'block' }}>
            Billing window
          </Text>
          <DatePickerInput
            type="range"
            value={billingValue}
            valueFormat="YYYY-MM-DD"
            size="xs"
            data-testid="billing-window-range"
            readOnly
          />
        </div>

        <div>
          <Text component="label" fw={500} size="xs" mb={2} style={{ display: 'block' }}>
            Shipping window
          </Text>
          <DatePickerInput
            type="range"
            value={shippingValue}
            onChange={(v) => { setShippingValue(v); setApplied(false); }}
            valueFormat="YYYY-MM-DD"
            placeholder="Pick dates range"
            size="xs"
            data-testid="shipping-window-range"
            defaultDate={new Date(2027, 5, 1)}
          />
        </div>

        <div>
          <Text component="label" fw={500} size="xs" mb={2} style={{ display: 'block' }}>
            Returns window
          </Text>
          <DatePickerInput
            type="range"
            value={returnsValue}
            valueFormat="YYYY-MM-DD"
            size="xs"
            data-testid="returns-window-range"
            readOnly
          />
        </div>

        <Button
          size="xs"
          data-testid="apply-filters"
          onClick={() => setApplied(true)}
        >
          Apply filters
        </Button>
      </Stack>
    </Card>
  );
}
