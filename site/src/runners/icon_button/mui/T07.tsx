'use client';

/**
 * icon_button-mui-T07: Scroll to Diagnostics info icon (dark settings panel)
 *
 * Layout: settings_panel centered in the viewport; dark theme.
 * A tall settings panel with multiple sections. The "Diagnostics" section contains 
 * a small MUI IconButton with an info icon.
 * 
 * Success: The "Diagnostics info" IconButton has data-cb-activated="true".
 */

import React, { useState } from 'react';
import { Card, CardContent, Typography, IconButton, Box, Divider } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import type { TaskComponentProps } from '../types';

export default function T07({ task, onSuccess }: TaskComponentProps) {
  const [activated, setActivated] = useState(false);

  const handleClick = () => {
    if (activated) return;
    setActivated(true);
    onSuccess();
  };

  const sections = [
    {
      title: 'Account',
      items: ['Email: user@example.com', 'Plan: Pro', 'Member since: Jan 2023'],
    },
    {
      title: 'Privacy',
      items: ['Data sharing: Disabled', 'Analytics: Enabled', 'Cookies: Essential only'],
    },
    {
      title: 'Notifications',
      items: ['Email alerts: On', 'Push notifications: Off', 'Weekly digest: On'],
    },
  ];

  return (
    <Card sx={{ width: 400, maxHeight: 'calc(100vh - 100px)', overflow: 'auto' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Settings
        </Typography>

        {sections.map((section, idx) => (
          <Box key={section.title} sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              {section.title}
            </Typography>
            {section.items.map((item, i) => (
              <Typography key={i} variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                {item}
              </Typography>
            ))}
            <Divider sx={{ mt: 2 }} />
          </Box>
        ))}

        {/* Diagnostics section - target */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="subtitle2">Diagnostics</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography variant="caption" color="text.secondary">Info</Typography>
              <IconButton
                size="small"
                onClick={handleClick}
                aria-label="Diagnostics info"
                data-cb-activated={activated ? 'true' : 'false'}
                data-testid="mui-icon-btn-diagnostics-info"
              >
                <InfoOutlinedIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
          <Typography variant="body2" color="text.secondary">
            System version: 2.4.1
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Last sync: 5 minutes ago
          </Typography>
          {activated && (
            <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
              Diagnostics info opened
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
