'use client';

/**
 * search_input-mui-T01: MUI TextField search: submit with Enter
 *
 * Baseline isolated card centered in the viewport titled "Products".
 * Contains a single MUI TextField labeled "Product search" with a magnifying-glass icon shown as a start InputAdornment.
 * Initial state: empty value. Helper text under the field says "Press Enter to search".
 * Feedback: pressing Enter updates a caption below the field to "Last searched: notebooks".
 * No other interactive elements are present.
 *
 * Success: The single MUI search TextField labeled "Product search" has submitted_query equal to "notebooks".
 */

import React, { useState, useRef } from 'react';
import { Card, CardContent, TextField, InputAdornment, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import type { TaskComponentProps } from '../types';

export default function T01({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState<string | null>(null);
  const hasSucceeded = useRef(false);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setSubmittedQuery(value);
      if (value === 'notebooks' && !hasSucceeded.current) {
        hasSucceeded.current = true;
        onSuccess();
      }
    }
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Products
        </Typography>
        <TextField
          id="search-product"
          label="Product search"
          placeholder="Search…"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          fullWidth
          helperText="Press Enter to search"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          inputProps={{
            'data-testid': 'search-product',
          }}
        />
        {submittedQuery && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Last searched: {submittedQuery}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
