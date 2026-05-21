'use client';

/**
 * combobox_editable_single-mui-T06: Match Snack selection to the sample chip
 *
 * A centered isolated card titled "Snack picker" contains one editable MUI Autocomplete
 * combobox labeled "Snack" and a visual reference element.
 * - Scene: isolated_card layout, center placement, light theme, comfortable spacing, default scale.
 * - Guidance: A "Sample" chip shows the target snack.
 * - Options: Apple, Banana, Granola bar, Yogurt, Trail mix, Pretzels.
 * - Initial state: empty.
 * - Distractors: none.
 *
 * Success: The "Snack" combobox value matches the text shown in the Sample chip.
 */

import React, { useState } from 'react';
import { Autocomplete, TextField, Card, CardContent, Typography, Chip, Box } from '@mui/material';
import type { TaskComponentProps } from '../types';

const snacks = ['Apple', 'Banana', 'Granola bar', 'Yogurt', 'Trail mix', 'Pretzels'];

// Deterministic reference value
const referenceSnack = 'Granola bar';

export default function T06({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string | null>(null);

  const handleChange = (_event: React.SyntheticEvent, newValue: string | null) => {
    setValue(newValue);
    if (newValue === referenceSnack) {
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Snack picker</Typography>
        
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" color="text.secondary">Sample:</Typography>
          <Chip 
            id="snack-sample-chip"
            label={referenceSnack} 
            color="primary" 
            size="small" 
          />
        </Box>

        <Typography variant="subtitle2" gutterBottom>Snack</Typography>
        <Autocomplete
          data-testid="snack-autocomplete"
          freeSolo
          options={snacks}
          value={value}
          onChange={handleChange}
          renderInput={(params) => (
            <TextField {...params} placeholder="Select snack" size="small" />
          )}
        />
      </CardContent>
    </Card>
  );
}
