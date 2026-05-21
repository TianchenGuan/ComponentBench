'use client';

/**
 * breadcrumb-mui-T07: Navigate in compact top-right header (MUI)
 * 
 * Dashboard layout with compact breadcrumb.
 * MUI Breadcrumbs: Store > Inventory > Item #123
 * Click "Inventory" to navigate.
 */

import React, { useState } from 'react';
import { Breadcrumbs, Link, Typography, Card, CardContent, CardHeader } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import type { TaskComponentProps } from '../types';

export default function T07({ onSuccess }: TaskComponentProps) {
  const [navigated, setNavigated] = useState<string | null>(null);

  const handleNavigate = (item: string) => {
    if (navigated) return;
    setNavigated(item);
    if (item === 'Inventory') {
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 320 }}>
      <CardHeader
        title="Item #123"
        titleTypographyProps={{ fontSize: 14 }}
        sx={{ py: 1, px: 2 }}
      />
      <CardContent sx={{ py: 1, px: 2 }}>
        <Breadcrumbs
          separator={<NavigateNextIcon sx={{ fontSize: 14 }} />}
          sx={{ mb: 1.5, fontSize: 12 }}
        >
          <Link
            component="button"
            underline="hover"
            color="inherit"
            onClick={() => handleNavigate('Store')}
            data-testid="mui-breadcrumb-store"
            sx={{ cursor: 'pointer', fontSize: 12 }}
          >
            Store
          </Link>
          <Link
            component="button"
            underline="hover"
            color="inherit"
            onClick={() => handleNavigate('Inventory')}
            data-testid="mui-breadcrumb-inventory"
            sx={{ cursor: 'pointer', fontSize: 12 }}
          >
            Inventory
          </Link>
          <Typography sx={{ fontSize: 12 }} color="text.primary">
            Item #123
          </Typography>
        </Breadcrumbs>
        {navigated ? (
          <Typography color="success.main" fontWeight={500} fontSize={13}>
            Navigated to: {navigated}
          </Typography>
        ) : (
          <Typography fontSize={13}>
            Viewing item details. Navigate using breadcrumb.
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
