'use client';

/**
 * search_input-mui-T04: Dashboard disambiguation: submit Orders search via icon button
 *
 * Isolated card centered in the viewport titled "Search panel".
 * There are TWO MUI TextField-based search inputs:
 *   1) "Global search" (startAdornment icon only; Enter submits).
 *   2) "Orders search" (endAdornment contains an IconButton with a search icon; clicking it submits).
 * Initial state: both empty. Spacing and scale are default.
 * Low clutter: a passive "Tip: use keywords" text and a non-required "Clear all" link appear below, but success depends only on the Orders search submission.
 * Feedback: clicking the icon button in "Orders search" updates a caption under it to "Orders filtered by: invoice".
 *
 * Success: The search field instance labeled "Orders search" has submitted_query equal to "invoice".
 */

import React, { useState, useRef } from 'react';
import { Card, CardContent, TextField, InputAdornment, IconButton, Typography, Link, Stack } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import type { TaskComponentProps } from '../types';

export default function T04({ onSuccess }: TaskComponentProps) {
  const [globalValue, setGlobalValue] = useState('');
  const [ordersValue, setOrdersValue] = useState('');
  const [ordersSubmitted, setOrdersSubmitted] = useState<string | null>(null);
  const hasSucceeded = useRef(false);

  const handleOrdersSearch = () => {
    setOrdersSubmitted(ordersValue);
    if (ordersValue === 'invoice' && !hasSucceeded.current) {
      hasSucceeded.current = true;
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 450 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Search panel
        </Typography>
        <Stack spacing={2}>
          <TextField
            id="search-global"
            label="Global search"
            placeholder="Search the site…"
            value={globalValue}
            onChange={(e) => setGlobalValue(e.target.value)}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            inputProps={{
              'data-testid': 'search-global',
            }}
          />

          <div>
            <TextField
              id="search-orders"
              label="Orders search"
              placeholder="Search orders…"
              value={ordersValue}
              onChange={(e) => setOrdersValue(e.target.value)}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="Search orders"
                      onClick={handleOrdersSearch}
                      edge="end"
                    >
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              inputProps={{
                'data-testid': 'search-orders',
              }}
            />
            {ordersSubmitted && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Orders filtered by: {ordersSubmitted}
              </Typography>
            )}
          </div>

          <div>
            <Typography variant="body2" color="text.secondary">
              Tip: use keywords
            </Typography>
            <Link href="#" variant="body2" sx={{ fontSize: 12 }}>
              Clear all
            </Link>
          </div>
        </Stack>
      </CardContent>
    </Card>
  );
}
