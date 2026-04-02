'use client';

/**
 * radio_group-mui-T10: User table: set Carol's role to Editor
 *
 * A table_cell layout shows a compact "Users" table in the center of the viewport.
 * Rows are labeled: Alice, Bob, Carol. The "Role" column contains an inline MUI RadioGroup for each row with three options: Viewer, Editor, Owner.
 * Initial state:
 * - Alice: Owner
 * - Bob: Viewer
 * - Carol: Viewer
 * The radio controls in the table are compact and closely spaced; each row looks very similar.
 * When a role changes, an inline checkmark appears briefly in that row ("Updated"). No global Save button.
 * Column headers and a table search field exist above the table as distractors but are not required.
 *
 * Success: In the instance corresponding to "Carol — Role", the selected value equals "editor" (label "Editor").
 */

import React, { useState } from 'react';
import {
  Card, CardContent, Typography, TextField, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  RadioGroup, FormControlLabel, Radio, Chip, Box
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import type { TaskComponentProps } from '../types';

interface UserRow {
  key: string;
  name: string;
  role: string;
  updated: boolean;
}

export default function T10({ onSuccess }: TaskComponentProps) {
  const [users, setUsers] = useState<UserRow[]>([
    { key: 'alice', name: 'Alice', role: 'owner', updated: false },
    { key: 'bob', name: 'Bob', role: 'viewer', updated: false },
    { key: 'carol', name: 'Carol', role: 'viewer', updated: false },
  ]);

  const handleRoleChange = (userKey: string, newRole: string) => {
    setUsers(prev => prev.map(user => 
      user.key === userKey 
        ? { ...user, role: newRole, updated: true }
        : user
    ));

    if (userKey === 'carol' && newRole === 'editor') {
      onSuccess();
    }

    // Clear updated indicator after 2 seconds
    setTimeout(() => {
      setUsers(prev => prev.map(user => 
        user.key === userKey 
          ? { ...user, updated: false }
          : user
      ));
    }, 2000);
  };

  return (
    <Card sx={{ width: 560 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Users</Typography>
        
        <TextField 
          size="small" 
          placeholder="Search users..." 
          fullWidth 
          sx={{ mb: 2 }}
        />

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sortDirection="asc">Name</TableCell>
                <TableCell>Role</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map(user => (
                <TableRow key={user.key} data-row-key={user.key}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>
                    <Box 
                      sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                      data-instance-label={`${user.name} — Role`}
                    >
                      <RadioGroup
                        row
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.key, e.target.value)}
                        data-canonical-type="radio_group"
                        data-selected-value={user.role}
                      >
                        <FormControlLabel 
                          value="viewer" 
                          control={<Radio size="small" />} 
                          label="Viewer"
                          sx={{ '& .MuiFormControlLabel-label': { fontSize: 13 } }}
                        />
                        <FormControlLabel 
                          value="editor" 
                          control={<Radio size="small" />} 
                          label="Editor"
                          sx={{ '& .MuiFormControlLabel-label': { fontSize: 13 } }}
                        />
                        <FormControlLabel 
                          value="owner" 
                          control={<Radio size="small" />} 
                          label="Owner"
                          sx={{ '& .MuiFormControlLabel-label': { fontSize: 13 } }}
                        />
                      </RadioGroup>
                      {user.updated && (
                        <Chip 
                          icon={<CheckCircleIcon />}
                          label="Updated" 
                          size="small" 
                          color="success"
                          sx={{ height: 24 }}
                        />
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}
