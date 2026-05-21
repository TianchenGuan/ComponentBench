'use client';

/**
 * breadcrumb-mui-T04: Expand collapsed breadcrumb trail
 *
 * A single MUI Breadcrumbs component is shown in a centered isolated card, configured to collapse long
 * paths using the `maxItems` behavior. The underlying full path is "Home / Admin / Settings / Policies / Access Control
 * / Security", but the component initially shows a collapsed version with an ellipsis button in the middle (e.g., "Home
 * / … / Access Control / Security"). The ellipsis is an interactive expand control (with an accessible label such as "Show
 * full path"). Clicking the ellipsis expands the breadcrumb inline to reveal all items in order.
 */

import React, { useState, useEffect } from 'react';
import { Breadcrumbs, Link, Typography, Card, CardContent, CardHeader, Box } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import type { TaskComponentProps } from '../types';

const FULL_PATH = ['Home', 'Admin', 'Settings', 'Policies', 'Access Control', 'Security'];

export default function T04({ task, onSuccess }: TaskComponentProps) {
  const [expanded, setExpanded] = useState(false);

  // Check success condition: breadcrumb is fully expanded
  useEffect(() => {
    if (expanded) {
      onSuccess();
    }
  }, [expanded, onSuccess]);

  const handleExpand = () => {
    setExpanded(true);
  };

  if (expanded) {
    // Show full path
    return (
      <Card sx={{ width: 550 }}>
        <CardHeader title="Security Settings" />
        <CardContent>
          <Breadcrumbs data-testid="breadcrumb-primary" sx={{ mb: 2 }}>
            {FULL_PATH.map((item, index) => {
              const isLast = index === FULL_PATH.length - 1;
              return isLast ? (
                <Typography key={item} color="text.primary">
                  {item}
                </Typography>
              ) : (
                <Link
                  key={item}
                  component="button"
                  underline="hover"
                  color="inherit"
                  sx={{ cursor: 'pointer' }}
                >
                  {item}
                </Link>
              );
            })}
          </Breadcrumbs>
          <Typography variant="body2" color="text.secondary">
            Managing security and access control settings.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  // Show collapsed path with custom expand button
  return (
    <Card sx={{ width: 550 }}>
      <CardHeader title="Security Settings" />
      <CardContent>
        <Box data-testid="breadcrumb-primary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 2 }}>
          <Link component="button" underline="hover" color="inherit" sx={{ cursor: 'pointer' }}>
            Home
          </Link>
          <Typography color="text.secondary">/</Typography>
          <Box
            component="button"
            onClick={handleExpand}
            aria-label="Show full path"
            data-testid="breadcrumb-expand"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              background: 'rgba(0,0,0,0.08)',
              borderRadius: 1,
              px: 0.5,
              py: 0.25,
              cursor: 'pointer',
              '&:hover': { background: 'rgba(0,0,0,0.12)' },
            }}
          >
            <MoreHorizIcon sx={{ fontSize: 16 }} />
          </Box>
          <Typography color="text.secondary">/</Typography>
          <Link component="button" underline="hover" color="inherit" sx={{ cursor: 'pointer' }}>
            Access Control
          </Link>
          <Typography color="text.secondary">/</Typography>
          <Typography color="text.primary">Security</Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Managing security and access control settings.
        </Typography>
      </CardContent>
    </Card>
  );
}
