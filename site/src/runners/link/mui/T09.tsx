'use client';

/**
 * link-mui-T09: Open the correct user from a small-scale table of Details links
 * 
 * setup_description:
 * A table_cell scene presents a compact Users table rendered at small scale (smaller
 * typography and tighter column widths). The table has 8 rows; the first column shows
 * the user name, and the last column contains a Material UI Link labeled "Details" for
 * each row.
 * 
 * All action links have the same visible label ("Details"), making row-based selection
 * necessary. Initial route is "/users". Activating the Details link for a row navigates
 * to a detail view route (target: "/users/alicia-keys") and shows the user name in a
 * header above the table.
 * 
 * success_trigger:
 * - The "Details" link in the "Alicia Keys" row (data-testid="user-alicia-details") was activated.
 * - The current route pathname equals "/users/alicia-keys".
 * - The detail header displays "Alicia Keys".
 */

import React, { useState } from 'react';
import { 
  Card, CardHeader, CardContent, Link, Typography, Box,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow 
} from '@mui/material';
import type { TaskComponentProps } from '../types';

interface UserRow {
  key: string;
  name: string;
  email: string;
  path: string;
  testId: string;
}

const users: UserRow[] = [
  { key: 'alicia', name: 'Alicia Keys', email: 'alicia@example.com', path: '/users/alicia-keys', testId: 'user-alicia-details' },
  { key: 'albert', name: 'Albert King', email: 'albert@example.com', path: '/users/albert-king', testId: 'user-albert-details' },
  { key: 'alice', name: 'Alice Johnson', email: 'alice@example.com', path: '/users/alice-johnson', testId: 'user-alice-details' },
  { key: 'alina', name: 'Alina Chen', email: 'alina@example.com', path: '/users/alina-chen', testId: 'user-alina-details' },
  { key: 'alex', name: 'Alex Morgan', email: 'alex@example.com', path: '/users/alex-morgan', testId: 'user-alex-details' },
  { key: 'amy', name: 'Amy Brown', email: 'amy@example.com', path: '/users/amy-brown', testId: 'user-amy-details' },
  { key: 'adam', name: 'Adam Smith', email: 'adam@example.com', path: '/users/adam-smith', testId: 'user-adam-details' },
  { key: 'anna', name: 'Anna Lee', email: 'anna@example.com', path: '/users/anna-lee', testId: 'user-anna-details' },
];

export default function T09({ onSuccess }: TaskComponentProps) {
  const [route, setRoute] = useState('/users');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [activated, setActivated] = useState(false);

  const handleDetailsClick = (user: UserRow) => (e: React.MouseEvent) => {
    e.preventDefault();
    if (activated) return;
    
    setRoute(user.path);
    setSelectedUser(user.name);
    
    if (user.key === 'alicia') {
      setActivated(true);
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 500 }}>
      <CardHeader 
        title={selectedUser || 'Users'} 
        titleTypographyProps={{ variant: 'h6' }}
      />
      {selectedUser && (
        <Box sx={{ px: 2, py: 1, bgcolor: 'success.light' }}>
          <Typography variant="body2" data-testid="detail-title" fontWeight="bold">
            {selectedUser}
          </Typography>
        </Box>
      )}
      <CardContent sx={{ p: 0 }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontSize: '0.75rem' }}>Name</TableCell>
                <TableCell sx={{ fontSize: '0.75rem' }}>Email</TableCell>
                <TableCell sx={{ fontSize: '0.75rem' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.key}>
                  <TableCell sx={{ fontSize: '0.75rem', py: 0.5 }}>{user.name}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', py: 0.5 }}>{user.email}</TableCell>
                  <TableCell sx={{ py: 0.5 }}>
                    <Link
                      href={user.path}
                      onClick={handleDetailsClick(user)}
                      data-testid={user.testId}
                      sx={{ cursor: 'pointer', fontSize: '0.75rem' }}
                    >
                      Details
                    </Link>
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
