'use client';

/**
 * hover_card-mui-T02: Pin a team hover card open
 *
 * Layout: isolated_card centered, light theme.
 *
 * The content shows two pill labels: "Team: Design" and "Team: Sales".
 * - Only "Team: Design" has a hover card; "Team: Sales" is a distractor label with no hover overlay.
 *
 * Hover card behavior (MUI composite):
 * - Implemented with MUI Tooltip/Popper rendering a rich card panel.
 * - The hover card header includes a small "Pin" icon/button. Clicking it toggles pinned=true and keeps the overlay visible even if the pointer moves away.
 *
 * Initial state: hover card closed and unpinned.
 * No other overlays are present.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, Typography, Chip, Tooltip, Box, IconButton } from '@mui/material';
import PushPinIcon from '@mui/icons-material/PushPin';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import type { TaskComponentProps } from '../types';

export default function T02({ task, onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const [pinned, setPinned] = useState(false);
  const successCalledRef = useRef(false);

  useEffect(() => {
    if (open && pinned && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [open, pinned, onSuccess]);

  const handlePinClick = () => {
    setPinned(true);
  };

  const hoverCardContent = (
    <Card 
      sx={{ minWidth: 240, boxShadow: 3 }}
      data-testid="hover-card-content"
      data-cb-instance="Team: Design"
      data-pinned={pinned}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="subtitle2" fontWeight={600}>
            Team: Design
          </Typography>
          <IconButton 
            size="small" 
            onClick={handlePinClick}
            data-testid="pin-button"
            aria-label="Pin"
          >
            {pinned ? <PushPinIcon fontSize="small" /> : <PushPinOutlinedIcon fontSize="small" />}
          </IconButton>
        </Box>
        <Typography variant="body2" color="text.secondary">
          8 members • Product Design
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Responsible for UI/UX design across all products.
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Card sx={{ width: 350, p: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Teams</Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
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
            <Chip
              label="Team: Design"
              data-testid="team-design-trigger"
              data-cb-instance="Team: Design"
              sx={{ 
                cursor: 'pointer',
                bgcolor: '#e3f2fd',
                color: '#1976d2'
              }}
            />
          </Tooltip>
          <Chip
            label="Team: Sales"
            sx={{ 
              bgcolor: '#f5f5f5',
              color: '#666'
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}
