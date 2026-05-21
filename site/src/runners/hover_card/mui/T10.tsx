'use client';

/**
 * hover_card-mui-T10: Reset a pinned hover card to closed
 *
 * Layout: settings_panel centered in the viewport. Dark theme with compact spacing and small scale.
 *
 * The page shows a single owner row labeled "Secondary owner".
 * - The hover card for this row is already visible at load and is pinned open (pinned=true).
 * - The hover card header shows a filled pin icon (acts as "Unpin" when clicked) and a small "×" close button.
 * - After unpinning, the hover card behaves like a normal hover card and can be dismissed (e.g., by clicking outside or using the ×).
 *
 * Initial state: open=true, pinned=true, active_instance="Secondary owner".
 * No other hover cards exist.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, Typography, Tooltip, Box, Avatar, IconButton } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import PushPinIcon from '@mui/icons-material/PushPin';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import CloseIcon from '@mui/icons-material/Close';
import type { TaskComponentProps } from '../types';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export default function T10({ task, onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(true);
  const [pinned, setPinned] = useState(true);
  const successCalledRef = useRef(false);

  useEffect(() => {
    if (!open && !pinned && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [open, pinned, onSuccess]);

  const handleUnpin = () => {
    setPinned(false);
  };

  const handleClose = () => {
    setPinned(false);
    setOpen(false);
  };

  const hoverCardContent = (
    <Card 
      sx={{ minWidth: 220, boxShadow: 3, bgcolor: '#2a2a2a' }}
      data-testid="hover-card-content"
      data-cb-instance="Secondary owner"
      data-pinned={pinned}
      data-open={open}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="subtitle2" fontWeight={600} sx={{ color: '#fff' }}>
            Secondary owner
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.25 }}>
            <IconButton 
              size="small" 
              onClick={handleUnpin}
              data-testid="pin-button"
              aria-label={pinned ? "Unpin" : "Pin"}
              sx={{ color: '#fff' }}
            >
              {pinned ? <PushPinIcon fontSize="small" /> : <PushPinOutlinedIcon fontSize="small" />}
            </IconButton>
            <IconButton 
              size="small" 
              onClick={handleClose}
              data-testid="close-button"
              aria-label="Close"
              sx={{ color: '#fff' }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar sx={{ bgcolor: '#9c27b0', width: 32, height: 32, fontSize: 12 }}>
            MC
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight={500} sx={{ color: '#fff' }}>
              Mike Chen
            </Typography>
            <Typography variant="body2" sx={{ color: '#b0b0b0', fontSize: 11 }}>
              mike@company.com
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <ThemeProvider theme={darkTheme}>
      <Card sx={{ width: 300, bgcolor: '#1e1e1e' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ color: '#fff' }}>Owner</Typography>
          <Tooltip
            title={hoverCardContent}
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => {
              if (!pinned) setOpen(false);
            }}
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
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5,
                p: 1,
                borderRadius: 1,
                cursor: 'pointer',
                '&:hover': { bgcolor: '#333' }
              }}
              data-testid="owner-secondary-owner"
              data-cb-instance="Secondary owner"
            >
              <Avatar sx={{ bgcolor: '#9c27b0', width: 36, height: 36, fontSize: 13 }}>
                MC
              </Avatar>
              <Box>
                <Typography variant="body2" fontWeight={500} sx={{ color: '#fff' }}>
                  Mike Chen
                </Typography>
                <Typography variant="caption" sx={{ color: '#999' }}>
                  Secondary owner
                </Typography>
              </Box>
            </Box>
          </Tooltip>
        </CardContent>
      </Card>
    </ThemeProvider>
  );
}
