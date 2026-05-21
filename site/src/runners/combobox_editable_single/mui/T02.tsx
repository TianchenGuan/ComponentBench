'use client';

/**
 * combobox_editable_single-mui-T02: Open the Country dropdown
 *
 * A single isolated card titled "Shipping" is centered in the viewport.
 * It contains one editable combobox labeled "Country" implemented with MUI Autocomplete.
 * - Scene: isolated_card, center placement, light theme, comfortable spacing, default scale.
 * - Component behavior: Clicking the input or the popup indicator opens the listbox.
 * - Options: Canada, United States, Mexico, Brazil, United Kingdom, France, Germany, Spain, Italy, Japan, India, Australia.
 * - Initial state: empty.
 * - Distractors: none.
 *
 * Success: The "Country" combobox listbox is open/expanded.
 */

import React, { useState } from 'react';
import { Autocomplete, TextField, Card, CardContent, Typography } from '@mui/material';
import type { TaskComponentProps } from '../types';

const countries = [
  'Canada', 'United States', 'Mexico', 'Brazil', 'United Kingdom',
  'France', 'Germany', 'Spain', 'Italy', 'Japan', 'India', 'Australia',
];

export default function T02({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
    onSuccess();
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Shipping</Typography>
        <Typography variant="subtitle2" gutterBottom>Country</Typography>
        <Autocomplete
          data-testid="country-autocomplete"
          freeSolo
          options={countries}
          value={value}
          onChange={(_event, newValue) => setValue(newValue as string | null)}
          open={open}
          onOpen={handleOpen}
          onClose={() => setOpen(false)}
          renderInput={(params) => (
            <TextField {...params} placeholder="Select country" size="small" />
          )}
        />
      </CardContent>
    </Card>
  );
}
