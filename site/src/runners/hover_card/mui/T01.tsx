'use client';

/**
 * hover_card-mui-T01: Open account hover card (MUI Tooltip-based)
 *
 * Layout: isolated_card centered, light theme, comfortable spacing.
 *
 * The page shows a single line item:
 * - Label: "Account ID"
 * - Value: a rounded chip that reads "2481"
 *
 * Hovering the chip opens a hover card implemented using MUI Tooltip/Popper with interactive rich content:
 * - The overlay contains a small MUI Card-style panel with account name, plan, and status.
 * - The hover card closes when the pointer leaves the target and the hover overlay (standard hover behavior).
 *
 * Instances: 1 hover card on page; no other tooltips.
 * Initial state: closed.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, Typography, Chip, Tooltip, Box } from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T01({ task, onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const successCalledRef = useRef(false);

  useEffect(() => {
    if (open && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [open, onSuccess]);

  const hoverCardContent = (
    <Card 
      sx={{ minWidth: 220, boxShadow: 3 }}
      data-testid="hover-card-content"
      data-cb-instance="Account ID: 2481"
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          Acme Corporation
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Typography variant="body2" color="text.secondary">
            Plan: Enterprise
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Status: <span style={{ color: '#2e7d32' }}>Active</span>
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Card sx={{ width: 350, p: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Account Details</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">Account ID</Typography>
          <Tooltip
            title={hoverCardContent}
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            arrow={false}
            placement="bottom"
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
            <Chip
              label="2481"
              size="small"
              data-testid="account-id-trigger"
              data-cb-instance="Account ID: 2481"
              sx={{ 
                cursor: 'pointer',
                bgcolor: '#e3f2fd',
                color: '#1976d2',
                fontWeight: 500
              }}
            />
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  );
}
