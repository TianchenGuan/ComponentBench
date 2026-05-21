'use client';

/**
 * listbox_multi-mui-v2-T07: Dark modal team permissions repair
 *
 * Modal with one MUI List checklist labeled "Team permissions" (12 items).
 * Initial: View dashboards, View audit log. Target: View dashboards, Export data, Manage users.
 * Confirm via "Save permissions". Dark theme.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Button, Card, CardContent, Typography, Dialog, DialogTitle, DialogContent,
  DialogActions, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Checkbox, Box,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import type { TaskComponentProps } from '../../types';
import { setsEqual } from '../../types';

const darkTheme = createTheme({ palette: { mode: 'dark' } });

const permissionOptions = [
  'View dashboards', 'Edit dashboards', 'Export data', 'Manage users',
  'Manage billing', 'View audit log', 'API access', 'Create projects',
  'Delete projects', 'Manage integrations', 'View reports', 'Manage teams',
];

const targetSet = ['View dashboards', 'Export data', 'Manage users'];

export default function T07({ onSuccess }: TaskComponentProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>(['View dashboards', 'View audit log']);
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (saved && setsEqual(selected, targetSet)) {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, selected, onSuccess]);

  const handleToggle = (value: string) => {
    const idx = selected.indexOf(value);
    const next = [...selected];
    if (idx === -1) next.push(value); else next.splice(idx, 1);
    setSelected(next);
    setSaved(false);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ p: 3, minHeight: '100vh' }}>
        <Card sx={{ maxWidth: 420 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Team Settings</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Manage team access and permissions
            </Typography>
            <Button variant="contained" onClick={() => { setModalOpen(true); setSaved(false); }}>
              Edit team permissions
            </Button>
          </CardContent>
        </Card>

        <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="xs" fullWidth>
          <DialogTitle>Edit team permissions</DialogTitle>
          <DialogContent dividers>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Team permissions</Typography>
            <List dense sx={{ border: '1px solid #424242', borderRadius: 1 }}>
              {permissionOptions.map(opt => (
                <ListItem key={opt} disablePadding>
                  <ListItemButton dense onClick={() => handleToggle(opt)}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <Checkbox
                        edge="start"
                        size="small"
                        checked={selected.includes(opt)}
                        tabIndex={-1}
                        disableRipple
                      />
                    </ListItemIcon>
                    <ListItemText primary={opt} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={() => { setSaved(true); setModalOpen(false); }}>
              Save permissions
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
}
