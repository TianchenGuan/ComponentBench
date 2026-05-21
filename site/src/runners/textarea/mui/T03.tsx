'use client';

/**
 * textarea-mui-T03: Three-item grocery list
 *
 * A centered card titled "Shopping" contains one multiline MUI TextField.
 * - Light theme, comfortable spacing, default scale.
 * - Label: "Grocery list". The field is empty and shows a placeholder "One item per line".
 * - The field has 4 visible rows (rows=4) and does not autosize.
 * - No other text inputs are required.
 *
 * Success: Value equals exactly (whitespace=exact):
 *   - apples
 *   - bananas
 *   - cherries
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, TextField, Typography } from '@mui/material';
import type { TaskComponentProps } from '../types';

const TARGET_VALUE = `- apples
- bananas
- cherries`;

export default function T03({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');

  useEffect(() => {
    const normalized = value.replace(/\r\n/g, '\n');
    if (normalized === TARGET_VALUE) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card sx={{ width: 450 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Shopping
        </Typography>
        <TextField
          label="Grocery list"
          multiline
          rows={4}
          fullWidth
          placeholder="One item per line"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          inputProps={{ 'data-testid': 'textarea-grocery-list' }}
        />
      </CardContent>
    </Card>
  );
}
