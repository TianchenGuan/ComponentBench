'use client';

/**
 * breadcrumb-mui-T05: Navigate in dark settings panel (MUI)
 * 
 * Dark theme settings panel.
 * MUI Breadcrumbs: Settings > Privacy > Data
 * "Data" is current. Click "Privacy" to navigate.
 */

import React, { useState } from 'react';
import { Breadcrumbs, Link, Typography, Card, CardContent, CardHeader } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import type { TaskComponentProps } from '../types';

export default function T05({ onSuccess }: TaskComponentProps) {
  const [navigated, setNavigated] = useState<string | null>(null);

  const handleNavigate = (item: string) => {
    if (navigated) return;
    setNavigated(item);
    if (item === 'Privacy') {
      onSuccess();
    }
  };

  return (
    <Card
      sx={{
        width: 450,
        bgcolor: '#1f1f1f',
        '& .MuiCardHeader-root': { color: '#fff' },
      }}
    >
      <CardHeader title="Data Settings" sx={{ borderBottom: '1px solid #303030' }} />
      <CardContent>
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" sx={{ color: '#888' }} />}
          sx={{ mb: 2 }}
        >
          <Link
            component="button"
            underline="hover"
            onClick={() => handleNavigate('Settings')}
            data-testid="mui-breadcrumb-settings"
            sx={{ cursor: 'pointer', color: '#90caf9' }}
          >
            Settings
          </Link>
          <Link
            component="button"
            underline="hover"
            onClick={() => handleNavigate('Privacy')}
            data-testid="mui-breadcrumb-privacy"
            sx={{ cursor: 'pointer', color: '#90caf9' }}
          >
            Privacy
          </Link>
          <Typography data-testid="mui-breadcrumb-data" sx={{ color: '#888' }}>
            Data
          </Typography>
        </Breadcrumbs>
        {navigated ? (
          <Typography sx={{ color: '#66bb6a', fontWeight: 500 }}>
            You navigated to: {navigated}
          </Typography>
        ) : (
          <Typography sx={{ color: '#ccc' }}>
            Data privacy settings. Use breadcrumb to navigate.
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
