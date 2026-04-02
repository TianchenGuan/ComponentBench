'use client';

/**
 * table_static-mui-T06: Clear selection in an API keys table
 *
 * The page is a settings_panel with several sections; the API Keys section contains a read-only MUI Table
 * listing keys. Clutter is low: there are a couple of descriptive paragraphs and a disabled "Create key" button, but no
 * other required interactions. The first API key row starts selected/highlighted. A small icon-only control labeled "Clear
 * selection" appears in the table toolbar area (top-right of the card). Clicking it removes any selected row highlight (selection
 * becomes empty).
 */

import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  IconButton,
  Tooltip,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import type { TaskComponentProps } from '../types';

interface APIKeyData {
  key: string;
  name: string;
  prefix: string;
  created: string;
  lastUsed: string;
}

const apiKeysData: APIKeyData[] = [
  { key: 'key-1', name: 'Production API', prefix: 'sk_live_***abc', created: 'Nov 1, 2024', lastUsed: 'Dec 15, 2024' },
  { key: 'key-2', name: 'Development API', prefix: 'sk_test_***xyz', created: 'Oct 15, 2024', lastUsed: 'Dec 10, 2024' },
  { key: 'key-3', name: 'CI/CD Pipeline', prefix: 'sk_live_***def', created: 'Sep 1, 2024', lastUsed: 'Dec 14, 2024' },
  { key: 'key-4', name: 'Staging Server', prefix: 'sk_test_***ghi', created: 'Aug 20, 2024', lastUsed: 'Dec 12, 2024' },
];

export default function T06({ onSuccess }: TaskComponentProps) {
  const [selectedRowKey, setSelectedRowKey] = useState<string | null>('key-1');

  const handleClearSelection = () => {
    setSelectedRowKey(null);
    onSuccess();
  };

  const handleRowClick = (record: APIKeyData) => {
    setSelectedRowKey(record.key);
  };

  return (
    <Card sx={{ width: 650 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Settings
        </Typography>

        {/* Low clutter content */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Manage your account settings and API access credentials below.
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Account Information
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Your account is on the Professional plan. Contact support to upgrade.
          </Typography>
        </Box>

        {/* API Keys section */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
            API Keys
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Tooltip title="Clear selection">
              <IconButton 
                size="small" 
                onClick={handleClearSelection}
                aria-label="Clear selection"
                data-testid="cb-clear-selection"
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Button variant="outlined" size="small" disabled>
              Create key
            </Button>
          </Box>
        </Box>

        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Key prefix</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Last used</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {apiKeysData.map((row) => (
                <TableRow
                  key={row.key}
                  onClick={() => handleRowClick(row)}
                  aria-selected={selectedRowKey === row.key}
                  data-row-key={row.key}
                  sx={{
                    cursor: 'pointer',
                    backgroundColor: selectedRowKey === row.key ? 'action.selected' : undefined,
                    '&:hover': {
                      backgroundColor: selectedRowKey === row.key ? 'action.selected' : 'action.hover',
                    },
                  }}
                >
                  <TableCell>{row.name}</TableCell>
                  <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.85em' }}>{row.prefix}</TableCell>
                  <TableCell>{row.created}</TableCell>
                  <TableCell>{row.lastUsed}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}
