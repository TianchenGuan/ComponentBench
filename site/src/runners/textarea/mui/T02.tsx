'use client';

/**
 * textarea-mui-T02: Clear a prefilled note
 *
 * A centered "Scratchpad" card in dark theme contains a MUI TextareaAutosize component.
 * - Dark theme, comfortable spacing, default scale.
 * - Label above: "Scratch note".
 * - The textarea starts with the value "Temp note - delete me".
 * - There is no dedicated clear button; users typically clear by selecting all and deleting.
 * - No other textareas are present.
 *
 * Success: Value equals "" (empty after trim)
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, TextareaAutosize } from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T02({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('Temp note - delete me');

  useEffect(() => {
    if (value.trim() === '') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card sx={{ width: 450, bgcolor: '#1f1f1f', borderColor: '#303030' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ color: '#fff' }}>
          Scratchpad
        </Typography>
        <Typography
          component="label"
          htmlFor="scratch-note"
          sx={{ display: 'block', mb: 1, fontWeight: 500, color: '#fff' }}
        >
          Scratch note
        </Typography>
        <TextareaAutosize
          id="scratch-note"
          minRows={3}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          data-testid="textarea-scratch-note"
          style={{
            width: '100%',
            padding: 12,
            fontFamily: 'inherit',
            fontSize: 14,
            background: '#141414',
            border: '1px solid #434343',
            borderRadius: 4,
            color: '#fff',
            resize: 'vertical',
          }}
        />
      </CardContent>
    </Card>
  );
}
