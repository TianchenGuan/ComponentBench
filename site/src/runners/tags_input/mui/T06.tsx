'use client';

/**
 * tags_input-mui-T06: Enter formatted ticket code tags (case-sensitive)
 *
 * The page shows a centered card titled "Engineering intake".
 * The only interactive control is a MUI Autocomplete (multiple chips) labeled "Ticket codes".
 *
 * Constraints:
 * - The component is configured for freeSolo entries (no required selection from a list).
 * - The placeholder text indicates that codes are case-sensitive and use the pattern AAA-###.
 * - The input has no suggestions; the user must type the codes exactly and press Enter to commit each chip.
 *
 * Initial state:
 * - The field is empty.
 *
 * Feedback:
 * - Each code appears as an uppercase Chip once committed.
 *
 * Success: The target Tags Input component contains exactly these tags (order does not matter): ENG-101, ENG-204.
 */

import React, { useRef, useEffect } from 'react';
import { Card, CardContent, Typography, Autocomplete, TextField, Chip } from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T06({ onSuccess }: TaskComponentProps) {
  const [tags, setTags] = React.useState<string[]>([]);
  const hasSucceeded = useRef(false);

  useEffect(() => {
    // Case-sensitive comparison
    const requiredTags = ['ENG-101', 'ENG-204'];
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
        <Typography variant="h6" gutterBottom>Engineering intake</Typography>
        <Autocomplete
          multiple
          freeSolo
          options={[]}
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
              label="Ticket codes"
              placeholder="Case-sensitive, e.g. ENG-101"
              helperText="Format: AAA-### (case-sensitive)"
              inputProps={{
                ...params.inputProps,
                'data-testid': 'ticket-codes-input',
                autoCapitalize: 'off',
                autoCorrect: 'off',
              }}
            />
          )}
        />
      </CardContent>
    </Card>
  );
}
