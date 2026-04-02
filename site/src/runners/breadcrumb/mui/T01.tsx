'use client';

/**
 * breadcrumb-mui-T01: Navigate to Dashboard (basic MUI breadcrumb)
 * 
 * Baseline isolated card centered in the viewport titled "Report".
 * MUI Breadcrumbs: Dashboard > Analytics > Report
 * "Report" is current page. Clicking "Dashboard" shows navigation confirmation.
 */

import React, { useState } from 'react';
import { Breadcrumbs, Link, Typography, Card, CardContent, CardHeader } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import type { TaskComponentProps } from '../types';

export default function T01({ onSuccess }: TaskComponentProps) {
  const [navigated, setNavigated] = useState<string | null>(null);

  const handleNavigate = (item: string) => {
    if (navigated) return;
    setNavigated(item);
    if (item === 'Dashboard') {
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 450 }}>
      <CardHeader title="Report" />
      <CardContent>
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          sx={{ mb: 2 }}
        >
          <Link
            component="button"
            underline="hover"
            color="inherit"
            onClick={() => handleNavigate('Dashboard')}
            data-testid="mui-breadcrumb-dashboard"
            sx={{ cursor: 'pointer' }}
          >
            Dashboard
          </Link>
          <Link
            component="button"
            underline="hover"
            color="inherit"
            onClick={() => handleNavigate('Analytics')}
            data-testid="mui-breadcrumb-analytics"
            sx={{ cursor: 'pointer' }}
          >
            Analytics
          </Link>
          <Typography color="text.primary" data-testid="mui-breadcrumb-report">
            Report
          </Typography>
        </Breadcrumbs>
        {navigated ? (
          <Typography color="success.main" fontWeight={500}>
            You navigated to: {navigated}
          </Typography>
        ) : (
          <Typography>
            Viewing report. Use the breadcrumb to navigate.
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
