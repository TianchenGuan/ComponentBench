'use client';

/**
 * clipboard_copy-mui-T02: Copy share link (Button)
 *
 * Layout: isolated_card, centered.
 * The card title is "Share this page". It displays the full share URL as text:
 * https://share.example.com/s/AB12CD
 *
 * Below the URL there is a prominent Material UI Button labeled "Copy link" (with a copy icon).
 * Clicking the button triggers a copy handler that uses navigator.clipboard.writeText(url) and shows a bottom Snackbar: "Link copied".
 *
 * Distractors: a secondary button "Open in new tab" (does nothing relevant) and a short help sentence.
 * Initial state: snackbar hidden; nothing copied.
 *
 * Success: Clipboard text equals "https://share.example.com/s/AB12CD".
 */

import React, { useState } from 'react';
import { Card, CardHeader, CardContent, Typography, Button, Snackbar, Alert, Stack, Box } from '@mui/material';
import { ContentCopy, OpenInNew } from '@mui/icons-material';
import type { TaskComponentProps } from '../types';
import { copyToClipboard } from '../types';

export default function T02({ task, onSuccess }: TaskComponentProps) {
  const [completed, setCompleted] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const shareUrl = 'https://share.example.com/s/AB12CD';

  const handleCopy = async () => {
    if (completed) return;
    
    const success = await copyToClipboard(shareUrl, 'Share link');
    if (success) {
      setSnackbarOpen(true);
      setCompleted(true);
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 450 }}>
      <CardHeader title="Share this page" />
      <CardContent>
        <Stack spacing={2}>
          <Box
            sx={{
              p: 2,
              bgcolor: 'grey.100',
              borderRadius: 1,
              fontFamily: 'monospace',
              wordBreak: 'break-all',
            }}
            data-testid="share-url"
          >
            {shareUrl}
          </Box>

          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              startIcon={<ContentCopy />}
              onClick={handleCopy}
              data-testid="copy-link-button"
            >
              Copy link
            </Button>
            <Button
              variant="outlined"
              startIcon={<OpenInNew />}
              data-testid="open-tab-button"
            >
              Open in new tab
            </Button>
          </Stack>

          <Typography variant="caption" color="text.secondary">
            Share this link with anyone you want to give access to this page.
          </Typography>
        </Stack>
      </CardContent>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSnackbarOpen(false)}>
          Link copied
        </Alert>
      </Snackbar>
    </Card>
  );
}
