'use client';

/**
 * combobox_editable_multi-mui-T02: Add two custom issue labels
 *
 * Centered isolated card titled "Issue triage".
 * - Component: Material UI Autocomplete configured with multiple=true and freeSolo=true so it accepts arbitrary values as chips.
 * - Label: "Issue labels"
 * - Placeholder: "Type a label and press Enter"
 * - Suggestions include common labels (bug, feature, urgent), but the target labels "blocked" and "needs-review" are not present as predefined options.
 * - Initial state: empty selection.
 * Behavior:
 * - Typing a value and pressing Enter creates a chip.
 * - Chips can be removed with their small close icon.
 *
 * Success: Selected values equal {blocked, needs-review} (order-insensitive).
 */

import React, { useState, useEffect } from 'react';
import { Autocomplete, TextField, Card, CardContent, Typography, Chip } from '@mui/material';
import type { TaskComponentProps } from '../types';
import { setsEqual } from '../types';

const suggestions = ['bug', 'feature', 'urgent', 'enhancement', 'documentation'];

const TARGET_SET = ['blocked', 'needs-review'];

export default function T02({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string[]>([]);

  useEffect(() => {
    if (setsEqual(value, TARGET_SET)) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Issue triage</Typography>
        <Typography variant="subtitle2" gutterBottom>Issue labels</Typography>
        <Autocomplete
          data-testid="issue-labels"
          multiple
          freeSolo
          options={suggestions}
          value={value}
          onChange={(_event, newValue) => setValue(newValue as string[])}
          renderTags={(tagValue, getTagProps) =>
            tagValue.map((option, index) => (
              <Chip {...getTagProps({ index })} key={option} label={option} size="small" />
            ))
          }
          renderInput={(params) => (
            <TextField {...params} placeholder="Type a label and press Enter" size="small" />
          )}
        />
      </CardContent>
    </Card>
  );
}
