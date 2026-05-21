'use client';

/**
 * tags_input-mui-T07: Match the tag chips to the reference row
 *
 * The page is a centered card titled "Topic organizer".
 *
 * Reference (visual + text):
 * - A static row labeled "Reference tags" shows three MUI-styled chips: "research", "ui", and "benchmark".
 * - Immediately below is the interactive field labeled "Tags", implemented with a MUI Autocomplete (multiple chips, freeSolo).
 *
 * Initial state:
 * - The Tags field starts with two chips: "research" (correct) and "draft" (extra/incorrect).
 *
 * Behavior:
 * - Chips in the Tags field can be removed using each chip's delete icon.
 * - New chips can be created by typing a word and pressing Enter, or by selecting from the small suggestion list (which includes research/ui/benchmark).
 *
 * No other controls are present; the reference chips are not interactive and are not checked—only the Tags input state is checked.
 *
 * Success: The target Tags Input component contains exactly these tags (order does not matter): research, ui, benchmark.
 */

import React, { useRef, useEffect } from 'react';
import { Card, CardContent, Typography, Autocomplete, TextField, Chip, Box } from '@mui/material';
import type { TaskComponentProps } from '../types';

const suggestions = ['research', 'ui', 'benchmark', 'draft', 'analysis'];

export default function T07({ onSuccess }: TaskComponentProps) {
  const [tags, setTags] = React.useState<string[]>(['research', 'draft']);
  const hasSucceeded = useRef(false);

  useEffect(() => {
    const normalizedTags = tags.map(t => t.toLowerCase().trim());
    const requiredTags = ['research', 'ui', 'benchmark'];
    const isSuccess = requiredTags.length === normalizedTags.length &&
      requiredTags.every(t => normalizedTags.includes(t));
    
    if (isSuccess && !hasSucceeded.current) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [tags, onSuccess]);

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Topic organizer</Typography>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
            Reference tags
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip label="research" size="small" color="primary" variant="outlined" />
            <Chip label="ui" size="small" color="primary" variant="outlined" />
            <Chip label="benchmark" size="small" color="primary" variant="outlined" />
          </Box>
        </Box>

        <Autocomplete
          multiple
          freeSolo
          options={suggestions}
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
      </CardContent>
    </Card>
  );
}
