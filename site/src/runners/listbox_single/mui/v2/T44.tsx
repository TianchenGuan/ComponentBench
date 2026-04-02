'use client';

/**
 * listbox_single-mui-v2-T44: Permissions table: set Alice to Editor and save row
 *
 * Dark-themed permissions table with four rows. Each row has a small MUI List listbox in the
 * "Role" column (Viewer, Editor, Admin). Alice starts at Viewer. Each row has a row-local Save.
 * Toolbar above has sorting, filter, and export controls.
 *
 * Success: Alice Role = "editor", row-local "Save" for Alice clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Card, CardContent, Typography, Button, List, ListItemButton,
  ListItemText, Chip, Box, Stack, TextField, IconButton,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import SortIcon from '@mui/icons-material/Sort';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import type { TaskComponentProps } from '../../types';

const darkTheme = createTheme({ palette: { mode: 'dark' } });

interface UserRow {
  name: string;
  email: string;
  role: string;
}

const roleOptions = [
  { value: 'viewer', label: 'Viewer' },
  { value: 'editor', label: 'Editor' },
  { value: 'admin', label: 'Admin' },
];

const initialUsers: UserRow[] = [
  { name: 'Alice', email: 'alice@example.com', role: 'viewer' },
  { name: 'Bob', email: 'bob@example.com', role: 'editor' },
  { name: 'Carol', email: 'carol@example.com', role: 'admin' },
  { name: 'Dave', email: 'dave@example.com', role: 'viewer' },
];

export default function T44({ onSuccess }: TaskComponentProps) {
  const [users, setUsers] = useState(initialUsers);
  const [savedRows, setSavedRows] = useState<Record<string, boolean>>({});
  const successFired = useRef(false);

  const aliceRow = users.find(u => u.name === 'Alice')!;

  useEffect(() => {
    if (successFired.current) return;
    if (savedRows['Alice'] && aliceRow.role === 'editor') {
      successFired.current = true;
      onSuccess();
    }
  }, [savedRows, aliceRow.role, onSuccess]);

  const handleRoleChange = (userName: string, role: string) => {
    setUsers(prev => prev.map(u => u.name === userName ? { ...u, role } : u));
    setSavedRows(prev => ({ ...prev, [userName]: false }));
  };

  const handleRowSave = (userName: string) => {
    setSavedRows(prev => ({ ...prev, [userName]: true }));
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <div style={{ padding: 24, background: '#121212', minHeight: '100vh' }}>
        <Card sx={{ maxWidth: 750, mx: 'auto' }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Permissions</Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <TextField size="small" placeholder="Filter by role…" sx={{ width: 150 }} />
                <IconButton size="small"><SortIcon /></IconButton>
                <IconButton size="small"><FileDownloadIcon /></IconButton>
              </Stack>
            </Box>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #333' }}>
                  <th style={{ textAlign: 'left', padding: '8px 12px', fontSize: 12, color: '#aaa' }}>User</th>
                  <th style={{ textAlign: 'left', padding: '8px 12px', fontSize: 12, color: '#aaa' }}>Email</th>
                  <th style={{ textAlign: 'left', padding: '8px 12px', fontSize: 12, color: '#aaa' }}>Role</th>
                  <th style={{ padding: '8px 12px' }}></th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.name} style={{ borderBottom: '1px solid #333' }}>
                    <td style={{ padding: '8px 12px' }}>
                      <Typography variant="body2" fontWeight={600}>{user.name}</Typography>
                    </td>
                    <td style={{ padding: '8px 12px' }}>
                      <Typography variant="body2" color="text.secondary">{user.email}</Typography>
                    </td>
                    <td style={{ padding: '4px 8px' }}>
                      <List
                        data-cb-listbox-root
                        data-cb-instance={`${user.name} / Role`}
                        data-cb-selected-value={user.role}
                        sx={{ border: '1px solid #444', borderRadius: 1, minWidth: 110, p: 0 }}
                        dense
                      >
                        {roleOptions.map(opt => (
                          <ListItemButton
                            key={opt.value}
                            selected={user.role === opt.value}
                            onClick={() => handleRoleChange(user.name, opt.value)}
                            data-cb-option-value={opt.value}
                            sx={{ py: 0.25 }}
                          >
                            <ListItemText primary={opt.label} primaryTypographyProps={{ fontSize: 12 }} />
                          </ListItemButton>
                        ))}
                      </List>
                    </td>
                    <td style={{ padding: '8px 12px', textAlign: 'right' }}>
                      <Button size="small" variant="contained" onClick={() => handleRowSave(user.name)}>
                        Save
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
              <Chip label="4 users" size="small" />
              <Chip label="Last audit: 2d ago" size="small" />
            </Box>
          </CardContent>
        </Card>
      </div>
    </ThemeProvider>
  );
}
