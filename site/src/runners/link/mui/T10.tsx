'use client';

/**
 * link-mui-T10: Open Changelog from a resources popover (top-left modal flow)
 * 
 * setup_description:
 * A modal_flow scene is anchored near the top-left of the viewport (placement=top_left).
 * A small card titled "Resources" contains a Material UI Link labeled "More resources"
 * that opens a Popover menu.
 * 
 * Initial state: menu closed. Activating "More resources" reveals a popover containing
 * three Link items: "Documentation", "Changelog", and "Status". Selecting "Changelog"
 * opens a right-side panel (drawer) titled "Changelog".
 * 
 * success_trigger:
 * - The "Changelog" link inside the resources popover (data-testid="resource-changelog") was activated.
 * - The Changelog drawer/panel (data-testid="drawer-changelog") is visible.
 * - The controlling "Changelog" link has aria-expanded="true".
 */

import React, { useState } from 'react';
import { Card, CardHeader, CardContent, Link, Typography, Box, Popover, Drawer, Stack } from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T10({ onSuccess }: TaskComponentProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activated, setActivated] = useState(false);
  const popoverOpen = Boolean(anchorEl);

  const handleMoreClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handleChangelogClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (activated) return;
    
    setAnchorEl(null);
    setDrawerOpen(true);
    setActivated(true);
    onSuccess();
  };

  const handleDocumentationClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Distractor
  };

  const handleStatusClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Distractor
  };

  return (
    <>
      <Card sx={{ width: 350 }}>
        <CardHeader 
          title="Resources"
          action={
            <Link
              href="#"
              onClick={handleMoreClick}
              data-testid="link-more-resources"
              aria-expanded={popoverOpen}
              aria-haspopup="menu"
              sx={{ cursor: 'pointer', fontSize: '0.875rem' }}
            >
              More resources
            </Link>
          }
        />
        <CardContent>
          <Typography variant="body2">
            Explore our developer resources to get started with the API.
          </Typography>
        </CardContent>
      </Card>

      <Popover
        open={popoverOpen}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Stack sx={{ p: 1.5, minWidth: 150 }} spacing={1}>
          <Link
            href="#"
            onClick={handleDocumentationClick}
            data-testid="resource-documentation"
            sx={{ cursor: 'pointer' }}
          >
            Documentation
          </Link>
          <Link
            href="#"
            onClick={handleChangelogClick}
            data-testid="resource-changelog"
            aria-expanded={drawerOpen}
            sx={{ cursor: 'pointer' }}
          >
            Changelog
          </Link>
          <Link
            href="#"
            onClick={handleStatusClick}
            data-testid="resource-status"
            sx={{ cursor: 'pointer' }}
          >
            Status
          </Link>
        </Stack>
      </Popover>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        data-testid="drawer-changelog"
      >
        <Box sx={{ width: 350, p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Changelog</Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>v2.5.0</strong> - January 2025
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            • Added new authentication methods<br />
            • Improved API response times<br />
            • Bug fixes and performance improvements
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>v2.4.0</strong> - December 2024
          </Typography>
          <Typography variant="body2">
            • New webhook endpoints<br />
            • Enhanced error messages<br />
            • Updated SDK libraries
          </Typography>
        </Box>
      </Drawer>
    </>
  );
}
