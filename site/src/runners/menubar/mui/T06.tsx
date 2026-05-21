'use client';

/**
 * menubar-mui-T06: Reports → Monthly summary (dashboard clutter)
 * 
 * Layout: dashboard.
 * The page shows a busy analytics dashboard with charts and filters. A sticky MUI AppBar at the top contains the menubar.
 * - Menubar buttons: Overview, Reports (dropdown), Alerts (dropdown), Account (dropdown).
 * - Reports dropdown items: Daily report, Weekly report, Monthly summary (target), Custom report….
 * - Initial state: Overview is active; no menus open.
 * - Clutter (medium): the dashboard shows filter chips, a date range picker, and chart cards below the header (not required for success).
 * 
 * Success: The selected menu path is Reports → Monthly summary.
 */

import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Button, Paper, Box, Menu, MenuItem, Chip, Card, CardContent, Typography } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import type { TaskComponentProps } from '../types';

export default function T06({ onSuccess }: TaskComponentProps) {
  const [activeKey, setActiveKey] = useState<string>('Overview');
  const [selectedPath, setSelectedPath] = useState<string[]>([]);
  const [reportsAnchor, setReportsAnchor] = useState<null | HTMLElement>(null);
  const [alertsAnchor, setAlertsAnchor] = useState<null | HTMLElement>(null);
  const [accountAnchor, setAccountAnchor] = useState<null | HTMLElement>(null);
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    if (
      selectedPath.length === 2 &&
      selectedPath[0] === 'Reports' &&
      selectedPath[1] === 'Monthly summary' &&
      !successTriggered
    ) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [selectedPath, successTriggered, onSuccess]);

  const handleReportsClick = (item: string) => {
    setSelectedPath(['Reports', item]);
    setReportsAnchor(null);
  };

  return (
    <Paper elevation={2} sx={{ width: 700, overflow: 'hidden' }}>
      <Box sx={{ fontSize: 12, color: 'text.secondary', p: 1.5, pb: 0, fontWeight: 500 }}>
        Reports menu: Daily report, Weekly report, Monthly summary, Custom report…
      </Box>
      
      {/* Header menubar */}
      <AppBar position="static" color="default" elevation={0}>
        <Toolbar data-testid="menubar-main" sx={{ minHeight: 48 }}>
          <Button
            onClick={() => setActiveKey('Overview')}
            aria-current={activeKey === 'Overview' ? 'page' : undefined}
            sx={{
              color: activeKey === 'Overview' ? 'primary.main' : 'text.secondary',
              borderBottom: activeKey === 'Overview' ? '2px solid' : '2px solid transparent',
              borderColor: activeKey === 'Overview' ? 'primary.main' : 'transparent',
              borderRadius: 0,
              px: 2,
            }}
          >
            Overview
          </Button>
          <Button
            onClick={(e) => setReportsAnchor(e.currentTarget)}
            endIcon={<KeyboardArrowDownIcon />}
            aria-expanded={Boolean(reportsAnchor)}
            sx={{ color: 'text.secondary', px: 2 }}
            data-testid="menubar-item-reports"
          >
            Reports
          </Button>
          <Button
            onClick={(e) => setAlertsAnchor(e.currentTarget)}
            endIcon={<KeyboardArrowDownIcon />}
            sx={{ color: 'text.secondary', px: 2 }}
          >
            Alerts
          </Button>
          <Button
            onClick={(e) => setAccountAnchor(e.currentTarget)}
            endIcon={<KeyboardArrowDownIcon />}
            sx={{ color: 'text.secondary', px: 2 }}
          >
            Account
          </Button>

          <Menu
            anchorEl={reportsAnchor}
            open={Boolean(reportsAnchor)}
            onClose={() => setReportsAnchor(null)}
            data-testid="menu-reports"
          >
            <MenuItem onClick={() => handleReportsClick('Daily report')}>Daily report</MenuItem>
            <MenuItem onClick={() => handleReportsClick('Weekly report')}>Weekly report</MenuItem>
            <MenuItem onClick={() => handleReportsClick('Monthly summary')} data-testid="menu-item-monthly">Monthly summary</MenuItem>
            <MenuItem onClick={() => handleReportsClick('Custom report…')}>Custom report…</MenuItem>
          </Menu>

          <Menu
            anchorEl={alertsAnchor}
            open={Boolean(alertsAnchor)}
            onClose={() => setAlertsAnchor(null)}
          >
            <MenuItem>Active alerts</MenuItem>
            <MenuItem>Alert settings</MenuItem>
          </Menu>

          <Menu
            anchorEl={accountAnchor}
            open={Boolean(accountAnchor)}
            onClose={() => setAccountAnchor(null)}
          >
            <MenuItem>Profile</MenuItem>
            <MenuItem>Sign out</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Dashboard clutter */}
      <Box sx={{ p: 2, bgcolor: '#fafafa' }}>
        {/* Filter chips */}
        <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip label="Last 7 days" size="small" />
          <Chip label="All regions" size="small" variant="outlined" />
          <Chip label="Active users" size="small" variant="outlined" />
        </Box>

        {/* Chart cards */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <Card variant="outlined">
            <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
              <Typography variant="caption" color="text.secondary">Page Views</Typography>
              <Typography variant="h6">24,521</Typography>
            </CardContent>
          </Card>
          <Card variant="outlined">
            <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
              <Typography variant="caption" color="text.secondary">Conversions</Typography>
              <Typography variant="h6">1,234</Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Paper>
  );
}
