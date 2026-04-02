'use client';

/**
 * search_input-mui-T06: Match a reference tag and submit (Log search)
 *
 * An isolated card anchored near the bottom-left of the viewport titled "Logs", rendered in dark theme.
 * The card shows a bold "Reference" tag (visual chip) with the target phrase "error 503".
 * Below it is a MUI TextField labeled "Log search" with a startAdornment search icon.
 * Initial state: empty. Helper text: "Press Enter to run search".
 * Feedback: after pressing Enter, a small inline line updates to "Last searched: error 503".
 * No other interactive elements.
 *
 * Success: The TextField labeled "Log search" has submitted_query equal to "error 503" (submitted via Enter).
 */

import React, { useState, useRef } from 'react';
import { Card, CardContent, TextField, InputAdornment, Typography, Chip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import type { TaskComponentProps } from '../types';

export default function T06({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState<string | null>(null);
  const hasSucceeded = useRef(false);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setSubmittedQuery(value);
      if (value === 'error 503' && !hasSucceeded.current) {
        hasSucceeded.current = true;
        onSuccess();
      }
    }
  };

  return (
    <Card sx={{ width: 400, bgcolor: '#1e1e1e', color: '#fff' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ color: '#fff' }}>
          Logs
        </Typography>
        
        <Chip
          label="Reference: error 503"
          sx={{ 
            mb: 2, 
            bgcolor: '#333', 
            color: '#fff',
            fontWeight: 'bold',
          }}
        />

        <TextField
          id="search-log"
          label="Log search"
          placeholder="Search logs…"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          fullWidth
          helperText="Press Enter to run search"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#aaa' }} />
              </InputAdornment>
            ),
          }}
          inputProps={{
            'data-testid': 'search-log',
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              color: '#fff',
              '& fieldset': { borderColor: '#555' },
              '&:hover fieldset': { borderColor: '#777' },
            },
            '& .MuiInputLabel-root': { color: '#aaa' },
            '& .MuiFormHelperText-root': { color: '#888' },
          }}
        />
        {submittedQuery && (
          <Typography variant="body2" sx={{ mt: 1, color: '#aaa' }}>
            Last searched: {submittedQuery}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
