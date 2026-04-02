'use client';

/**
 * select_custom_multi-mui-T01: Pick two newsletter topics
 *
 * Scene context: theme=light, spacing=comfortable, layout=isolated_card, placement=center, scale=default, instances=1, guidance=text, clutter=none.
 * Layout: isolated card centered titled "Newsletter".
 * Component: Material UI Autocomplete configured for multiple selections; selected items render as Chips inside the input.
 * Label: "Topics".
 * Options shown in the dropdown (6): Science, Technology, Business, Art, Sports, Travel.
 * Initial state: no chips selected; placeholder "Select topics".
 * Clicking the input opens a popper listbox below. Selection commits immediately when an option is clicked; there is no Apply button.
 * No other interactive controls are present.
 *
 * Success: The selected values are exactly: Technology, Travel (order does not matter).
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Autocomplete, TextField, Chip } from '@mui/material';
import type { TaskComponentProps } from '../types';

const options = ['Science', 'Technology', 'Business', 'Art', 'Sports', 'Travel'];

export default function T01({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    const targetSet = new Set(['Technology', 'Travel']);
    const currentSet = new Set(selected);
    if (currentSet.size === targetSet.size && Array.from(targetSet).every(v => currentSet.has(v))) {
      onSuccess();
    }
  }, [selected, onSuccess]);

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Newsletter</Typography>
        <Autocomplete
          multiple
          data-testid="topics-select"
          options={options}
          value={selected}
          onChange={(_, newValue) => setSelected(newValue)}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip label={option} {...getTagProps({ index })} key={option} />
            ))
          }
          renderInput={(params) => (
            <TextField {...params} label="Topics" placeholder="Select topics" />
          )}
        />
      </CardContent>
    </Card>
  );
}
