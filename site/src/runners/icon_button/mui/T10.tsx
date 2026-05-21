'use client';

/**
 * icon_button-mui-T10: Lock the API Key row (table cell IconButton)
 *
 * Layout: table_cell centered in the viewport.
 * A compact table titled "Secrets" has four rows. Each row has a lock IconButton.
 * 
 * Success: The lock IconButton in the row labeled "API Key" has aria-pressed="true".
 */

import React, { useState } from 'react';
import { 
  Card, CardContent, Typography, IconButton, Box,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip
} from '@mui/material';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LockIcon from '@mui/icons-material/Lock';
import type { TaskComponentProps } from '../types';

interface SecretRow {
  id: string;
  name: string;
  value: string;
  lastRotated: string;
}

const secrets: SecretRow[] = [
  { id: 'api-key', name: 'API Key', value: '•••••••••', lastRotated: '2024-01-10' },
  { id: 'webhook', name: 'Webhook Secret', value: '•••••••••', lastRotated: '2024-01-05' },
  { id: 'db-password', name: 'DB Password', value: '•••••••••', lastRotated: '2023-12-20' },
  { id: 'smtp-token', name: 'SMTP Token', value: '•••••••••', lastRotated: '2023-12-15' },
];

export default function T10({ task, onSuccess }: TaskComponentProps) {
  const [locked, setLocked] = useState<Set<string>>(new Set());

  const handleToggle = (id: string) => {
    setLocked(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        if (id === 'api-key') {
          onSuccess();
        }
      }
      return next;
    });
  };

  return (
    <Card sx={{ width: 550 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Secrets
        </Typography>

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Value</TableCell>
                <TableCell>Last Rotated</TableCell>
                <TableCell align="right">Lock</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {secrets.map((secret) => {
                const isLocked = locked.has(secret.id);
                return (
                  <TableRow key={secret.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {secret.name}
                        {isLocked && (
                          <Chip 
                            label="Locked" 
                            size="small" 
                            color="primary"
                            sx={{ fontSize: 10, height: 18 }}
                          />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontFamily: 'monospace', color: 'text.secondary' }}>
                      {secret.value}
                    </TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontSize: 12 }}>
                      {secret.lastRotated}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => handleToggle(secret.id)}
                        aria-label={`Lock ${secret.name}`}
                        aria-pressed={isLocked}
                        data-testid={`mui-icon-btn-lock-${secret.id}`}
                        color={isLocked ? 'primary' : 'default'}
                      >
                        {isLocked ? <LockIcon fontSize="small" /> : <LockOpenIcon fontSize="small" />}
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}
