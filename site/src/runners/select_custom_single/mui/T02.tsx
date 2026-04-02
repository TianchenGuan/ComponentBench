'use client';

/**
 * select_custom_single-mui-T02: Open the Language menu
 *
 * Layout: centered isolated card titled "Language".
 * The card contains one MUI Select labeled "Language" (FormControl + InputLabel).
 *
 * Initial state: selected value is "English"; menu is closed.
 * Opening the select shows a Menu popover with options: English, Spanish, French.
 *
 * This task only checks the overlay/menu open state. Ending with the menu closed is a failure.
 * Selecting an option typically closes the menu, so do not end by selecting and closing.
 *
 * There are no other controls on the page.
 *
 * Success: The MUI Select labeled "Language" is expanded/open (menu popover visible).
 */

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import type { TaskComponentProps } from '../types';

const languages = ['English', 'Spanish', 'French'];

export default function T02({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string>('English');
  const [open, setOpen] = useState(false);

  const handleChange = (event: SelectChangeEvent) => {
    setValue(event.target.value);
  };

  const handleOpen = () => {
    setOpen(true);
    onSuccess();
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Language</Typography>
        <FormControl fullWidth>
          <InputLabel id="language-label">Language</InputLabel>
          <Select
            labelId="language-label"
            id="language-select"
            data-testid="language-select"
            value={value}
            label="Language"
            onChange={handleChange}
            open={open}
            onOpen={handleOpen}
            onClose={handleClose}
          >
            {languages.map((lang) => (
              <MenuItem key={lang} value={lang}>{lang}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </CardContent>
    </Card>
  );
}
