'use client';

/**
 * combobox_editable_multi-mui-T06: Match status labels from reference chips
 *
 * Centered isolated card titled "Workflow labels".
 * Left side (interactive):
 * - Material UI Autocomplete with multiple=true and freeSolo=true labeled "Status labels".
 * - Initial chips: none.
 * Right side (reference, non-interactive):
 * - A row labeled "Target labels" displays the desired chips.
 * - The target chips shown are: "P1", "Customer", "UI".
 * The suggestions list includes P0, P1, P2, Customer, Internal, UI, Backend, Docs, etc.
 * To succeed, the selected chips in "Status labels" must exactly match the reference chips (order-insensitive).
 *
 * Success: Selected values equal {P1, Customer, UI} (order-insensitive).
 */

import React, { useState, useEffect } from 'react';
import { Autocomplete, TextField, Card, CardContent, Typography, Chip, Box, Grid } from '@mui/material';
import type { TaskComponentProps } from '../types';
import { setsEqual } from '../types';

const suggestions = ['P0', 'P1', 'P2', 'Customer', 'Internal', 'UI', 'Backend', 'Docs', 'API', 'Testing'];

const TARGET_SET = ['P1', 'Customer', 'UI'];

export default function T06({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string[]>([]);

  useEffect(() => {
    if (setsEqual(value, TARGET_SET)) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card sx={{ width: 600 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Workflow labels</Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Typography variant="subtitle2" gutterBottom>Status labels</Typography>
            <Autocomplete
              data-testid="status-labels"
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
                <TextField {...params} placeholder="Add labels" size="small" />
              )}
            />
          </Grid>
          
          <Grid item xs={6}>
            <Typography variant="subtitle2" gutterBottom>Target labels</Typography>
            <Box data-testid="target-labels-preview" sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
              <Chip label="P1" size="small" color="primary" />
              <Chip label="Customer" size="small" color="secondary" />
              <Chip label="UI" size="small" color="info" />
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
