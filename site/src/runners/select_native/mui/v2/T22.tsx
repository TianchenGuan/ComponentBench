'use client';

/**
 * select_native-mui-v2-T22: Scaffolding drawer — choose Django from grouped native options and apply
 *
 * "Service scaffolding" button opens a drawer with one MUI NativeSelect labeled "Framework".
 * Options grouped via native <optgroup>: Frontend (React, Vue, Angular),
 * Backend (Express, Django, Rails), Data (Spark, Flink).
 * Starts at React. "Apply scaffold" commits.
 *
 * Success: Framework committed to "django"/"Django", Apply scaffold clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Button, Card, CardContent, Typography, FormControl, InputLabel,
  NativeSelect, Drawer, Box, Divider, TextField, Chip,
} from '@mui/material';
import type { TaskComponentProps } from '../../types';

export default function T22({ onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const [framework, setFramework] = useState('react');
  const [applied, setApplied] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (applied && framework === 'django') {
      successFired.current = true;
      onSuccess();
    }
  }, [applied, framework, onSuccess]);

  const handleApply = () => {
    setApplied(true);
    setOpen(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Card sx={{ maxWidth: 440 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Service Configuration</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Configure scaffolding templates for your microservices.
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Chip label="v2.1" size="small" />
            <Chip label="Production" size="small" variant="outlined" />
          </Box>
          <Button variant="contained" onClick={() => setOpen(true)}>Service scaffolding</Button>
        </CardContent>
      </Card>

      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: 380, p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Typography variant="h6" gutterBottom>Service Scaffolding</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Choose a framework template to scaffold your service.
          </Typography>

          <FormControl fullWidth sx={{ mt: 1 }}>
            <InputLabel variant="standard" htmlFor="framework-select">Framework</InputLabel>
            <NativeSelect
              data-testid="framework-select"
              data-canonical-type="select_native"
              data-selected-value={framework}
              value={framework}
              onChange={(e) => { setFramework(e.target.value); setApplied(false); }}
              inputProps={{ name: 'framework', id: 'framework-select' }}
            >
              <optgroup label="Frontend">
                <option value="react">React</option>
                <option value="vue">Vue</option>
                <option value="angular">Angular</option>
              </optgroup>
              <optgroup label="Backend">
                <option value="express">Express</option>
                <option value="django">Django</option>
                <option value="rails">Rails</option>
              </optgroup>
              <optgroup label="Data">
                <option value="spark">Spark</option>
                <option value="flink">Flink</option>
              </optgroup>
            </NativeSelect>
          </FormControl>

          <Divider sx={{ my: 3 }} />

          <TextField label="Service name" size="small" defaultValue="my-service" disabled sx={{ mb: 2 }} />
          <TextField label="Port" size="small" defaultValue="8080" disabled />

          <Card variant="outlined" sx={{ mt: 2, p: 1.5 }}>
            <Typography variant="caption" color="text.secondary">
              The selected template determines the base dependencies, directory structure, and CI config.
            </Typography>
          </Card>

          <Box sx={{ mt: 'auto', display: 'flex', gap: 1 }}>
            <Button variant="contained" onClick={handleApply}>Apply scaffold</Button>
            <Button variant="outlined" onClick={() => setOpen(false)}>Cancel</Button>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
}
