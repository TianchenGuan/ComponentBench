'use client';

/**
 * textarea-mui-T01: Quick review comment
 *
 * A centered card titled "Code review" contains a single MUI TextField configured with multiline=true.
 * - Light theme, comfortable spacing, default scale.
 * - Label: "Review comment". Initial value is empty with placeholder "Add a comment".
 * - Below the field is helper text "Be brief" (non-interactive).
 * - No other textareas are on the page.
 *
 * Success: Value equals "Looks good to me." (trim whitespace)
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, TextField, Typography } from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T01({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');

  useEffect(() => {
    if (value.trim() === 'Looks good to me.') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card sx={{ width: 450 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Code review
        </Typography>
        <TextField
          label="Review comment"
          multiline
          rows={3}
          fullWidth
          placeholder="Add a comment"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          helperText="Be brief"
          inputProps={{ 'data-testid': 'textarea-review-comment' }}
        />
      </CardContent>
    </Card>
  );
}
