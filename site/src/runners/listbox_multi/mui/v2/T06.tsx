'use client';

/**
 * listbox_multi-mui-v2-T06: Dense quick actions section exact subset
 *
 * Drawer with two dense MUI List sections (Project quick actions, Workspace quick actions).
 * Checkboxes are right-aligned secondary actions. Workspace quick actions is the TARGET.
 * Project initial: Auto-refresh (must remain unchanged). Workspace initial: none.
 * Target Workspace: Pin to sidebar, Enable shortcuts, Show tooltips.
 * Confirm via "Save actions". Dark theme.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Button, Card, CardContent, Typography, Drawer, List, ListItem,
  ListItemButton, ListItemText, Checkbox, Divider, Box,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import type { TaskComponentProps } from '../../types';
import { setsEqual } from '../../types';

const darkTheme = createTheme({ palette: { mode: 'dark' } });

const workspaceOptions = [
  'Pin to sidebar', 'Enable shortcuts', 'Show tooltips',
  'Auto-refresh', 'Compact mode', 'Sounds',
];

const projectOptions = [
  'Auto-refresh', 'Compact mode', 'Show previews',
  'Enable notifications', 'Inline editing', 'Sounds',
];

const targetSet = ['Pin to sidebar', 'Enable shortcuts', 'Show tooltips'];
const projectInitial = ['Auto-refresh'];

export default function T06({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [workspace, setWorkspace] = useState<string[]>([]);
  const [project, setProject] = useState<string[]>(['Auto-refresh']);
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (saved && setsEqual(workspace, targetSet) && setsEqual(project, projectInitial)) {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, workspace, project, onSuccess]);

  const toggleItem = (list: string[], setList: (v: string[]) => void, value: string) => {
    const idx = list.indexOf(value);
    const next = [...list];
    if (idx === -1) next.push(value); else next.splice(idx, 1);
    setList(next);
    setSaved(false);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ p: 3, minHeight: '100vh' }}>
        <Card sx={{ maxWidth: 420 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Settings</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Customize workspace and project quick actions
            </Typography>
            <Button variant="contained" size="small" onClick={() => { setDrawerOpen(true); setSaved(false); }}>
              Quick actions
            </Button>
          </CardContent>
        </Card>

        <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
          <Box sx={{ width: 360, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Typography variant="h6" sx={{ p: 2, pb: 0 }}>Quick actions</Typography>

            <Box sx={{ flex: 1, overflow: 'auto' }}>
              <Typography variant="subtitle2" sx={{ px: 2, pt: 2 }}>Project quick actions</Typography>
              <List dense>
                {projectOptions.map(opt => (
                  <ListItem
                    key={opt}
                    disablePadding
                    secondaryAction={
                      <Checkbox
                        edge="end"
                        size="small"
                        checked={project.includes(opt)}
                        onChange={() => toggleItem(project, setProject, opt)}
                      />
                    }
                  >
                    <ListItemButton dense onClick={() => toggleItem(project, setProject, opt)}>
                      <ListItemText primary={opt} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>

              <Divider />

              <Typography variant="subtitle2" sx={{ px: 2, pt: 2 }}>Workspace quick actions</Typography>
              <List dense>
                {workspaceOptions.map(opt => (
                  <ListItem
                    key={opt}
                    disablePadding
                    secondaryAction={
                      <Checkbox
                        edge="end"
                        size="small"
                        checked={workspace.includes(opt)}
                        onChange={() => toggleItem(workspace, setWorkspace, opt)}
                      />
                    }
                  >
                    <ListItemButton dense onClick={() => toggleItem(workspace, setWorkspace, opt)}>
                      <ListItemText primary={opt} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Box>

            <Box sx={{ p: 2, borderTop: '1px solid #424242', display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <Button onClick={() => setDrawerOpen(false)}>Cancel</Button>
              <Button variant="contained" onClick={() => { setSaved(true); setDrawerOpen(false); }}>
                Save actions
              </Button>
            </Box>
          </Box>
        </Drawer>
      </Box>
    </ThemeProvider>
  );
}
