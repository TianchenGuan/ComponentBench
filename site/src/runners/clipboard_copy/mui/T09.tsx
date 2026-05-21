'use client';

/**
 * clipboard_copy-mui-T09: Copy Production base URL from compact table
 *
 * Layout: table_cell, anchored near the bottom-left (placement=bottom_left).
 * Universal factors: spacing=compact, scale=small.
 *
 * The page contains a compact MUI Table labeled "Environments" with three rows (Dev, Staging, Production). Column "Base URL" shows a URL string and a small IconButton copy control in the same cell.
 * - Dev: https://api.example.com/dev/v1
 * - Staging: https://api.example.com/staging/v1
 * - Production: https://api.example.com/prod/v1  (target)
 *
 * Component behavior:
 * - Clicking the copy IconButton in a row copies that row's full Base URL and shows a snackbar "Copied".
 *
 * Distractors: column sort icons and a pagination footer (not required).
 * Requirement: instances=3; target instance is the Production row's copy icon.
 *
 * Success: Clipboard text equals "https://api.example.com/prod/v1".
 */

import React, { useState } from 'react';
import { Card, CardHeader, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, IconButton, Tooltip, Typography, Snackbar, Alert, Box, TablePagination } from '@mui/material';
import { ContentCopy, Check } from '@mui/icons-material';
import type { TaskComponentProps } from '../types';
import { copyToClipboard } from '../types';

const environments = [
  { id: 'dev', name: 'Dev', url: 'https://api.example.com/dev/v1' },
  { id: 'staging', name: 'Staging', url: 'https://api.example.com/staging/v1' },
  { id: 'production', name: 'Production', url: 'https://api.example.com/prod/v1' },  // target
];

const targetUrl = 'https://api.example.com/prod/v1';

export default function T09({ task, onSuccess }: TaskComponentProps) {
  const [completed, setCompleted] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleCopy = async (url: string, id: string) => {
    await copyToClipboard(url, `${id} row`);
    setCopiedId(id);
    setSnackbarOpen(true);
    setTimeout(() => setCopiedId(null), 2000);

    // Only complete if Production URL was copied
    if (url === targetUrl && !completed) {
      setCompleted(true);
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 550 }} data-testid="environments-table-card">
      <CardHeader title="Environments" titleTypographyProps={{ variant: 'subtitle1' }} />
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel>Environment</TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel>Base URL</TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {environments.map((env) => (
              <TableRow key={env.id} data-testid={`row-${env.id}`}>
                <TableCell>
                  <Typography variant="body2">{env.name}</Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: 'monospace',
                        fontSize: 11,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: 280,
                      }}
                    >
                      {env.url}
                    </Typography>
                    <Tooltip title={copiedId === env.id ? 'Copied' : `Copy base URL for ${env.name}`}>
                      <IconButton
                        size="small"
                        onClick={() => handleCopy(env.url, env.id)}
                        data-testid={`copy-${env.id}-url`}
                        aria-label={`Copy base URL for ${env.name}`}
                        sx={{ p: 0.25 }}
                      >
                        {copiedId === env.id ? (
                          <Check sx={{ fontSize: 14 }} color="success" />
                        ) : (
                          <ContentCopy sx={{ fontSize: 14 }} />
                        )}
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={3}
        page={0}
        rowsPerPage={10}
        onPageChange={() => {}}
        onRowsPerPageChange={() => {}}
        rowsPerPageOptions={[10]}
      />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSnackbarOpen(false)}>
          Copied
        </Alert>
      </Snackbar>
    </Card>
  );
}
