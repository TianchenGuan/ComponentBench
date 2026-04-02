'use client';

/**
 * clipboard_copy-mui-T08: Open Copy menu and select API key
 *
 * Layout: isolated_card, centered.
 * The card title is "Account". On the right side of the card header there is a Material UI Button labeled "Copy…" with a dropdown arrow.
 *
 * Clicking "Copy…" opens a MUI Menu (popover). The menu contains 6 items, each item copies a different value:
 * - Copy User ID → user_4821
 * - Copy Email → alex@example.com
 * - Copy API key → API-PROD-9X2K   (target)
 * - Copy Workspace ID → ws_113
 * - Copy Billing ID → bill_993
 * - Copy Support PIN → PIN-2049
 *
 * Component behavior:
 * - Selecting a menu item immediately writes the corresponding value to the clipboard and closes the menu.
 * - A snackbar appears: "Copied to clipboard".
 *
 * Distractors: an "Edit profile" button in the card body (irrelevant).
 * Initial state: menu closed; nothing copied.
 *
 * Success: Clipboard text equals "API-PROD-9X2K".
 */

import React, { useState } from 'react';
import { Card, CardHeader, CardContent, Button, Menu, MenuItem, Snackbar, Alert, Box } from '@mui/material';
import { KeyboardArrowDown, Edit } from '@mui/icons-material';
import type { TaskComponentProps } from '../types';
import { copyToClipboard } from '../types';

const copyItems = [
  { label: 'Copy User ID', value: 'user_4821' },
  { label: 'Copy Email', value: 'alex@example.com' },
  { label: 'Copy API key', value: 'API-PROD-9X2K' },  // target
  { label: 'Copy Workspace ID', value: 'ws_113' },
  { label: 'Copy Billing ID', value: 'bill_993' },
  { label: 'Copy Support PIN', value: 'PIN-2049' },
];

const targetValue = 'API-PROD-9X2K';

export default function T08({ task, onSuccess }: TaskComponentProps) {
  const [completed, setCompleted] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCopy = async (label: string, value: string) => {
    await copyToClipboard(value, label);
    handleClose();
    setSnackbarOpen(true);

    // Only complete if the correct value was copied
    if (value === targetValue && !completed) {
      setCompleted(true);
      onSuccess();
    }
  };

  const open = Boolean(anchorEl);

  return (
    <Card sx={{ width: 400 }}>
      <CardHeader
        title="Account"
        action={
          <Button
            variant="outlined"
            size="small"
            endIcon={<KeyboardArrowDown />}
            onClick={handleClick}
            data-testid="copy-menu-button"
          >
            Copy…
          </Button>
        }
      />
      <CardContent>
        <Box sx={{ p: 2 }}>
          <Button
            variant="text"
            startIcon={<Edit />}
            data-testid="edit-profile-button"
          >
            Edit profile
          </Button>
        </Box>
      </CardContent>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        data-testid="copy-menu"
      >
        {copyItems.map((item) => (
          <MenuItem
            key={item.label}
            onClick={() => handleCopy(item.label, item.value)}
            data-testid={`menu-item-${item.value}`}
          >
            {item.label}
          </MenuItem>
        ))}
      </Menu>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSnackbarOpen(false)}>
          Copied to clipboard
        </Alert>
      </Snackbar>
    </Card>
  );
}
