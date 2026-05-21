'use client';

/**
 * popover-mui-T05: Scroll to find 'API rate limit' and open its popover
 *
 * Settings panel layout with a long list of configuration rows and helper text (about 2 viewport heights).
 * Each row has a label and a small help IconButton (ⓘ) that opens a MUI Popover on click.
 * The target row label is 'API rate limit' and appears near the bottom of the list.
 * Popover title matches the label ('API rate limit') and contains a short explanation.
 * Initial state: popover closed; target row is initially off-screen.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, Typography, IconButton, Popover, Box, Switch, Divider } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import type { TaskComponentProps } from '../types';

export default function T05({ task, onSuccess }: TaskComponentProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const successCalledRef = useRef(false);

  const open = Boolean(anchorEl);

  useEffect(() => {
    if (open && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [open, onSuccess]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const SettingRow = ({ label, hasPopover = false }: { label: string; hasPopover?: boolean }) => (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="body2">{label}</Typography>
        {hasPopover && (
          <IconButton
            size="small"
            onClick={handleClick}
            data-testid="popover-target-api-rate-limit"
          >
            <InfoOutlinedIcon fontSize="small" />
          </IconButton>
        )}
      </Box>
      <Switch size="small" />
    </Box>
  );

  return (
    <Card sx={{ width: 400, maxHeight: 400, overflow: 'auto' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Settings</Typography>
        
        <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>General</Typography>
        <SettingRow label="Auto-save drafts" />
        <SettingRow label="Show hints" />
        <SettingRow label="Enable analytics" />
        
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="subtitle2" sx={{ mb: 1 }}>Notifications</Typography>
        <SettingRow label="Email notifications" />
        <SettingRow label="Push notifications" />
        <SettingRow label="Weekly digest" />
        
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="subtitle2" sx={{ mb: 1 }}>Privacy</Typography>
        <SettingRow label="Profile visibility" />
        <SettingRow label="Activity status" />
        <SettingRow label="Search indexing" />
        
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="subtitle2" sx={{ mb: 1 }}>Developer</Typography>
        <SettingRow label="Debug mode" />
        <SettingRow label="API logging" />
        <SettingRow label="API rate limit" hasPopover />
        <SettingRow label="Webhook retries" />
        
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          data-testid="popover-api-rate-limit"
        >
          <Box sx={{ p: 2, maxWidth: 250 }}>
            <Typography variant="subtitle2" gutterBottom>API rate limit</Typography>
            <Typography variant="body2">
              Controls the maximum number of API requests allowed per minute. Enable to enforce stricter rate limiting.
            </Typography>
          </Box>
        </Popover>
      </CardContent>
    </Card>
  );
}
