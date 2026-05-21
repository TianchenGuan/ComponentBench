'use client';

/**
 * tags_input-mui-T09: Scroll to find a rare option in a table cell
 *
 * The page shows a **table** titled "Users".
 * Two visible rows are shown:
 * - Alex
 * - Dana (target)
 *
 * The "Roles" column contains an embedded MUI Autocomplete (multiple selection rendered as chips) in each row.
 * The inputs are narrow due to the table cell width, making click targets smaller.
 *
 * Options behavior:
 * - The Roles Autocomplete uses a long list of predefined roles (~50).
 * - The listbox is scrollable; the role "internal" appears near the bottom of the list.
 * - Selecting an option adds it as a chip; chips may collapse/wrap visually in the narrow cell.
 *
 * Initial state:
 * - Dana row has one chip: "viewer".
 * - Alex row has chips: "admin", "do-not-edit".
 *
 * Distractors:
 * - Table has sortable headers and a search bar above it, but neither is required for success.
 * - Both Role fields look identical aside from the row label.
 *
 * Success: The target Tags Input component (Dana Roles) contains exactly these tags (order does not matter): admin, beta, internal.
 */

import React, { useRef, useEffect } from 'react';
import { 
  Card, CardContent, Typography, TextField, Autocomplete, Chip,
  Table, TableHead, TableBody, TableRow, TableCell, InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import type { TaskComponentProps } from '../types';

// Long list of roles
const roleOptions = [
  'admin', 'analyst', 'architect', 'auditor', 'beta', 'billing', 'compliance',
  'consultant', 'contributor', 'coordinator', 'developer', 'director', 'editor',
  'engineer', 'executive', 'finance', 'guest', 'hr', 'intern', 'internal',
  'lead', 'legal', 'maintainer', 'manager', 'marketing', 'member', 'moderator',
  'observer', 'operator', 'owner', 'participant', 'partner', 'planner', 'premium',
  'product', 'qa', 'reader', 'recruiter', 'reporter', 'reviewer', 'sales',
  'security', 'staff', 'stakeholder', 'subscriber', 'support', 'tester', 'trainer',
  'trial', 'user', 'vendor', 'viewer', 'volunteer'
];

export default function T09({ onSuccess }: TaskComponentProps) {
  const [alexRoles, setAlexRoles] = React.useState<string[]>(['admin', 'do-not-edit']);
  const [danaRoles, setDanaRoles] = React.useState<string[]>(['viewer']);
  const hasSucceeded = useRef(false);

  useEffect(() => {
    const normalizedTags = danaRoles.map(t => t.toLowerCase().trim());
    const requiredTags = ['admin', 'beta', 'internal'];
    const isSuccess = requiredTags.length === normalizedTags.length &&
      requiredTags.every(t => normalizedTags.includes(t));
    
    // Also verify Alex's roles remain unchanged
    const alexUnchanged = alexRoles.length === 2 && 
      alexRoles.includes('admin') && 
      alexRoles.includes('do-not-edit');
    
    if (isSuccess && alexUnchanged && !hasSucceeded.current) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [danaRoles, alexRoles, onSuccess]);

  return (
    <Card sx={{ width: 700 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Users</Typography>
        <TextField
          size="small"
          placeholder="Search users..."
          sx={{ mb: 2, width: 200 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell sx={{ width: 250 }}>Roles</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Alex</TableCell>
              <TableCell>alex@example.com</TableCell>
              <TableCell>
                <Autocomplete
                  multiple
                  size="small"
                  options={roleOptions}
                  value={alexRoles}
                  onChange={(_, newValue) => setAlexRoles(newValue)}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        label={option}
                        size="small"
                        {...getTagProps({ index })}
                        key={index}
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      size="small"
                      inputProps={{
                        ...params.inputProps,
                        'data-testid': 'alex-roles-input',
                        'aria-label': 'Alex Roles',
                      }}
                    />
                  )}
                  ListboxProps={{ style: { maxHeight: 200 } }}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Dana</TableCell>
              <TableCell>dana@example.com</TableCell>
              <TableCell>
                <Autocomplete
                  multiple
                  size="small"
                  options={roleOptions}
                  value={danaRoles}
                  onChange={(_, newValue) => setDanaRoles(newValue)}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        label={option}
                        size="small"
                        {...getTagProps({ index })}
                        key={index}
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      size="small"
                      inputProps={{
                        ...params.inputProps,
                        'data-testid': 'dana-roles-input',
                        'aria-label': 'Dana Roles',
                      }}
                    />
                  )}
                  ListboxProps={{ style: { maxHeight: 200 } }}
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
