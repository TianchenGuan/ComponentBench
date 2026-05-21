'use client';

/**
 * autocomplete_freeform-mui-v2-T04: Allowed domains — replace one chip and add one custom domain
 *
 * Drawer with a multi freeSolo Autocomplete for "Domains". Starts with {example.com, example.net}.
 * Remove example.net, keep example.com, add suggested research.org, add custom labs.dev.
 * Final set: {example.com, research.org, labs.dev}. Click "Save domains".
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Autocomplete, TextField, Chip, Button, Drawer, Paper, Typography, Box, Stack,
} from '@mui/material';
import type { TaskComponentProps } from '../../types';

const domainOptions = ['example.com', 'example.net', 'research.org', 'staging.local'];

const setsEqual = (a: string[], b: string[]) =>
  a.length === b.length && [...a].sort().every((v, i) => v === [...b].sort()[i]);

export default function T04({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [domains, setDomains] = useState<string[]>(['example.com', 'example.net']);
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  const handleSave = useCallback(() => {
    setSaved(true);
    setDrawerOpen(false);
  }, []);

  useEffect(() => {
    if (successFired.current || !saved) return;
    if (setsEqual(domains, ['example.com', 'research.org', 'labs.dev'])) {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, domains, onSuccess]);

  return (
    <Box sx={{ p: 3, display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', minHeight: '60vh' }}>
      <Paper sx={{ p: 3, maxWidth: 400 }}>
        <Typography variant="h6" gutterBottom>Domain Configuration</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Manage allowed domains for email routing and SSO.
        </Typography>
        <Button variant="outlined" onClick={() => setDrawerOpen(true)}>Allowed domains</Button>
      </Paper>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: 380, p: 3, display: 'flex', flexDirection: 'column' } }}
      >
        <Typography variant="h6" gutterBottom>Allowed domains</Typography>

        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>Domains</Typography>
          <Autocomplete
            multiple
            freeSolo
            filterSelectedOptions
            data-testid="domains"
            options={domainOptions}
            value={domains}
            onChange={(_e, newVal) => setDomains(newVal as string[])}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip {...getTagProps({ index })} key={option} label={option} size="small" />
              ))
            }
            renderInput={(params) => (
              <TextField {...params} size="small" placeholder="Add domain" />
            )}
          />
        </Box>

        <Stack direction="row" spacing={1} sx={{ mt: 3, justifyContent: 'flex-end' }}>
          <Button onClick={() => setDrawerOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>Save domains</Button>
        </Stack>
      </Drawer>
    </Box>
  );
}
