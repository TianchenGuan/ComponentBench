'use client';

/**
 * checkbox-mui-T03: Enable weekly summary (two checkbox instances)
 *
 * Layout: isolated card centered in the viewport titled "Summaries".
 * Inside are two Material UI checkboxes (each with a text label):
 *   - "Daily summary" (initially checked)
 *   - "Weekly summary" (initially unchecked)
 * There is no Save/Apply button; checkbox states apply immediately.
 * The task targets the checkbox labeled "Weekly summary".
 */

import React, { useState } from 'react';
import { Card, CardContent, Typography, FormControlLabel, Checkbox, FormGroup } from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T03({ onSuccess }: TaskComponentProps) {
  const [dailyChecked, setDailyChecked] = useState(true);
  const [weeklyChecked, setWeeklyChecked] = useState(false);

  const handleWeeklyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newChecked = event.target.checked;
    setWeeklyChecked(newChecked);
    if (newChecked) {
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Summaries
        </Typography>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={dailyChecked}
                onChange={(e) => setDailyChecked(e.target.checked)}
                data-testid="cb-daily-summary"
              />
            }
            label="Daily summary"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={weeklyChecked}
                onChange={handleWeeklyChange}
                data-testid="cb-weekly-summary"
              />
            }
            label="Weekly summary"
          />
        </FormGroup>
      </CardContent>
    </Card>
  );
}
