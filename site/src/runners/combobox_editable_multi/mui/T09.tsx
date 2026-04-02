'use client';

/**
 * combobox_editable_multi-mui-T09: Edit allowed domains in a dialog and save
 *
 * Modal flow with a Material UI Dialog:
 * - Main page shows a settings card "Email security" with a button "Edit allowed domains".
 * - Clicking it opens a Dialog.
 * Inside the Dialog:
 * - Target field: Autocomplete with multiple=true and freeSolo=true labeled "Allowed domains".
 * - Initial chips: "example.net"
 * - There is helper text under the field: "Press Enter to add a domain".
 * - Dialog actions: "Cancel" and primary "Save".
 * Success requires the selected chips to be exactly example.com and research.org AND the Save button to be clicked.
 *
 * Success: Selected values equal {example.com, research.org} AND Save clicked.
 */

import React, { useState, useRef } from 'react';
import { 
  Autocomplete, TextField, Card, CardContent, Typography, Chip, Button,
  Dialog, DialogTitle, DialogContent, DialogActions, FormHelperText
} from '@mui/material';
import type { TaskComponentProps } from '../types';
import { setsEqual } from '../types';

const TARGET_SET = ['example.com', 'research.org'];

export default function T09({ onSuccess }: TaskComponentProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [value, setValue] = useState<string[]>(['example.net']);
  const hasSucceeded = useRef(false);

  const handleSave = () => {
    if (setsEqual(value, TARGET_SET) && !hasSucceeded.current) {
      hasSucceeded.current = true;
      setDialogOpen(false);
      onSuccess();
    } else {
      setDialogOpen(false);
    }
  };

  return (
    <>
      <Card sx={{ width: 400 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Email security</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Configure allowed domains for email delivery.
          </Typography>
          <Button 
            data-testid="open-dialog-button"
            variant="contained" 
            onClick={() => setDialogOpen(true)}
          >
            Edit allowed domains
          </Button>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit allowed domains</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle2" gutterBottom sx={{ mt: 1 }}>Allowed domains</Typography>
          <Autocomplete
            data-testid="allowed-domains"
            multiple
            freeSolo
            options={[]}
            value={value}
            onChange={(_event, newValue) => setValue(newValue as string[])}
            renderTags={(tagValue, getTagProps) =>
              tagValue.map((option, index) => (
                <Chip {...getTagProps({ index })} key={option} label={option} size="small" />
              ))
            }
            renderInput={(params) => (
              <TextField {...params} placeholder="Enter domain" size="small" />
            )}
          />
          <FormHelperText>Press Enter to add a domain</FormHelperText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button 
            data-testid="save-button"
            variant="contained" 
            onClick={handleSave}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
