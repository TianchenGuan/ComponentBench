'use client';

/**
 * tags_input-mui-T01: Add one free-solo chip
 *
 * The page shows a centered card titled "Quick note".
 * Inside the card is a single MUI Autocomplete configured with:
 * - `multiple` selection (values render as Chips inside the input)
 * - `freeSolo` enabled (arbitrary values can be entered and committed)
 *
 * The field label is "Tags". The input starts empty and shows placeholder text "Type a tag and press Enter".
 * When a tag is committed, it appears as a Chip with a small delete (×) icon.
 *
 * There are no other inputs; the only benign distractor is a disabled "Share" icon button in the card header.
 *
 * Success: The target Tags Input component contains exactly these tags (order does not matter): travel.
 */

import React, { useRef, useEffect } from 'react';
import { Card, CardContent, Typography, Autocomplete, TextField, Chip, IconButton } from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import type { TaskComponentProps } from '../types';

export default function T01({ onSuccess }: TaskComponentProps) {
  const [tags, setTags] = React.useState<string[]>([]);
  const hasSucceeded = useRef(false);

  useEffect(() => {
    const normalizedTags = tags.map(t => t.toLowerCase().trim());
    const requiredTags = ['travel'];
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Typography variant="h6">Quick note</Typography>
          <IconButton disabled size="small">
            <ShareIcon />
          </IconButton>
        </div>
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
              label="Tags"
              placeholder="Type a tag and press Enter"
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
