'use client';

/**
 * date_picker_range-mantine-v2-T19: Promo dates in modal range picker with preset decoys
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, Stack, Group, Badge, Button, Drawer, Chip } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import dayjs from 'dayjs';
import type { TaskComponentProps } from '../../types';

const REVIEW_FIXED: [Date, Date] = [new Date(2027, 7, 1), new Date(2027, 7, 7)];

export default function T19({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [reviewValue] = useState<[Date | null, Date | null]>(REVIEW_FIXED);
  const [promoValue, setPromoValue] = useState<[Date | null, Date | null]>([null, null]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (successFired.current) return;
    if (
      saved &&
      promoValue[0] &&
      promoValue[1] &&
      dayjs(promoValue[0]).format('YYYY-MM-DD') === '2027-08-29' &&
      dayjs(promoValue[1]).format('YYYY-MM-DD') === '2027-09-04' &&
      dayjs(reviewValue[0]!).format('YYYY-MM-DD') === '2027-08-01' &&
      dayjs(reviewValue[1]!).format('YYYY-MM-DD') === '2027-08-07'
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, promoValue, reviewValue, onSuccess]);

  const applyPreset = (start: Date, end: Date) => {
    setPromoValue([start, end]);
    setSaved(false);
  };

  const handleSave = () => setSaved(true);

  return (
    <>
      <Card shadow="sm" padding="md" radius="md" withBorder maw={480}>
        <Text fw={600} mb="sm">Promotions</Text>
        <Text size="sm" c="dimmed" mb="md">
          Manage promotional date ranges for upcoming campaigns.
        </Text>
        <Button onClick={() => setDrawerOpen(true)} data-testid="edit-promo-dates-btn">
          Edit promo dates
        </Button>
      </Card>

      <Drawer
        opened={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Edit promo dates"
        position="right"
        size="md"
      >
        {/* Reference card */}
        <Card shadow="xs" padding="sm" radius="sm" withBorder mb="md" data-testid="promo-reference-card">
          <Group gap="xs" mb="xs">
            <Badge color="orange" variant="light">Reference</Badge>
          </Group>
          <Text size="sm" fw={500}>Target promo period</Text>
          <Text size="sm" c="dimmed">
            Start: <Text span fw={600}>August 29, 2027</Text>
          </Text>
          <Text size="sm" c="dimmed">
            End: <Text span fw={600}>September 4, 2027</Text>
          </Text>
        </Card>

        {/* Preset chips (decoys) */}
        <Text size="sm" fw={500} mb="xs">Quick presets</Text>
        <Group gap="xs" mb="md">
          <Chip onClick={() => applyPreset(new Date(2027, 7, 25), new Date(2027, 7, 31))}>
            Last 7 days
          </Chip>
          <Chip onClick={() => applyPreset(new Date(2027, 7, 1), new Date(2027, 7, 31))}>
            This month
          </Chip>
          <Chip onClick={() => applyPreset(new Date(2027, 8, 1), new Date(2027, 8, 7))}>
            Next week
          </Chip>
        </Group>

        <Stack gap="md">
          <div>
            <Text component="label" fw={500} size="sm" mb={4} style={{ display: 'block' }}>
              Review dates
            </Text>
            <DatePickerInput
              type="range"
              value={reviewValue}
              valueFormat="YYYY-MM-DD"
              data-testid="review-dates-range"
              readOnly
            />
          </div>

          <div>
            <Text component="label" fw={500} size="sm" mb={4} style={{ display: 'block' }}>
              Promo dates
            </Text>
            <DatePickerInput
              type="range"
              value={promoValue}
              onChange={(v) => { setPromoValue(v); setSaved(false); }}
              valueFormat="YYYY-MM-DD"
              placeholder="Pick dates range"
              dropdownType="modal"
              data-testid="promo-dates-range"
              defaultDate={new Date(2027, 7, 1)}
            />
          </div>

          <Button
            data-testid="save-promo"
            onClick={handleSave}
          >
            Save promo
          </Button>
        </Stack>
      </Drawer>
    </>
  );
}
