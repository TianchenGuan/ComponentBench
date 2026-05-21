'use client';

/**
 * autocomplete_freeform-mui-T06: Match a release label from a reference chip
 *
 * setup_description:
 * A centered isolated card titled "Release" contains a small visual reference chip and a MUI Autocomplete.
 *
 * At the top of the card there is a non-interactive MUI Chip labeled "Reference" displaying "Beta-7". Below it, the target MUI Autocomplete is labeled "Release label" and is configured with freeSolo so custom labels are allowed.
 *
 * Suggestions include similar labels such as "Beta-6", "Beta-7", "Beta-70", "Release Candidate". Initial state: the input is empty. Distractors: the chip and a short description paragraph. Feedback: the chosen label is shown in the input.
 *
 * Success: The "Release label" Autocomplete input's displayed value equals "Beta-7" (trim whitespace). Case-sensitive.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Autocomplete, TextField, Card, CardContent, Typography, Chip, Stack, Box } from '@mui/material';
import type { TaskComponentProps } from '../types';

const releaseLabels = ['Beta-6', 'Beta-7', 'Beta-70', 'Release Candidate'];

export default function T06({ onSuccess }: TaskComponentProps) {
  const [inputValue, setInputValue] = useState('');
  const successFired = useRef(false);

  const normalizedValue = inputValue.trim();
  const targetValue = 'Beta-7';

  useEffect(() => {
    if (!successFired.current && normalizedValue === targetValue) {
      successFired.current = true;
      onSuccess();
    }
  }, [normalizedValue, onSuccess]);

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Release</Typography>
        <Stack spacing={2}>
          <Box>
            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
              Reference
            </Typography>
            <Chip data-testid="reference-chip" label="Beta-7" color="primary" />
          </Box>
          <Typography variant="body2" color="text.secondary">
            Set the release label to match the reference chip above.
          </Typography>
          <div>
            <Typography variant="subtitle2" gutterBottom>Release label</Typography>
            <Autocomplete
              data-testid="release-label"
              freeSolo
              options={releaseLabels}
              inputValue={inputValue}
              onInputChange={(_event, newValue) => setInputValue(newValue)}
              renderInput={(params) => (
                <TextField {...params} placeholder="Enter release label" size="small" />
              )}
            />
          </div>
        </Stack>
      </CardContent>
    </Card>
  );
}
