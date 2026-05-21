'use client';

/**
 * autocomplete_restricted-mui-T02: Open the role list
 *
 * setup_description:
 * A single "Team access" card is centered on the screen.
 *
 * The card contains one Material UI Autocomplete labeled **Role** with placeholder "Select role".
 * - Theme: light; spacing: comfortable; size: default.
 * - Initial state: empty.
 * - Options: Viewer, Commenter, Editor, Admin.
 * - The Autocomplete is restricted: typing filters, but the stored value must be one of the options.
 *
 * This task is only about opening the options listbox and leaving it visible; do not make a selection.
 *
 * Success: The Role Autocomplete's options popup/listbox is open and visible.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import type { TaskComponentProps } from '../types';

const roles = ['Viewer', 'Commenter', 'Editor', 'Admin'];

export default function T02({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && open) {
      successFired.current = true;
      onSuccess();
    }
  }, [open, onSuccess]);

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Team access
        </Typography>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Role
        </Typography>
        <Autocomplete
          data-testid="role-autocomplete"
          options={roles}
          value={value}
          onChange={(_event, newValue) => setValue(newValue)}
          open={open}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          renderInput={(params) => (
            <TextField {...params} placeholder="Select role" size="small" />
          )}
          freeSolo={false}
        />
      </CardContent>
    </Card>
  );
}
