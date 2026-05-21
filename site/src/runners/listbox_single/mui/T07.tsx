'use client';

/**
 * listbox_single-mui-T07: Priority: set High and apply
 *
 * Scene: light theme, comfortable spacing, settings_panel layout, placed at center of the viewport.
 * Component scale is default. Page contains 1 instance(s) of this listbox type; guidance is text; clutter is medium.
 * A settings_panel layout contains several distracting controls (a disabled text field, a help accordion link,
 * and a non-functional toggle). The "Priority" section contains a MUI List listbox with three options:
 * "Low", "Medium", "High". Initial selection is "Medium". Changes are staged until the user clicks the primary
 * button "Apply" below the list. There is also a "Reset" button that restores the last applied selection.
 * After Apply, a Snackbar toast appears briefly reading "Changes applied". The task only succeeds when the
 * applied (committed) priority equals "High".
 *
 * Success: Selected option value equals: high (after clicking Apply)
 * require_confirm: true, confirm_control: Apply
 */

import React, { useState } from 'react';
import {
  Card, CardContent, Typography, List, ListItemButton, ListItemText,
  Button, Stack, TextField, Switch, FormControlLabel, Accordion,
  AccordionSummary, AccordionDetails, Snackbar, Box
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import type { TaskComponentProps } from '../types';

const options = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

export default function T07({ onSuccess }: TaskComponentProps) {
  const [staged, setStaged] = useState<string>('medium');
  const [committed, setCommitted] = useState<string>('medium');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleSelect = (value: string) => {
    setStaged(value);
  };

  const handleApply = () => {
    setCommitted(staged);
    setSnackbarOpen(true);
    if (staged === 'high') {
      onSuccess();
    }
  };

  const handleReset = () => {
    setStaged(committed);
  };

  return (
    <Box sx={{ width: 400 }}>
      {/* Distractor: disabled text field */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <TextField
            label="Project name"
            defaultValue="My Project"
            disabled
            fullWidth
            size="small"
          />
        </CardContent>
      </Card>

      {/* Distractor: toggle */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <FormControlLabel
            control={<Switch disabled />}
            label="Enable notifications"
          />
        </CardContent>
      </Card>

      {/* Main Priority listbox */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Priority</Typography>
          <List
            data-cb-listbox-root
            data-cb-selected-value={staged}
            data-cb-committed-value={committed}
            sx={{ border: '1px solid #e0e0e0', borderRadius: 1 }}
          >
            {options.map(opt => (
              <ListItemButton
                key={opt.value}
                selected={staged === opt.value}
                onClick={() => handleSelect(opt.value)}
                data-cb-option-value={opt.value}
              >
                <ListItemText primary={opt.label} />
              </ListItemButton>
            ))}
          </List>
        </CardContent>
      </Card>

      {/* Distractor: help accordion */}
      <Accordion sx={{ mb: 2 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="body2" color="text.secondary">Need help?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2">Contact support for assistance.</Typography>
        </AccordionDetails>
      </Accordion>

      {/* Action buttons */}
      <Stack direction="row" spacing={2}>
        <Button variant="contained" onClick={handleApply}>Apply</Button>
        <Button variant="outlined" onClick={handleReset}>Reset</Button>
      </Stack>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        message="Changes applied"
      />
    </Box>
  );
}
