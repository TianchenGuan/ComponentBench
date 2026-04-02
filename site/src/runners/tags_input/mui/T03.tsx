'use client';

/**
 * tags_input-mui-T03: Clear all chips using the clear indicator
 *
 * The page is a centered "Filters" card.
 * It contains one MUI Autocomplete in multiple mode with Chips, labeled "Tags".
 *
 * Initial state:
 * - The Tags field starts with three chips: "low", "medium", "high".
 *
 * Component controls:
 * - The input shows a clear (×) indicator button when it has values (standard MUI behavior unless disabled).
 * - Each chip also has its own delete icon; either approach works, but clearing all at once is simplest.
 *
 * Distractors:
 * - A "Reset all filters" text link appears below, but it does not affect the Tags field for this micro-task (it is a visual-only placeholder).
 *
 * Success: The target Tags Input component contains exactly these tags (order does not matter): (empty).
 */

import React, { useRef, useEffect } from 'react';
import { Card, CardContent, Typography, Autocomplete, TextField, Chip, Link } from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T03({ onSuccess }: TaskComponentProps) {
  const [tags, setTags] = React.useState<string[]>(['low', 'medium', 'high']);
  const hasSucceeded = useRef(false);

  useEffect(() => {
    if (tags.length === 0 && !hasSucceeded.current) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [tags, onSuccess]);

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Filters</Typography>
        <Autocomplete
          multiple
          freeSolo
          options={['low', 'medium', 'high', 'critical']}
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
              inputProps={{
                ...params.inputProps,
                'data-testid': 'tags-input',
              }}
            />
          )}
        />
        <Link
          component="button"
          variant="body2"
          sx={{ mt: 2, display: 'block' }}
          onClick={() => {/* placeholder */}}
        >
          Reset all filters
        </Link>
      </CardContent>
    </Card>
  );
}
