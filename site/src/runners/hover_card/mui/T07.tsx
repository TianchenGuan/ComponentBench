'use client';

/**
 * hover_card-mui-T07: Confirm an action inside hover card
 *
 * Layout: form_section centered, light theme, comfortable spacing.
 *
 * The page shows an "Email preferences" section with several rows. One row is:
 * - Label: "Weekly summary"
 * - Value: "Learn more" (small underlined text used as the hover target)
 *
 * Hovering the hover target opens a MUI Tooltip/Popper-based hover card with:
 * - A short description of weekly summary emails.
 * - Two buttons at the bottom: "Confirm" and "Cancel".
 * - Clicking a button dismisses the hover card and records the choice.
 *
 * Instances: 1 hover card.
 * Initial state: closed and no decision recorded.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, Typography, Tooltip, Box, Button, Switch, FormControlLabel } from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T07({ task, onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const [decision, setDecision] = useState<'confirm' | 'cancel' | null>(null);
  const successCalledRef = useRef(false);

  useEffect(() => {
    if (decision === 'confirm' && !open && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [decision, open, onSuccess]);

  const handleConfirm = () => {
    setDecision('confirm');
    setOpen(false);
  };

  const handleCancel = () => {
    setDecision('cancel');
    setOpen(false);
  };

  const hoverCardContent = (
    <Card 
      sx={{ minWidth: 260, boxShadow: 3 }}
      data-testid="hover-card-content"
      data-cb-instance="Weekly summary"
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          Weekly Summary
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Receive a weekly digest of your account activity, including metrics, alerts, and recommendations.
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
          <Button size="small" onClick={handleCancel} data-testid="cancel-button">
            Cancel
          </Button>
          <Button size="small" variant="contained" onClick={handleConfirm} data-testid="confirm-button">
            Confirm
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Email Preferences</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2">Marketing emails</Typography>
            <Switch size="small" />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="body2">Weekly summary</Typography>
              <Tooltip
                title={hoverCardContent}
                open={open}
                onOpen={() => setOpen(true)}
                onClose={() => setOpen(false)}
                arrow={false}
                placement="bottom-start"
                componentsProps={{
                  tooltip: {
                    sx: {
                      bgcolor: 'transparent',
                      p: 0,
                      maxWidth: 'none'
                    }
                  }
                }}
              >
                <Typography
                  variant="body2"
                  data-testid="weekly-summary-trigger"
                  data-cb-instance="Weekly summary"
                  sx={{ 
                    color: '#1976d2', 
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    fontSize: 12
                  }}
                >
                  Learn more
                </Typography>
              </Tooltip>
            </Box>
            <Switch size="small" defaultChecked />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2">Security alerts</Typography>
            <Switch size="small" defaultChecked />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
