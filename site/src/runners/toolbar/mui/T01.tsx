'use client';

/**
 * toolbar-mui-T01: Click Print in MUI app bar toolbar
 *
 * A centered isolated card contains a Material UI AppBar with a Toolbar inside it, 
 * labeled "Top bar". The toolbar includes three text Buttons: "Home", "Print", and "Help".
 * Immediately below the AppBar, a read-only line shows "Last action: …" and starts at "None".
 */

import React, { useState } from 'react';
import { AppBar, Toolbar, Button, Typography, Paper, Box } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import PrintIcon from '@mui/icons-material/Print';
import HelpIcon from '@mui/icons-material/Help';
import type { TaskComponentProps } from '../types';

export default function T01({ task, onSuccess }: TaskComponentProps) {
  const [lastAction, setLastAction] = useState<string>('None');

  const handleAction = (action: string) => {
    setLastAction(action);
    if (action.toLowerCase() === 'print') {
      onSuccess();
    }
  };

  return (
    <Paper elevation={2} sx={{ width: 450, overflow: 'hidden' }}>
      <AppBar position="static" data-testid="mui-topbar">
        <Toolbar variant="dense">
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Top bar
          </Typography>
          <Button
            color="inherit"
            startIcon={<HomeIcon />}
            onClick={() => handleAction('Home')}
            data-testid="mui-topbar-home"
          >
            Home
          </Button>
          <Button
            color="inherit"
            startIcon={<PrintIcon />}
            onClick={() => handleAction('Print')}
            data-testid="mui-topbar-print"
          >
            Print
          </Button>
          <Button
            color="inherit"
            startIcon={<HelpIcon />}
            onClick={() => handleAction('Help')}
            data-testid="mui-topbar-help"
          >
            Help
          </Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Last action: {lastAction}
        </Typography>
      </Box>
    </Paper>
  );
}
