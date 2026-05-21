'use client';

/**
 * breadcrumb-mui-T02: Navigate Home with icon (MUI)
 * 
 * Centered isolated card titled "Profile".
 * MUI Breadcrumbs: [Home icon] > Users > Profile
 * First item is HomeIcon. Clicking shows navigation confirmation.
 */

import React, { useState } from 'react';
import { Breadcrumbs, Link, Typography, Card, CardContent, CardHeader } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import type { TaskComponentProps } from '../types';

export default function T02({ onSuccess }: TaskComponentProps) {
  const [navigated, setNavigated] = useState<string | null>(null);

  const handleNavigate = (item: string) => {
    if (navigated) return;
    setNavigated(item);
    if (item === 'Home') {
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardHeader title="Profile" />
      <CardContent>
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          sx={{ mb: 2 }}
        >
          <Link
            component="button"
            underline="hover"
            color="inherit"
            onClick={() => handleNavigate('Home')}
            data-testid="mui-breadcrumb-home"
            sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          >
            <HomeIcon sx={{ fontSize: 20 }} />
          </Link>
          <Link
            component="button"
            underline="hover"
            color="inherit"
            onClick={() => handleNavigate('Users')}
            data-testid="mui-breadcrumb-users"
            sx={{ cursor: 'pointer' }}
          >
            Users
          </Link>
          <Typography color="text.primary" data-testid="mui-breadcrumb-profile">
            Profile
          </Typography>
        </Breadcrumbs>
        {navigated ? (
          <Typography color="success.main" fontWeight={500}>
            You navigated to: {navigated}
          </Typography>
        ) : (
          <Typography>
            Viewing user profile. Click the home icon to navigate.
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
