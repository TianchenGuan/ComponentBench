'use client';

/**
 * select_custom_multi-mui-T08: Dense dark list: choose 5 numbered rotations
 *
 * Scene context: theme=dark, spacing=compact, layout=isolated_card, placement=center, scale=default, instances=1, guidance=text, clutter=none.
 * Theme: dark. Spacing: compact.
 * Layout: isolated card centered titled "Incident routing".
 * Component: MUI Autocomplete configured for multiple selection with a dense, scrollable listbox.
 * Label: "Pager rotations".
 * Options: 40 very similar items named "Rotation 01" through "Rotation 40" (two-digit numbers).
 * The listbox shows about 8 items at a time; scrolling is required to reach the higher numbers.
 * The input uses `limitTags=2`, so once more than two rotations are selected it shows two chips plus a "+N" indicator.
 * Initial state: two chips are preselected as distractors (Rotation 03 and Rotation 30).
 * No Save button; selection updates immediately.
 *
 * Success: The selected values are exactly: Rotation 07, Rotation 19, Rotation 23, Rotation 31, Rotation 38 (order does not matter).
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Autocomplete, TextField, Chip, ThemeProvider, createTheme } from '@mui/material';
import type { TaskComponentProps } from '../types';

// Generate rotation options from 01 to 40
const rotationOptions = Array.from({ length: 40 }, (_, i) => `Rotation ${String(i + 1).padStart(2, '0')}`);

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export default function T08({ task, onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string[]>(['Rotation 03', 'Rotation 30']);

  useEffect(() => {
    const targetSet = new Set(['Rotation 07', 'Rotation 19', 'Rotation 23', 'Rotation 31', 'Rotation 38']);
    const currentSet = new Set(selected);
    if (currentSet.size === targetSet.size && Array.from(targetSet).every(v => currentSet.has(v))) {
      onSuccess();
    }
  }, [selected, onSuccess]);

  const content = (
    <Card sx={{ width: 450 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Incident routing</Typography>
        <Autocomplete
          multiple
          size="small"
          data-testid="rotations-select"
          options={rotationOptions}
          value={selected}
          onChange={(_, newValue) => setSelected(newValue)}
          limitTags={2}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip label={option} size="small" {...getTagProps({ index })} key={option} />
            ))
          }
          renderInput={(params) => (
            <TextField {...params} label="Pager rotations" placeholder="Select rotations" size="small" />
          )}
          ListboxProps={{ style: { maxHeight: 250 } }}
        />
      </CardContent>
    </Card>
  );

  if (task.scene_context.theme === 'dark') {
    return <ThemeProvider theme={darkTheme}>{content}</ThemeProvider>;
  }

  return content;
}
