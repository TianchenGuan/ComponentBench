'use client';

/**
 * breadcrumb-mui-T10: Dual breadcrumb section disambiguation (MUI)
 * 
 * Form section with two labeled breadcrumb areas.
 * 1. "Primary Navigation": Home > Sales > Orders > Order #1
 * 2. "Secondary Navigation": Support > Sales > Tickets > Ticket #1
 * Click "Sales" in Primary Navigation only.
 */

import React, { useState } from 'react';
import { Breadcrumbs, Link, Typography, Card, CardContent, CardHeader, Box } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import type { TaskComponentProps } from '../types';

export default function T10({ onSuccess }: TaskComponentProps) {
  const [navigated, setNavigated] = useState<{ section: string; item: string } | null>(null);

  const handleNavigate = (section: string, item: string) => {
    if (navigated) return;
    setNavigated({ section, item });
    if (section === 'primary_navigation' && item === 'Sales') {
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 500 }}>
      <CardHeader title="Navigation" />
      <CardContent>
        {/* Primary Navigation Section */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="subtitle2"
            sx={{ mb: 1, color: 'primary.main', fontWeight: 600 }}
          >
            Primary Navigation
          </Typography>
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
            <Link
              component="button"
              underline="hover"
              color="inherit"
              onClick={() => handleNavigate('primary_navigation', 'Home')}
              data-testid="mui-breadcrumb-primary-home"
              sx={{ cursor: 'pointer' }}
            >
              Home
            </Link>
            <Link
              component="button"
              underline="hover"
              color="inherit"
              onClick={() => handleNavigate('primary_navigation', 'Sales')}
              data-testid="mui-breadcrumb-primary-sales"
              sx={{ cursor: 'pointer' }}
            >
              Sales
            </Link>
            <Link
              component="button"
              underline="hover"
              color="inherit"
              onClick={() => handleNavigate('primary_navigation', 'Orders')}
              data-testid="mui-breadcrumb-primary-orders"
              sx={{ cursor: 'pointer' }}
            >
              Orders
            </Link>
            <Typography color="text.primary">Order #1</Typography>
          </Breadcrumbs>
        </Box>

        {/* Secondary Navigation Section */}
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="subtitle2"
            sx={{ mb: 1, color: 'text.secondary', fontWeight: 600 }}
          >
            Secondary Navigation
          </Typography>
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
            <Link
              component="button"
              underline="hover"
              color="inherit"
              onClick={() => handleNavigate('secondary_navigation', 'Support')}
              data-testid="mui-breadcrumb-secondary-support"
              sx={{ cursor: 'pointer' }}
            >
              Support
            </Link>
            <Link
              component="button"
              underline="hover"
              color="inherit"
              onClick={() => handleNavigate('secondary_navigation', 'Sales')}
              data-testid="mui-breadcrumb-secondary-sales"
              sx={{ cursor: 'pointer' }}
            >
              Sales
            </Link>
            <Link
              component="button"
              underline="hover"
              color="inherit"
              onClick={() => handleNavigate('secondary_navigation', 'Tickets')}
              data-testid="mui-breadcrumb-secondary-tickets"
              sx={{ cursor: 'pointer' }}
            >
              Tickets
            </Link>
            <Typography color="text.primary">Ticket #1</Typography>
          </Breadcrumbs>
        </Box>

        {navigated && (
          <Typography
            sx={{
              color:
                navigated.section === 'primary_navigation' && navigated.item === 'Sales'
                  ? 'success.main'
                  : 'error.main',
              fontWeight: 500,
              mt: 2,
            }}
          >
            {navigated.section === 'primary_navigation' && navigated.item === 'Sales'
              ? `Correct! Navigated to ${navigated.item} in Primary Navigation.`
              : `Wrong! You clicked ${navigated.item} in ${navigated.section === 'primary_navigation' ? 'Primary' : 'Secondary'} Navigation.`}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
