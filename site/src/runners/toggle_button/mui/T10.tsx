'use client';

/**
 * toggle_button-mui-T20: Enable Edit permission for a user in table
 *
 * Layout: table_cell anchored toward the bottom-right of the viewport.
 * Theme is light, spacing comfortable, scale default. Clutter is high.
 *
 * The page contains a "Permissions" section with:
 * - A toolbar (Search users field, Filter chips, and a "Bulk actions" button) — distractors.
 * - A MUI Table with 3 rows (users): "Alex", "Maya", "Sam".
 * - Columns: User, View (read-only check icon), Edit (toggle), Admin (toggle).
 *
 * Toggle buttons:
 * - In each row, the "Edit" column contains a MUI ToggleButton labeled "Edit".
 * - The toggle is icon-sized within the cell; selected state is indicated by filled styling and aria-pressed=true.
 *
 * Initial state: All "Edit" toggles are Off.
 * Target: the "Edit" toggle in the row for user "Maya".
 */

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  Chip,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@mui/material';
import ToggleButton from '@mui/material/ToggleButton';
import SearchIcon from '@mui/icons-material/Search';
import CheckIcon from '@mui/icons-material/Check';
import EditIcon from '@mui/icons-material/Edit';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import VisibilityIcon from '@mui/icons-material/Visibility';
import type { TaskComponentProps } from '../types';

interface UserRow {
  name: string;
  edit: boolean;
  admin: boolean;
}

export default function T10({ onSuccess }: TaskComponentProps) {
  const [users, setUsers] = useState<UserRow[]>([
    { name: 'Alex', edit: false, admin: false },
    { name: 'Maya', edit: false, admin: false },
    { name: 'Sam', edit: false, admin: false },
  ]);

  const handleEditToggle = (name: string) => {
    setUsers(prev => prev.map(user => {
      if (user.name === name) {
        const newEdit = !user.edit;
        if (name === 'Maya' && newEdit) {
          onSuccess();
        }
        return { ...user, edit: newEdit };
      }
      return user;
    }));
  };

  const handleAdminToggle = (name: string) => {
    setUsers(prev => prev.map(user => {
      if (user.name === name) {
        return { ...user, admin: !user.admin };
      }
      return user;
    }));
  };

  return (
    <Card sx={{ width: 650 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Permissions
        </Typography>

        {/* Toolbar (distractors) */}
        <Box sx={{ display: 'flex', gap: 1, mb: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField
            size="small"
            placeholder="Search users..."
            InputProps={{
              startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
            sx={{ width: 200 }}
          />
          <Chip label="Active" size="small" />
          <Chip label="Pending" size="small" variant="outlined" />
          <Button size="small" variant="outlined">
            Bulk actions
          </Button>
        </Box>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell align="center">View</TableCell>
              <TableCell align="center">Edit</TableCell>
              <TableCell align="center">Admin</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(user => (
              <TableRow key={user.name}>
                <TableCell>{user.name}</TableCell>
                <TableCell align="center">
                  <VisibilityIcon fontSize="small" color="success" />
                </TableCell>
                <TableCell align="center">
                  <ToggleButton
                    value="edit"
                    selected={user.edit}
                    onChange={() => handleEditToggle(user.name)}
                    aria-pressed={user.edit}
                    aria-label={`${user.name} — Edit`}
                    data-testid={`${user.name.toLowerCase()}-edit-toggle`}
                    size="small"
                    color="primary"
                  >
                    {user.edit ? <CheckIcon fontSize="small" /> : <EditIcon fontSize="small" />}
                  </ToggleButton>
                </TableCell>
                <TableCell align="center">
                  <ToggleButton
                    value="admin"
                    selected={user.admin}
                    onChange={() => handleAdminToggle(user.name)}
                    aria-pressed={user.admin}
                    aria-label={`${user.name} — Admin`}
                    data-testid={`${user.name.toLowerCase()}-admin-toggle`}
                    size="small"
                    color="primary"
                  >
                    {user.admin ? <CheckIcon fontSize="small" /> : <AdminPanelSettingsIcon fontSize="small" />}
                  </ToggleButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
