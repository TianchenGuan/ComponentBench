'use client';

/**
 * combobox_editable_multi-mui-v2-T03
 *
 * Modal flow: "Edit allowed domains" opens a dialog with MUI Autocomplete (multiple, freeSolo, filterSelectedOptions).
 * Initial chips: example.com, example.net. Suggestions: example.com, example.net, research.org, staging.local.
 * labs.dev is custom (not in suggestions).
 * Success: Allowed domains = {example.com, research.org, labs.dev}, Save clicked.
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  Autocomplete,
  TextField,
  Chip,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
} from '@mui/material';
import type { TaskComponentProps } from '../../types';
import { setsEqual } from '../../types';

const suggestions = ['example.com', 'example.net', 'research.org', 'staging.local'];
const TARGET_SET = ['example.com', 'research.org', 'labs.dev'];

export default function T03({ onSuccess }: TaskComponentProps) {
  const [domains, setDomains] = useState<string[]>(['example.com', 'example.net']);
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (saved && setsEqual(domains, TARGET_SET)) {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, domains, onSuccess]);

  const handleSave = () => {
    setSaved(true);
    setOpen(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Card sx={{ width: 440 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Domain allowlist</Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Currently allowed: {domains.join(', ') || '(none)'}
          </Typography>
          <Button variant="outlined" size="small" onClick={() => setOpen(true)}>
            Edit allowed domains
          </Button>
        </CardContent>
      </Card>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit allowed domains</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle2" sx={{ mt: 1, mb: 1 }}>Allowed domains</Typography>
          <Autocomplete
            multiple
            freeSolo
            filterSelectedOptions
            options={suggestions}
            value={domains}
            onChange={(_e, newVal) => { setDomains(newVal); setSaved(false); }}
            renderTags={(tagValue, getTagProps) =>
              tagValue.map((option, index) => (
                <Chip {...getTagProps({ index })} key={option} label={option} size="small" />
              ))
            }
            renderInput={(params) => (
              <TextField {...params} placeholder="Add domain" size="small" />
            )}
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
