'use client';

/**
 * date_picker_single-mantine-T05: Set backup date in dark settings panel
 *
 * Scene: Settings panel layout (settings_panel) in dark theme with comfortable spacing and default scale.
 *
 * Target component: One Mantine DatePickerInput labeled "Next backup date".
 * - Initial state: empty.
 * - Interaction: Clicking the input opens a popover calendar.
 *
 * Distractors (medium clutter): toggles for "Automatic backups", a select for "Retention period", and a slider for "Bandwidth limit".
 *
 * Feedback: Selecting a day updates the input immediately. Dark theme reduces contrast between selected and unselected day styles.
 *
 * Success: Date picker must have selected date = 2026-12-01.
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Switch, Select, Slider, Stack } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import dayjs from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T05({ onSuccess }: TaskComponentProps) {
  const [nextBackupDate, setNextBackupDate] = useState<Date | null>(null);
  const [autoBackups, setAutoBackups] = useState(true);
  const [retention, setRetention] = useState<string | null>('30');
  const [bandwidth, setBandwidth] = useState(50);

  useEffect(() => {
    if (nextBackupDate && dayjs(nextBackupDate).format('YYYY-MM-DD') === '2026-12-01') {
      onSuccess();
    }
  }, [nextBackupDate, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 450 }}>
      <Text fw={600} size="lg" mb="md">Backup settings</Text>
      
      <Stack gap="md">
        <Switch
          label="Automatic backups"
          checked={autoBackups}
          onChange={(e) => setAutoBackups(e.currentTarget.checked)}
          data-testid="auto-backups"
        />

        <div>
          <Text component="label" fw={500} size="sm" mb={4} style={{ display: 'block' }}>
            Retention period
          </Text>
          <Select
            value={retention}
            onChange={setRetention}
            data={[
              { value: '7', label: '7 days' },
              { value: '14', label: '14 days' },
              { value: '30', label: '30 days' },
              { value: '90', label: '90 days' },
            ]}
            data-testid="retention-period"
          />
        </div>

        <div>
          <Text component="label" fw={500} size="sm" mb={4} style={{ display: 'block' }}>
            Next backup date
          </Text>
          <DatePickerInput
            value={nextBackupDate}
            onChange={setNextBackupDate}
            valueFormat="YYYY-MM-DD"
            placeholder="Pick date"
            data-testid="next-backup-date"
          />
        </div>

        <div>
          <Text component="label" fw={500} size="sm" mb={4} style={{ display: 'block' }}>
            Bandwidth limit: {bandwidth}%
          </Text>
          <Slider
            value={bandwidth}
            onChange={setBandwidth}
            min={0}
            max={100}
            data-testid="bandwidth-limit"
          />
        </div>
      </Stack>
    </Card>
  );
}
