'use client';

/**
 * date_input_text-mantine-T05: Mantine match a date from a packing slip preview
 * 
 * Layout: dashboard scene centered in the viewport.
 * Left pane: Mantine DateInput labeled "Delivery date" (valueFormat YYYY-MM-DD).
 * Right pane: "Packing slip preview" card with a large printed date line in a stylized header:
 *   "JUN 10 2026"
 * Initial state: Delivery date input is empty.
 * Clutter (low): the preview also shows a fake order number and address lines (non-interactive).
 * Feedback: once a valid date is entered, the Delivery date field displays it; the preview updates a small "Delivery date" line (cosmetic).
 * 
 * Success: The "Delivery date" DateInput value equals the reference date 2026-06-10.
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Grid, Box } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import dayjs from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T05({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<Date | null>(null);

  useEffect(() => {
    if (value && dayjs(value).format('YYYY-MM-DD') === '2026-06-10') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 560 }}>
      <Text fw={600} size="lg" mb="md">Shipping Dashboard</Text>
      
      <Grid>
        <Grid.Col span={6}>
          <div>
            <Text component="label" htmlFor="delivery-date" fw={500} size="sm" mb={4} style={{ display: 'block' }}>
              Delivery date
            </Text>
            <DateInput
              id="delivery-date"
              value={value}
              onChange={setValue}
              valueFormat="YYYY-MM-DD"
              placeholder="YYYY-MM-DD"
              data-testid="delivery-date"
            />
          </div>
        </Grid.Col>

        <Grid.Col span={6}>
          <Box
            data-testid="packing-slip-preview"
            style={{
              border: '2px solid #228be6',
              borderRadius: 8,
              padding: 16,
              backgroundColor: '#f8f9fa',
            }}
          >
            <Text size="xs" c="dimmed" ta="center" mb={4}>PACKING SLIP PREVIEW</Text>
            <Text size="xl" fw={700} c="blue" ta="center" style={{ letterSpacing: 1 }}>
              JUN 10 2026
            </Text>
            <Text size="xs" c="dimmed" mt="md">
              Order: #ORD-2026-12345
            </Text>
            <Text size="xs" c="dimmed">
              Ship to: 123 Main St, Anytown, USA
            </Text>
            {value && (
              <Text size="xs" c="dimmed" mt="sm">
                Delivery date: {dayjs(value).format('YYYY-MM-DD')}
              </Text>
            )}
          </Box>
        </Grid.Col>
      </Grid>
    </Card>
  );
}
