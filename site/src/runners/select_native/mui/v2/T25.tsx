'use client';

/**
 * select_native-mui-v2-T25: Scroll to Report format, set CSV, and save exports
 *
 * Tall settings panel rendered as internal scroll region. Multiple toggles and fields
 * above. Near the bottom, "Exports" section has a MUI NativeSelect "Report format"
 * (PDF/CSV/JSON, starts PDF). "Save export settings" commits section values.
 *
 * Success: Report format committed to "csv"/"CSV", Save export settings clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Card, CardContent, Typography, FormControl, InputLabel,
  NativeSelect, Button, Box, Switch, FormControlLabel, TextField,
  Divider,
} from '@mui/material';
import type { TaskComponentProps } from '../../types';

const formatOptions = [
  { label: 'PDF', value: 'pdf' },
  { label: 'CSV', value: 'csv' },
  { label: 'JSON', value: 'json' },
];

export default function T25({ onSuccess }: TaskComponentProps) {
  const [reportFormat, setReportFormat] = useState('pdf');
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (saved && reportFormat === 'csv') {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, reportFormat, onSuccess]);

  return (
    <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
      <Card sx={{ width: 480, maxHeight: 420, overflow: 'auto' }} data-testid="settings-panel">
        <CardContent>
          <Typography variant="h6" gutterBottom>Settings</Typography>

          {/* Filler sections to force scrolling */}
          <Typography variant="subtitle2" sx={{ mt: 2 }}>General</Typography>
          <Divider sx={{ mb: 1 }} />
          <FormControlLabel control={<Switch defaultChecked />} label="Enable notifications" />
          <FormControlLabel control={<Switch />} label="Dark mode" />
          <FormControlLabel control={<Switch defaultChecked />} label="Auto-save" />
          <TextField label="Display name" size="small" fullWidth defaultValue="Admin" sx={{ mt: 1 }} />
          <TextField label="Email" size="small" fullWidth defaultValue="admin@example.com" sx={{ mt: 1 }} />

          <Typography variant="subtitle2" sx={{ mt: 3 }}>Security</Typography>
          <Divider sx={{ mb: 1 }} />
          <FormControlLabel control={<Switch defaultChecked />} label="Two-factor authentication" />
          <FormControlLabel control={<Switch />} label="Session logging" />
          <TextField label="API key" size="small" fullWidth defaultValue="sk-xxxx" sx={{ mt: 1 }} disabled />

          <Typography variant="subtitle2" sx={{ mt: 3 }}>Integrations</Typography>
          <Divider sx={{ mb: 1 }} />
          <FormControlLabel control={<Switch />} label="Slack webhook" />
          <FormControlLabel control={<Switch defaultChecked />} label="GitHub sync" />
          <TextField label="Webhook URL" size="small" fullWidth defaultValue="https://hooks.example.com/..." sx={{ mt: 1 }} />

          <Typography variant="subtitle2" sx={{ mt: 3 }}>Exports</Typography>
          <Divider sx={{ mb: 1 }} />
          <FormControl fullWidth sx={{ mt: 1 }}>
            <InputLabel variant="standard" htmlFor="report-format">Report format</InputLabel>
            <NativeSelect
              data-testid="report-format"
              data-canonical-type="select_native"
              data-selected-value={reportFormat}
              value={reportFormat}
              onChange={(e) => { setReportFormat(e.target.value); setSaved(false); }}
              inputProps={{ name: 'report-format', id: 'report-format' }}
            >
              {formatOptions.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </NativeSelect>
          </FormControl>

          <Box sx={{ mt: 2 }}>
            <Button variant="contained" size="small" onClick={() => setSaved(true)}>
              Save export settings
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
