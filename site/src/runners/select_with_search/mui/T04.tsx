'use client';

/**
 * select_with_search-mui-T04: Open the Department suggestions without changing value
 *
 * Layout: isolated_card positioned near the top-left of the viewport (placement top_left) titled "Employee record".
 * Component: one MUI Autocomplete labeled "Department" with a popup icon (dropdown arrow).
 * Options: Engineering, Design, Marketing, Sales, Support.
 * Initial state: "Engineering" is selected.
 * Goal: open the suggestion popup (listbox visible) without selecting a different department.
 * The rest of the page is empty (no clutter).
 *
 * Success: The "Department" Autocomplete suggestion popup is open (listbox visible).
 *          The selected value remains "Engineering".
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, Typography, Autocomplete, TextField } from '@mui/material';
import type { TaskComponentProps } from '../types';

const departmentOptions = ['Engineering', 'Design', 'Marketing', 'Sales', 'Support'];

export default function T04({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string | null>('Engineering');
  const [open, setOpen] = useState(false);
  const hasTriggeredSuccess = useRef(false);

  useEffect(() => {
    // Trigger success when popup is opened and value is still Engineering
    if (open && value === 'Engineering' && !hasTriggeredSuccess.current) {
      hasTriggeredSuccess.current = true;
      onSuccess();
    }
  }, [open, value, onSuccess]);

  const handleChange = (_event: React.SyntheticEvent, newValue: string | null) => {
    setValue(newValue);
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Employee record</Typography>
        <Autocomplete
          data-testid="department-autocomplete"
          options={departmentOptions}
          value={value}
          onChange={handleChange}
          open={open}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          renderInput={(params) => (
            <TextField {...params} label="Department" />
          )}
        />
      </CardContent>
    </Card>
  );
}
