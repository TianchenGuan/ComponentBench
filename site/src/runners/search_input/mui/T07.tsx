'use client';

/**
 * search_input-mui-T07: Scroll to the Archived section and type in its search field
 *
 * Dashboard page with multiple stacked cards (clutter: high): "Overview", "Active items", "Reports", and finally "Archived items".
 * The target search input is a MUI TextField labeled "Archived items search" located inside the "Archived items" card near the bottom of the page (below the initial fold).
 * The field shows a startAdornment search icon; it filters the archived list live as you type (no Enter required).
 * Initial state: empty value and a list of archived items shown below.
 * Feedback: typing updates an inline count "Matches: …" in real time.
 * Other visible inputs and buttons in earlier cards are distractors only.
 *
 * Success: The "Archived items search" field value equals "legacy".
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, TextField, InputAdornment, Typography, Box, Button, List, ListItem, ListItemText } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import type { TaskComponentProps } from '../types';

const archivedItems = [
  'Legacy System V1',
  'Old Documentation',
  'Deprecated API',
  'Legacy Integration',
  'Archive 2020',
  'Backup Files',
  'Legacy Reports',
  'Old Templates',
];

export default function T07({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');
  const hasSucceeded = useRef(false);

  const filteredItems = archivedItems.filter(item =>
    item.toLowerCase().includes(value.toLowerCase())
  );

  useEffect(() => {
    if (value === 'legacy' && !hasSucceeded.current) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Box sx={{ maxHeight: '100vh', overflow: 'auto', p: 2 }}>
      {/* Overview Card */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Overview</Typography>
          <Typography variant="body2" color="text.secondary">
            Dashboard overview with key metrics and statistics.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Button variant="outlined">Refresh</Button>
            <Button variant="outlined">Export</Button>
          </Box>
        </CardContent>
      </Card>

      {/* Active Items Card */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Active items</Typography>
          <TextField
            label="Active items search"
            placeholder="Search active…"
            size="small"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <List dense>
            <ListItem><ListItemText primary="Item A" /></ListItem>
            <ListItem><ListItemText primary="Item B" /></ListItem>
            <ListItem><ListItemText primary="Item C" /></ListItem>
          </List>
        </CardContent>
      </Card>

      {/* Reports Card */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Reports</Typography>
          <Typography variant="body2" color="text.secondary">
            Generate and download reports.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Button variant="contained">Generate Report</Button>
            <Button variant="outlined">Schedule</Button>
          </Box>
        </CardContent>
      </Card>

      {/* Archived Items Card - Target */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Archived items</Typography>
          <TextField
            id="search-archived"
            label="Archived items search"
            placeholder="Search archived…"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            inputProps={{
              'data-testid': 'search-archived',
            }}
          />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Matches: {filteredItems.length}
          </Typography>
          <List dense>
            {filteredItems.map((item, index) => (
              <ListItem key={index}>
                <ListItemText primary={item} />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
}
