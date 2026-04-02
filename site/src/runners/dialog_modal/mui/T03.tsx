'use client';

/**
 * dialog_modal-mui-T03: Dismiss a dialog with the Escape key
 *
 * Layout: isolated_card centered. A Material UI Dialog is open on page load.
 *
 * Dialog configuration:
 * - Title: "Keyboard shortcuts"
 * - Content: static list of shortcut hints (non-interactive)
 * - Actions: none (no footer buttons)
 * - Backdrop click is disabled for this task page, so Escape is the intended close mechanism.
 *
 * Initial state: dialog open; focus is inside the dialog.
 * Success: The 'Keyboard shortcuts' dialog is closed via Escape key (close_reason='escape_key').
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T03({ task, onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(true); // Dialog starts open
  const [closedBy, setClosedBy] = useState<string | null>(null);
  const successCalledRef = useRef(false);

  useEffect(() => {
    window.__cbModalState = {
      open: true,
      close_reason: null,
      modal_instance: 'Keyboard shortcuts',
    };
  }, []);

  const handleClose = (event: object, reason: string) => {
    if (reason === 'escapeKeyDown') {
      setOpen(false);
      setClosedBy('escape');
      window.__cbModalState = {
        open: false,
        close_reason: 'escape_key',
        modal_instance: 'Keyboard shortcuts',
      };
      
      // Success when closed via Escape
      if (!successCalledRef.current) {
        successCalledRef.current = true;
        setTimeout(() => onSuccess(), 100);
      }
    }
    // Ignore backdrop click
  };

  const shortcuts = [
    { key: 'Ctrl + S', action: 'Save document' },
    { key: 'Ctrl + Z', action: 'Undo' },
    { key: 'Ctrl + Y', action: 'Redo' },
    { key: 'Ctrl + F', action: 'Find' },
    { key: 'Esc', action: 'Close dialog' },
  ];

  return (
    <>
      <Card sx={{ width: 400 }}>
        <CardHeader title="Help Center" />
        <CardContent>
          <Typography variant="body2">
            View keyboard shortcuts and quick tips.
          </Typography>
        </CardContent>
      </Card>

      {closedBy && (
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
          Closed by: {closedBy}
        </Typography>
      )}

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="shortcuts-dialog-title"
        disableEscapeKeyDown={false}
        data-testid="dialog-keyboard-shortcuts"
      >
        <DialogTitle id="shortcuts-dialog-title">Keyboard shortcuts</DialogTitle>
        <DialogContent>
          <List dense>
            {shortcuts.map((shortcut) => (
              <ListItem key={shortcut.key}>
                <ListItemText
                  primary={shortcut.key}
                  secondary={shortcut.action}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </>
  );
}
