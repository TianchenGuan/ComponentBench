'use client';

/**
 * password_input-mui-T10: Set an app lock password inside a security drawer (dark theme)
 * 
 * The page is in dark theme and contains a button labeled "Open security drawer". Clicking it
 * opens a right-side Material UI Drawer.
 * Inside the drawer is one OutlinedInput labeled "App lock password" (type=password, initially empty)
 * and a single primary button labeled "Apply" at the bottom of the drawer. Clicking Apply closes
 * the drawer and shows a small toast "Applied".
 * No other form fields affect success.
 * 
 * Success: Inside the drawer, the "App lock password" value equals exactly "LockIt!2026" AND
 * the drawer "Apply" button has been clicked.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Button, Drawer, FormControl, InputLabel, OutlinedInput, Typography, Box, Snackbar } from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T10({ onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [applied, setApplied] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const successTriggeredRef = useRef(false);

  useEffect(() => {
    if (applied && password === 'LockIt!2026' && !successTriggeredRef.current) {
      successTriggeredRef.current = true;
      onSuccess();
    }
  }, [applied, password, onSuccess]);

  const handleApply = () => {
    setApplied(true);
    setShowToast(true);
    setOpen(false);
  };

  return (
    <Box 
      sx={{ 
        p: 3, 
        bgcolor: '#1e1e1e', 
        minHeight: '100%',
        color: '#fff'
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ color: '#fff' }}>
        Security
      </Typography>
      <Button 
        variant="contained" 
        onClick={() => setOpen(true)}
        data-testid="open-security-drawer"
      >
        Open security drawer
      </Button>

      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        data-testid="security-drawer"
        PaperProps={{
          sx: {
            bgcolor: '#2d2d2d',
            color: '#fff',
            width: 320,
            p: 3,
          }
        }}
      >
        <Typography variant="h6" gutterBottom>
          Security Settings
        </Typography>
        <FormControl fullWidth variant="outlined" sx={{ mt: 2, mb: 3 }}>
          <InputLabel 
            htmlFor="app-lock-password"
            sx={{ color: '#aaa', '&.Mui-focused': { color: '#90caf9' } }}
          >
            App lock password
          </InputLabel>
          <OutlinedInput
            id="app-lock-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            label="App lock password"
            sx={{
              color: '#fff',
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#555' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#888' },
            }}
            inputProps={{ 'data-testid': 'app-lock-password-input' }}
          />
        </FormControl>
        <Button 
          variant="contained" 
          fullWidth 
          onClick={handleApply}
          data-testid="drawer-apply"
        >
          Apply
        </Button>
      </Drawer>

      <Snackbar
        open={showToast}
        autoHideDuration={2000}
        onClose={() => setShowToast(false)}
        message="Applied"
      />
    </Box>
  );
}
