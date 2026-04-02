'use client';

/**
 * toggle_button_group_multi-mui-T13: Reminder schedule toggles
 *
 * Layout: isolated_card centered in the viewport.
 *
 * The card is labeled "Reminder schedule" and contains a MUI ToggleButtonGroup 
 * configured for multiple selection with three labeled buttons:
 * - Weekdays
 * - Weekends
 * - Holidays
 *
 * Initial state:
 * - Weekdays is selected.
 * - Weekends and Holidays are unselected.
 *
 * The group is full-width within the card, making each button fairly large and 
 * easy to click. No confirmation step.
 *
 * Success: Selected options equal exactly: Weekdays, Weekends
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import type { TaskComponentProps } from '../types';

const TARGET_SET = new Set(['Weekdays', 'Weekends']);

export default function T03({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string[]>(['Weekdays']);

  useEffect(() => {
    const currentSet = new Set(selected);
    if (currentSet.size === TARGET_SET.size && 
        Array.from(TARGET_SET).every(v => currentSet.has(v))) {
      onSuccess();
    }
  }, [selected, onSuccess]);

  const handleChange = (_: React.MouseEvent<HTMLElement>, newFormats: string[]) => {
    setSelected(newFormats);
  };

  return (
    <Card sx={{ width: 450 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Reminder schedule
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Select Weekdays and Weekends.
        </Typography>

        <ToggleButtonGroup
          value={selected}
          onChange={handleChange}
          aria-label="reminder schedule"
          fullWidth
          data-testid="reminder-schedule-group"
        >
          <ToggleButton value="Weekdays" aria-label="Weekdays" data-testid="schedule-weekdays">
            Weekdays
          </ToggleButton>
          <ToggleButton value="Weekends" aria-label="Weekends" data-testid="schedule-weekends">
            Weekends
          </ToggleButton>
          <ToggleButton value="Holidays" aria-label="Holidays" data-testid="schedule-holidays">
            Holidays
          </ToggleButton>
        </ToggleButtonGroup>
      </CardContent>
    </Card>
  );
}
