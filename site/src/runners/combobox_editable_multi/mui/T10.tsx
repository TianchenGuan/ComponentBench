'use client';

/**
 * combobox_editable_multi-mui-T10: Match 6 categories with collapsed chips (dark)
 *
 * Dark theme isolated card titled "Content routing".
 * Interactive area:
 * - Material UI Autocomplete with multiple selection labeled "Categories".
 * - It is configured with limitTags=2 so when the field is not focused, only two chips are shown and the rest collapse into a "+N" indicator.
 * - Initial chips: none.
 * Reference area (non-interactive):
 * - A row labeled "Target categories" shows the required chips: News, Sports, Finance, Travel, Tech, Health (6 total).
 * Options list includes those categories plus a few distractors (Entertainment, Weather, Science).
 * This task is difficult because the selected state may be partially collapsed; the agent may need to focus the input to reveal all chips for verification.
 *
 * Success: Selected values equal {News, Sports, Finance, Travel, Tech, Health} (order-insensitive).
 */

import React, { useState, useEffect } from 'react';
import { Autocomplete, TextField, Card, CardContent, Typography, Chip, Box, Grid } from '@mui/material';
import type { TaskComponentProps } from '../types';
import { setsEqual } from '../types';

const categories = ['News', 'Sports', 'Finance', 'Travel', 'Tech', 'Health', 'Entertainment', 'Weather', 'Science'];

const TARGET_SET = ['News', 'Sports', 'Finance', 'Travel', 'Tech', 'Health'];

export default function T10({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string[]>([]);

  useEffect(() => {
    if (setsEqual(value, TARGET_SET)) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card sx={{ width: 600 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Content routing</Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={7}>
            <Typography variant="subtitle2" gutterBottom>Categories</Typography>
            <Autocomplete
              data-testid="categories"
              multiple
              limitTags={2}
              options={categories}
              value={value}
              onChange={(_event, newValue) => setValue(newValue)}
              renderTags={(tagValue, getTagProps) =>
                tagValue.map((option, index) => (
                  <Chip {...getTagProps({ index })} key={option} label={option} size="small" />
                ))
              }
              renderInput={(params) => (
                <TextField {...params} placeholder="Select categories" size="small" />
              )}
            />
          </Grid>
          
          <Grid item xs={5}>
            <Typography variant="subtitle2" gutterBottom>Target categories</Typography>
            <Box data-testid="target-categories-preview" sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
              <Chip label="News" size="small" color="primary" />
              <Chip label="Sports" size="small" color="secondary" />
              <Chip label="Finance" size="small" color="success" />
              <Chip label="Travel" size="small" color="info" />
              <Chip label="Tech" size="small" color="warning" />
              <Chip label="Health" size="small" color="error" />
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
