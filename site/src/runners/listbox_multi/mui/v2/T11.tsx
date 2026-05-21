'use client';

/**
 * listbox_multi-mui-v2-T11: Searchable available columns list in drawer
 *
 * Right-side Drawer with two searchable MUI checkbox lists: Available columns (TARGET, 30+ items)
 * and Pinned columns. Search filters only the focused list. Available initial: none.
 * Pinned initial: Name, Status (must remain unchanged).
 * Target Available: Last seen, Plan, MRR. Confirm via "Save columns". Dark theme.
 */

import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Button, Card, CardContent, Typography, Drawer, List, ListItem,
  ListItemButton, ListItemIcon, ListItemText, Checkbox, TextField, Divider, Box,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import type { TaskComponentProps } from '../../types';
import { setsEqual } from '../../types';

const darkTheme = createTheme({ palette: { mode: 'dark' } });

const availableCols = [
  'Account ID', 'Account name', 'ARR', 'Billing address', 'City',
  'Company size', 'Contract end', 'Contract start', 'Country', 'Created at',
  'Currency', 'Domain', 'Email', 'First name', 'Industry',
  'Last active', 'Last login', 'Last name', 'Last seen', 'Lead source',
  'Lifecycle stage', 'MRR', 'Notes', 'Owner', 'Phone',
  'Plan', 'Plan note', 'Region', 'Renewal date', 'Revenue',
  'Seats', 'Segment', 'Source', 'State', 'Tags',
  'Tax ID', 'Team', 'Timezone', 'Trial end', 'Updated at',
];

const pinnedCols = ['Name', 'Status', 'Email', 'Created at', 'Last login'];

const targetAvailable = ['Last seen', 'Plan', 'MRR'];
const pinnedInitial = ['Name', 'Status'];

function SearchableCheckboxList({
  options, selected, onToggle, search, onSearchChange, label,
}: {
  options: string[]; selected: string[]; onToggle: (v: string) => void;
  search: string; onSearchChange: (v: string) => void; label: string;
}) {
  const filtered = useMemo(
    () => options.filter(o => o.toLowerCase().includes(search.toLowerCase())),
    [options, search],
  );
  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>{label}</Typography>
      <TextField
        size="small"
        placeholder={`Search ${label.toLowerCase()}…`}
        value={search}
        onChange={e => onSearchChange(e.target.value)}
        fullWidth
        sx={{ mb: 1 }}
        InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }}
      />
      <List dense sx={{ maxHeight: 220, overflow: 'auto', border: '1px solid #424242', borderRadius: 1 }}>
        {filtered.map(opt => (
          <ListItem key={opt} disablePadding>
            <ListItemButton dense onClick={() => onToggle(opt)}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <Checkbox edge="start" size="small" checked={selected.includes(opt)} tabIndex={-1} disableRipple />
              </ListItemIcon>
              <ListItemText primary={opt} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default function T11({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [available, setAvailable] = useState<string[]>([]);
  const [pinned, setPinned] = useState<string[]>(['Name', 'Status']);
  const [availSearch, setAvailSearch] = useState('');
  const [pinnedSearch, setPinnedSearch] = useState('');
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (saved && setsEqual(available, targetAvailable) && setsEqual(pinned, pinnedInitial)) {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, available, pinned, onSuccess]);

  const toggle = (list: string[], setList: (v: string[]) => void, value: string) => {
    const idx = list.indexOf(value);
    const next = [...list];
    if (idx === -1) next.push(value); else next.splice(idx, 1);
    setList(next);
    setSaved(false);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ p: 3, minHeight: '100vh' }}>
        <Card sx={{ maxWidth: 440 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Table Settings</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Customize which columns appear in the data table
            </Typography>
            <Button variant="contained" onClick={() => { setDrawerOpen(true); setSaved(false); }}>
              Column manager
            </Button>
          </CardContent>
        </Card>

        <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
          <Box sx={{ width: 380, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Typography variant="h6" sx={{ p: 2, pb: 0 }}>Column manager</Typography>

            <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
              <SearchableCheckboxList
                label="Available columns"
                options={availableCols}
                selected={available}
                onToggle={v => toggle(available, setAvailable, v)}
                search={availSearch}
                onSearchChange={setAvailSearch}
              />

              <Divider sx={{ my: 2 }} />

              <SearchableCheckboxList
                label="Pinned columns"
                options={pinnedCols}
                selected={pinned}
                onToggle={v => toggle(pinned, setPinned, v)}
                search={pinnedSearch}
                onSearchChange={setPinnedSearch}
              />
            </Box>

            <Box sx={{ p: 2, borderTop: '1px solid #424242', display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <Button onClick={() => setDrawerOpen(false)}>Cancel</Button>
              <Button variant="contained" onClick={() => { setSaved(true); setDrawerOpen(false); }}>
                Save columns
              </Button>
            </Box>
          </Box>
        </Drawer>
      </Box>
    </ThemeProvider>
  );
}
