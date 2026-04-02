'use client';

/**
 * autocomplete_freeform-mui-T09: Add multiple freeSolo chips (dark theme)
 *
 * setup_description:
 * The page uses a dark theme and shows a centered isolated card titled "Ticket labels". The target control is a MUI Autocomplete configured with multiple=true and freeSolo=true, so values are represented as chips inside the input.
 *
 * Initial state: one chip "backend" is already present. The dropdown suggestion list includes common labels such as "urgent", "p0", "p1", "bug", "frontend". New values can be added by typing and pressing Enter, or by selecting an option from the popup list.
 *
 * The component supports removing chips via small delete (×) icons on each chip. Distractors: none. Feedback: chips update immediately as values are added/removed.
 *
 * Success: The Labels Autocomplete has selected chip values exactly {backend, urgent, p0} (order-insensitive; trim whitespace). Case-insensitive.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Autocomplete, TextField, Card, CardContent, Typography, Chip } from '@mui/material';
import type { TaskComponentProps } from '../types';

const labelSuggestions = ['backend', 'urgent', 'p0', 'p1', 'bug', 'frontend'];

export default function T09({ onSuccess }: TaskComponentProps) {
  const [values, setValues] = useState<string[]>(['backend']);
  const successFired = useRef(false);

  // Check for success: exactly {backend, urgent, p0} (case-insensitive)
  useEffect(() => {
    if (!successFired.current) {
      const normalizedValues = values.map(v => v.trim().toLowerCase());
      const targetValues = ['backend', 'urgent', 'p0'];
      
      const isMatch = normalizedValues.length === targetValues.length &&
        normalizedValues.every(v => targetValues.includes(v)) &&
        targetValues.every(v => normalizedValues.includes(v));
      
      if (isMatch) {
        successFired.current = true;
        onSuccess();
      }
    }
  }, [values, onSuccess]);

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Ticket labels</Typography>
        <Typography variant="subtitle2" gutterBottom>Labels</Typography>
        <Autocomplete
          data-testid="labels"
          multiple
          freeSolo
          options={labelSuggestions}
          value={values}
          onChange={(_event, newValues) => setValues(newValues)}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                variant="outlined"
                label={option}
                size="small"
                {...getTagProps({ index })}
                key={option}
              />
            ))
          }
          renderInput={(params) => (
            <TextField {...params} placeholder="Add labels" size="small" />
          )}
        />
      </CardContent>
    </Card>
  );
}
