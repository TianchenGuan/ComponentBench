'use client';

/**
 * mentions_input-mui-T03: MUI draft: clear all content
 *
 * You are on a "Clear the draft" card.
 * - Target component: one composite mentions input labeled Draft (MUI TextField multiline).
 * - The Draft field has a visible clear icon button inside the input on the right (an InputAdornment with an "X").
 * - Initial state: Draft contains:
 *   "Ping @Liam Ortiz about the regression"
 *   and the helper line shows "Detected mentions: Liam Ortiz".
 * - The Popper suggestions dropdown is closed.
 *
 * No other components are required.
 *
 * Success: Draft field must be empty (text == "" after whitespace normalization).
 *          Detected mentions must be empty.
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Card, CardContent, CardHeader,
  TextField, Typography, IconButton, InputAdornment
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import type { TaskComponentProps } from '../types';
import { normalizeWhitespace, deriveMentionsFromText } from '../types';

const USERS = [
  { id: 'liam', label: 'Liam Ortiz' },
] as const;

export default function T03({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('Ping @Liam Ortiz about the regression');
  const mentions = deriveMentionsFromText(value, USERS);
  const hasSucceeded = useRef(false);

  const handleClear = () => {
    setValue('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
  };

  useEffect(() => {
    const normalizedText = normalizeWhitespace(value);
    
    if (
      normalizedText === '' &&
      mentions.length === 0 &&
      !hasSucceeded.current
    ) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [value, mentions, onSuccess]);

  return (
    <Card sx={{ width: 450 }}>
      <CardHeader title="Clear the draft" />
      <CardContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Draft: clear it completely.
        </Typography>
        <TextField
          label="Draft"
          placeholder="Type @ to mention"
          value={value}
          onChange={handleChange}
          multiline
          rows={3}
          fullWidth
          data-testid="draft-textfield"
          InputProps={{
            endAdornment: value ? (
              <InputAdornment position="end">
                <IconButton
                  aria-label="Clear"
                  onClick={handleClear}
                  edge="end"
                  data-testid="clear-button"
                >
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ) : null
          }}
        />
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          Detected mentions: {mentions.length > 0 ? mentions.map(m => m.label).join(', ') : '(none)'}
        </Typography>
      </CardContent>
    </Card>
  );
}
