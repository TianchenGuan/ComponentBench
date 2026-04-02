'use client';

/**
 * textarea-mui-T09: Signature in a drawer from visual reference
 *
 * A profile page includes a button "Customize signature".
 * - Light theme with comfortable spacing and default scale.
 * - Clicking the button opens a MUI Drawer from the right (drawer_flow).
 * - Inside the drawer is one multiline MUI TextField labeled "Email signature", initially empty.
 * - Above it is a small IMAGE reference showing the exact two-line signature (not selectable).
 * - Drawer actions at the bottom: "Cancel" and primary "Apply".
 *
 * Success: Committed value equals exactly (whitespace=exact):
 *   Best,
 *   Jordan
 * (require_confirm=true)
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
  Button,
  Drawer,
  Box,
  TextField,
  Typography,
} from '@mui/material';
import type { TaskComponentProps } from '../types';

const TARGET_VALUE = `Best,
Jordan`;

export default function T09({ onSuccess }: TaskComponentProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [draftValue, setDraftValue] = useState('');
  const [committedValue, setCommittedValue] = useState('');
  const hasSucceeded = useRef(false);

  useEffect(() => {
    const normalized = committedValue.replace(/\r\n/g, '\n');
    if (normalized === TARGET_VALUE && !hasSucceeded.current) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [committedValue, onSuccess]);

  const handleOpen = () => {
    setDraftValue('');
    setIsDrawerOpen(true);
  };

  const handleApply = () => {
    setCommittedValue(draftValue);
    setIsDrawerOpen(false);
  };

  const handleCancel = () => {
    setIsDrawerOpen(false);
  };

  return (
    <>
      <Card sx={{ width: 400 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Profile
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Customize your email settings
          </Typography>
          <Button variant="contained" onClick={handleOpen} data-testid="btn-customize-signature">
            Customize signature
          </Button>
        </CardContent>
      </Card>

      <Drawer anchor="right" open={isDrawerOpen} onClose={handleCancel}>
        <Box sx={{ width: 360, p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Email Signature
          </Typography>

          {/* Reference image */}
          <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5 }}>
            Reference (type this exactly)
          </Typography>
          <Box
            sx={{
              p: 1.5,
              mb: 2,
              bgcolor: '#f5f5f5',
              borderRadius: 1,
              fontFamily: 'monospace',
              fontSize: 13,
              color: '#666',
              userSelect: 'none',
              pointerEvents: 'none',
            }}
            data-testid="reference-image"
          >
            <div>Best,</div>
            <div>Jordan</div>
          </Box>

          <TextField
            label="Email signature"
            multiline
            rows={3}
            fullWidth
            value={draftValue}
            onChange={(e) => setDraftValue(e.target.value)}
            inputProps={{ 'data-testid': 'textarea-email-signature' }}
            sx={{ mb: 2 }}
          />

          <Box sx={{ mt: 'auto', display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button variant="contained" onClick={handleApply} data-testid="btn-apply">
              Apply
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
