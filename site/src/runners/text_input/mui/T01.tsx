'use client';

/**
 * text_input-mui-T01: Set project name
 * 
 * Scene is a centered isolated card titled "New project". It contains a single MUI TextField labeled "Project
 * name" with an outlined variant and empty initial value. There are no other text inputs, no overlays, and no
 * required buttons to press. Spacing is comfortable and scale is default.
 * 
 * Success: The MUI TextField labeled "Project name" has value "Orion" (trim whitespace).
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, TextField, Typography } from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T01({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');

  useEffect(() => {
    if (value.trim() === 'Orion') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          New project
        </Typography>
        <TextField
          label="Project name"
          variant="outlined"
          fullWidth
          value={value}
          onChange={(e) => setValue(e.target.value)}
          inputProps={{ 'data-testid': 'project-name-input' }}
        />
      </CardContent>
    </Card>
  );
}
