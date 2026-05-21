'use client';

/**
 * tags_input-mui-T02: Select two tags from the suggestion list
 *
 * The UI is a single centered card titled "Tech stack".
 * It contains one MUI Autocomplete with Chips (multiple selection). The label reads "Tags".
 *
 * Component configuration:
 * - The Autocomplete has a small predefined options list (shown in a popper listbox):
 *   React, Angular, Vue, Svelte, Solid.
 * - The popup opens when the input is focused or when the dropdown indicator is clicked.
 * - Selecting an option adds it as a Chip inside the input.
 *
 * Initial state:
 * - No chips are selected.
 *
 * No other form fields exist; below the control is a static paragraph describing what tags are used for.
 *
 * Success: The target Tags Input component contains exactly these tags (order does not matter): React, Vue.
 */

import React, { useRef, useEffect } from 'react';
import { Card, CardContent, Typography, Autocomplete, TextField, Chip } from '@mui/material';
import type { TaskComponentProps } from '../types';

const options = ['React', 'Angular', 'Vue', 'Svelte', 'Solid'];

export default function T02({ onSuccess }: TaskComponentProps) {
  const [tags, setTags] = React.useState<string[]>([]);
  const hasSucceeded = useRef(false);

  useEffect(() => {
    // Case-sensitive comparison for this task
    const requiredTags = ['React', 'Vue'];
    const isSuccess = requiredTags.length === tags.length &&
      requiredTags.every(t => tags.includes(t));
    
    if (isSuccess && !hasSucceeded.current) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [tags, onSuccess]);

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Tech stack</Typography>
        <Autocomplete
          multiple
          freeSolo
          options={options}
          value={tags}
          onChange={(_, newValue) => setTags(newValue as string[])}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                variant="outlined"
                label={option}
                size="small"
                {...getTagProps({ index })}
                key={index}
              />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Tags"
              placeholder="Select frameworks..."
              inputProps={{
                ...params.inputProps,
                'data-testid': 'tags-input',
              }}
            />
          )}
        />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Tags help categorize your project and improve discoverability.
        </Typography>
      </CardContent>
    </Card>
  );
}
