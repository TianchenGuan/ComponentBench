'use client';

/**
 * autocomplete_freeform-mui-T08: Search and select within grouped suggestions (compact dashboard)
 *
 * setup_description:
 * A centered isolated card titled "Metric picker" contains one MUI Autocomplete labeled "Metric".
 *
 * The Autocomplete is freeSolo but provides a grouped suggestions list using headers such as "CPU", "Memory", and "Network". Options include similar phrases ("CPU Usage", "CPU User Time", "CPU System Time", "Memory Usage", "Network Usage"). The listbox is scrollable and uses compact spacing (reduced padding and smaller line height).
 *
 * Initial state: the Metric field is empty. Distractors: none. Feedback: selecting an option populates the Metric input with the selected text.
 *
 * Success: The "Metric" Autocomplete input's displayed value equals "CPU Usage" (trim whitespace). Case-sensitive.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Autocomplete, TextField, Card, CardContent, Typography } from '@mui/material';
import type { TaskComponentProps } from '../types';

interface MetricOption {
  group: string;
  label: string;
}

const metrics: MetricOption[] = [
  { group: 'CPU', label: 'CPU Usage' },
  { group: 'CPU', label: 'CPU User Time' },
  { group: 'CPU', label: 'CPU System Time' },
  { group: 'Memory', label: 'Memory Usage' },
  { group: 'Memory', label: 'Memory Cached' },
  { group: 'Memory', label: 'Memory Free' },
  { group: 'Network', label: 'Network Usage' },
  { group: 'Network', label: 'Network In' },
  { group: 'Network', label: 'Network Out' },
];

export default function T08({ onSuccess }: TaskComponentProps) {
  const [inputValue, setInputValue] = useState('');
  const successFired = useRef(false);

  const normalizedValue = inputValue.trim();
  const targetValue = 'CPU Usage';

  useEffect(() => {
    if (!successFired.current && normalizedValue === targetValue) {
      successFired.current = true;
      onSuccess();
    }
  }, [normalizedValue, onSuccess]);

  return (
    <Card sx={{ width: 400 }}>
      <CardContent sx={{ p: 1.5 }}>
        <Typography variant="subtitle1" gutterBottom>Metric picker</Typography>
        <Typography variant="caption" display="block" gutterBottom>Metric</Typography>
        <Autocomplete
          data-testid="metric"
          freeSolo
          options={metrics}
          groupBy={(option) => option.group}
          getOptionLabel={(option) => typeof option === 'string' ? option : option.label}
          inputValue={inputValue}
          onInputChange={(_event, newValue) => setInputValue(newValue)}
          size="small"
          ListboxProps={{ style: { maxHeight: 200 } }}
          renderInput={(params) => (
            <TextField {...params} placeholder="Select metric" size="small" />
          )}
        />
      </CardContent>
    </Card>
  );
}
