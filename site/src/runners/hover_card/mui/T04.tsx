'use client';

/**
 * hover_card-mui-T04: Open delayed help hover card in settings panel
 *
 * Layout: settings_panel centered on a light theme. Comfortable spacing, default scale.
 *
 * The panel contains several labeled settings rows (API key, Webhook URL, Retry policy).
 * - Next to the "Webhook URL" label there is a small circular help icon (the hover target).
 * - Hovering the icon opens a rich hover card implemented with MUI Tooltip/Popper.
 * - The hover card has a configured delay: it only appears after a noticeable hover dwell (enterDelay), and it lingers briefly when leaving (leaveDelay).
 * - The content is a small card with a title "Webhook URL" and an example URL in monospace text.
 *
 * Instances: 1 hover card in this panel. Other controls are inert distractors for this task.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, Typography, Tooltip, Box, TextField, IconButton } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import type { TaskComponentProps } from '../types';

export default function T04({ task, onSuccess }: TaskComponentProps) {
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
      sx={{ minWidth: 280, boxShadow: 3 }}
      data-testid="hover-card-content"
      data-cb-instance="Webhook URL help"
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          Webhook URL
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          The endpoint where we&apos;ll send event notifications.
        </Typography>
        <Box sx={{ 
          bgcolor: '#f5f5f5', 
          p: 1, 
          borderRadius: 1, 
          fontFamily: 'monospace',
          fontSize: 12
        }}>
          https://api.example.com/webhooks
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>API Settings</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              API Key
            </Typography>
            <TextField
              size="small"
              fullWidth
              type="password"
              defaultValue="sk-xxxxx-xxxxx"
            />
          </Box>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
              <Typography variant="body2" color="text.secondary">
                Webhook URL
              </Typography>
              <Tooltip
                title={hoverCardContent}
                open={open}
                onOpen={() => setOpen(true)}
                onClose={() => setOpen(false)}
                enterDelay={500}
                leaveDelay={200}
                arrow={false}
                placement="right"
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
                <IconButton 
                  size="small" 
                  sx={{ p: 0.25 }}
                  data-testid="webhook-help-trigger"
                  aria-label="Webhook URL help"
                >
                  <HelpOutlineIcon sx={{ fontSize: 16, color: '#999' }} />
                </IconButton>
              </Tooltip>
            </Box>
            <TextField
              size="small"
              fullWidth
              placeholder="https://your-api.com/webhook"
            />
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              Retry Policy
            </Typography>
            <TextField
              size="small"
              fullWidth
              defaultValue="3 retries"
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
