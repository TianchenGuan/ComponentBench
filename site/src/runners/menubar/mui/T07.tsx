'use client';

/**
 * menubar-mui-T07: Main header only: go to Settings (two menubars)
 * 
 * Layout: isolated_card, centered.
 * Two separate MUI AppBar/Toolbar headers are rendered inside the card, each with a label above it:
 * 1) "Main header" (target)
 * 2) "Preview header"
 * Both headers contain the same buttons: Home, Settings, Help.
 * - Initial state: Home is active in both headers.
 * - Only the menubar instance labeled "Main header" should be modified for success.
 * - No other interactive clutter in the card.
 * 
 * Success: In the menubar instance labeled "Main header", the active item is "Settings".
 */

import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Button, Paper, Box, Typography } from '@mui/material';
import type { TaskComponentProps } from '../types';

const menuItems = ['Home', 'Settings', 'Help'];

export default function T07({ onSuccess }: TaskComponentProps) {
  const [mainActiveKey, setMainActiveKey] = useState<string>('Home');
  const [previewActiveKey, setPreviewActiveKey] = useState<string>('Home');
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    if (mainActiveKey === 'Settings' && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [mainActiveKey, successTriggered, onSuccess]);

  const renderMenubar = (
    activeKey: string, 
    setActiveKey: (key: string) => void, 
    testId: string
  ) => (
    <AppBar position="static" color="default" elevation={0}>
      <Toolbar data-testid={testId} sx={{ minHeight: 48 }}>
        {menuItems.map((item) => (
          <Button
            key={item}
            onClick={() => setActiveKey(item)}
            aria-current={activeKey === item ? 'page' : undefined}
            sx={{
              color: activeKey === item ? 'primary.main' : 'text.secondary',
              borderBottom: activeKey === item ? '2px solid' : '2px solid transparent',
              borderColor: activeKey === item ? 'primary.main' : 'transparent',
              borderRadius: 0,
              px: 2,
            }}
          >
            {item}
          </Button>
        ))}
      </Toolbar>
    </AppBar>
  );

  return (
    <Paper elevation={2} sx={{ width: 450, overflow: 'hidden' }}>
      <Box sx={{ fontSize: 12, color: 'text.secondary', p: 1.5, pb: 0, fontWeight: 500 }}>
        Two app headers: Main header and Preview header. Use Main header → Settings.
      </Box>

      {/* Main header */}
      <Box sx={{ p: 2, pb: 0 }}>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
          Main header
        </Typography>
        {renderMenubar(mainActiveKey, setMainActiveKey, 'menubar-main')}
      </Box>

      {/* Preview header */}
      <Box sx={{ p: 2, pt: 3 }}>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
          Preview header
        </Typography>
        {renderMenubar(previewActiveKey, setPreviewActiveKey, 'menubar-preview')}
      </Box>
    </Paper>
  );
}
