'use client';

/**
 * select_native-mui-v2-T26: Preferences modal — set Time format to 24-hour and save
 *
 * "Preferences" button opens a centered MUI Dialog with two NativeSelect controls:
 * "Time format" (starts 12-hour → 24-hour) and "Date separator" (starts Slash, must stay).
 * A "Show seconds" checkbox sits above the footer. Footer: "Cancel" / "Save".
 *
 * Success: Time format = "24h"/"24-hour", Date separator = "Slash", Save clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Button, Card, CardContent, Typography, FormControl, InputLabel,
  NativeSelect, Dialog, DialogTitle, DialogContent, DialogActions,
  Box, Checkbox, FormControlLabel,
} from '@mui/material';
import type { TaskComponentProps } from '../../types';

const timeFormatOptions = [
  { label: '12-hour', value: '12h' },
  { label: '24-hour', value: '24h' },
];

const separatorOptions = [
  { label: 'Slash (/)', value: 'Slash' },
  { label: 'Dash (-)', value: 'Dash' },
  { label: 'Dot (.)', value: 'Dot' },
];

export default function T26({ onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const [timeFormat, setTimeFormat] = useState('12h');
  const [dateSeparator, setDateSeparator] = useState('Slash');
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (saved && timeFormat === '24h' && dateSeparator === 'Slash') {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, timeFormat, dateSeparator, onSuccess]);

  const handleSave = () => {
    setSaved(true);
    setOpen(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Card sx={{ maxWidth: 400 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Display Settings</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Configure date and time display preferences.
          </Typography>
          <Button variant="contained" onClick={() => setOpen(true)}>Preferences</Button>
        </CardContent>
      </Card>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Preferences</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 1 }}>
            <InputLabel variant="standard" htmlFor="time-format">Time format</InputLabel>
            <NativeSelect
              data-testid="time-format"
              data-canonical-type="select_native"
              data-selected-value={timeFormat}
              value={timeFormat}
              onChange={(e) => { setTimeFormat(e.target.value); setSaved(false); }}
              inputProps={{ name: 'time-format', id: 'time-format' }}
            >
              {timeFormatOptions.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </NativeSelect>
          </FormControl>

          <FormControl fullWidth sx={{ mt: 3 }}>
            <InputLabel variant="standard" htmlFor="date-separator">Date separator</InputLabel>
            <NativeSelect
              data-testid="date-separator"
              data-canonical-type="select_native"
              data-selected-value={dateSeparator}
              value={dateSeparator}
              onChange={(e) => { setDateSeparator(e.target.value); setSaved(false); }}
              inputProps={{ name: 'date-separator', id: 'date-separator' }}
            >
              {separatorOptions.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </NativeSelect>
          </FormControl>

          <FormControlLabel
            control={<Checkbox />}
            label="Show seconds"
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
