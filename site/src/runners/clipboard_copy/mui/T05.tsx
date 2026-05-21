'use client';

/**
 * clipboard_copy-mui-T05: Open Share popover and copy invite link
 *
 * Layout: isolated_card, centered.
 * The card title is "Invite teammates". It has a single button labeled "Share".
 *
 * Clicking "Share" opens a Material UI Popover anchored to the button. Inside the popover:
 * - A read-only text field shows the invite link: https://invite.example.com/join/7Q9P
 * - To the right of the field is a copy IconButton (clipboard_copy component).
 * - A small helper text under the field explains "Anyone with this link can join".
 *
 * Component behavior:
 * - Clicking the copy IconButton writes the invite link to the clipboard.
 * - A snackbar appears: "Invite link copied".
 * - No separate Apply/OK is required; closing the popover is optional.
 *
 * Distractors: the popover also contains a secondary button "Email invite" that is irrelevant.
 * Initial state: popover closed.
 *
 * Success: Clipboard text equals "https://invite.example.com/join/7Q9P".
 */

import React, { useState } from 'react';
import { Card, CardHeader, CardContent, Button, Popover, TextField, IconButton, Tooltip, Typography, Snackbar, Alert, Stack, Box } from '@mui/material';
import { Share, ContentCopy, Check, Email } from '@mui/icons-material';
import type { TaskComponentProps } from '../types';
import { copyToClipboard } from '../types';

export default function T05({ task, onSuccess }: TaskComponentProps) {
  const [completed, setCompleted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const inviteLink = 'https://invite.example.com/join/7Q9P';

  const handleShareClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCopy = async () => {
    if (completed) return;
    
    const success = await copyToClipboard(inviteLink, 'Invite link');
    if (success) {
      setCopied(true);
      setSnackbarOpen(true);
      setCompleted(true);
      onSuccess();
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const open = Boolean(anchorEl);

  return (
    <Card sx={{ width: 350 }}>
      <CardHeader title="Invite teammates" />
      <CardContent>
        <Button
          variant="contained"
          startIcon={<Share />}
          onClick={handleShareClick}
          data-testid="share-button"
        >
          Share
        </Button>

        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          data-testid="share-popover"
        >
          <Box sx={{ p: 2, width: 350 }}>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TextField
                  value={inviteLink}
                  size="small"
                  fullWidth
                  InputProps={{ readOnly: true }}
                  data-testid="invite-link-field"
                />
                <Tooltip title={copied ? 'Copied' : 'Copy invite link'}>
                  <IconButton
                    onClick={handleCopy}
                    data-testid="copy-invite-link"
                    aria-label="Copy invite link"
                  >
                    {copied ? <Check color="success" /> : <ContentCopy />}
                  </IconButton>
                </Tooltip>
              </Box>
              <Typography variant="caption" color="text.secondary">
                Anyone with this link can join
              </Typography>
              <Button variant="outlined" startIcon={<Email />} data-testid="email-invite-button">
                Email invite
              </Button>
            </Stack>
          </Box>
        </Popover>
      </CardContent>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSnackbarOpen(false)}>
          Invite link copied
        </Alert>
      </Snackbar>
    </Card>
  );
}
