'use client';

/**
 * popover-mui-T07: Open API key help popover (dark + compact form)
 *
 * Robustness variant: dark theme + compact spacing.
 * Form section layout with two fields: 'API key' and 'Webhook URL'.
 * Each field label has a small help IconButton (ⓘ) on its right edge.
 * Clicking the 'API key' help icon opens a MUI Popover anchored to that icon.
 * Popover title: 'API key'; content: one paragraph.
 * Initial state: popover closed.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, Typography, IconButton, Popover, Box, TextField, InputAdornment } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import type { TaskComponentProps } from '../types';

export default function T07({ task, onSuccess }: TaskComponentProps) {
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

  return (
    <Card sx={{ width: 380 }}>
      <CardContent sx={{ p: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          API Settings
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
            <Typography variant="caption">API key</Typography>
            <IconButton
              size="small"
              onClick={handleClick}
              data-testid="popover-target-api-key"
              sx={{ ml: 0.5, p: 0.25 }}
            >
              <InfoOutlinedIcon sx={{ fontSize: 14 }} />
            </IconButton>
          </Box>
          <TextField
            size="small"
            fullWidth
            placeholder="sk-..."
            type="password"
          />
        </Box>
        
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
            <Typography variant="caption">Webhook URL</Typography>
            <IconButton
              size="small"
              data-testid="popover-target-webhook"
              sx={{ ml: 0.5, p: 0.25 }}
            >
              <InfoOutlinedIcon sx={{ fontSize: 14 }} />
            </IconButton>
          </Box>
          <TextField
            size="small"
            fullWidth
            placeholder="https://..."
          />
        </Box>
        
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          data-testid="popover-api-key"
        >
          <Box sx={{ p: 2, maxWidth: 220 }}>
            <Typography variant="subtitle2" gutterBottom>API key</Typography>
            <Typography variant="body2">
              Your API key is used to authenticate requests. Keep it secure and never share it publicly.
            </Typography>
          </Box>
        </Popover>
      </CardContent>
    </Card>
  );
}
