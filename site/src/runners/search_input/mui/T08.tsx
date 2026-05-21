'use client';

/**
 * search_input-mui-T08: Enter a formatted ticket ID in a compact small field
 *
 * Isolated card centered in the viewport titled "Support".
 * The search input is a small-sized MUI TextField labeled "Ticket ID" with compact spacing and a startAdornment search icon.
 * The field enforces a formatted pattern shown as helper text: "Format: TCK-####".
 * Initial state: empty. If the input does not match the pattern, the field shows an error state (red helper text "Invalid ID").
 * Feedback: when the correct ID is entered and Enter is pressed, an inline status updates to "Loaded ticket: TCK-2048".
 * No other controls.
 *
 * Success: The "Ticket ID" search field has submitted_query equal to "TCK-2048".
 */

import React, { useState, useRef } from 'react';
import { Card, CardContent, TextField, InputAdornment, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import type { TaskComponentProps } from '../types';

const PATTERN = /^TCK-\d{4}$/;

export default function T08({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState<string | null>(null);
  const hasSucceeded = useRef(false);

  const isValid = value === '' || PATTERN.test(value);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && PATTERN.test(value)) {
      setSubmittedQuery(value);
      if (value === 'TCK-2048' && !hasSucceeded.current) {
        hasSucceeded.current = true;
        onSuccess();
      }
    }
  };

  return (
    <Card sx={{ width: 350 }}>
      <CardContent sx={{ py: 1.5 }}>
        <Typography variant="h6" gutterBottom sx={{ fontSize: 16 }}>
          Support
        </Typography>
        <TextField
          id="search-ticket"
          label="Ticket ID"
          placeholder="TCK-____"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          fullWidth
          size="small"
          error={!isValid}
          helperText={isValid ? 'Format: TCK-####' : 'Invalid ID'}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
          inputProps={{
            'data-testid': 'search-ticket',
          }}
        />
        {submittedQuery && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontSize: 12 }}>
            Loaded ticket: {submittedQuery}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
