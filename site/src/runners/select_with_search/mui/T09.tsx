'use client';

/**
 * select_with_search-mui-T09: Edit Server 2 region in a compact table
 *
 * Layout: table_cell scene. A table titled "Servers" is centered on the page.
 * Spacing: compact; table rows are tight and the Region inputs use small size styling.
 * There are three rows, each with a same-type Region field implemented as a MUI Autocomplete:
 *  - Row "Server 1" → Region (current: us-east-1)
 *  - Row "Server 2" → Region (current: us-west-2) ← TARGET
 *  - Row "Server 3" → Region (current: eu-central-1)
 * Options: a list of cloud regions with similar strings (us-east-1, us-east-2, us-west-1, us-west-2, eu-central-1, eu-west-1, ap-southeast-1).
 * Interaction: click into the Row "Server 2" Region input, type to filter, and select the exact region string.
 * Clutter (medium): other columns (Name, Status) and action icons are visible but do not affect success.
 *
 * Success: The Region Autocomplete in the "Server 2" row equals "us-east-2".
 */

import React, { useState } from 'react';
import { 
  Card, CardContent, Typography, Autocomplete, TextField,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, IconButton
} from '@mui/material';
import { Settings, Delete } from '@mui/icons-material';
import type { TaskComponentProps } from '../types';

const regionOptions = [
  'us-east-1',
  'us-east-2',
  'us-west-1',
  'us-west-2',
  'eu-central-1',
  'eu-west-1',
  'ap-southeast-1',
];

interface ServerRow {
  id: string;
  name: string;
  region: string;
  status: 'running' | 'stopped';
}

export default function T09({ onSuccess }: TaskComponentProps) {
  const [servers, setServers] = useState<ServerRow[]>([
    { id: '1', name: 'Server 1', region: 'us-east-1', status: 'running' },
    { id: '2', name: 'Server 2', region: 'us-west-2', status: 'running' },
    { id: '3', name: 'Server 3', region: 'eu-central-1', status: 'stopped' },
  ]);

  const handleRegionChange = (serverId: string, newRegion: string | null) => {
    setServers(prev => prev.map(server => 
      server.id === serverId ? { ...server, region: newRegion || '' } : server
    ));
    
    // Check success for Server 2
    if (serverId === '2' && newRegion === 'us-east-2') {
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 700 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Servers</Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Region</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {servers.map((server) => (
                <TableRow key={server.id}>
                  <TableCell>{server.name}</TableCell>
                  <TableCell>
                    <Autocomplete
                      data-testid={`region-select-${server.id}`}
                      size="small"
                      options={regionOptions}
                      value={server.region}
                      onChange={(_e, newValue) => handleRegionChange(server.id, newValue)}
                      sx={{ width: 180 }}
                      renderInput={(params) => (
                        <TextField {...params} size="small" />
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={server.status} 
                      size="small"
                      color={server.status === 'running' ? 'success' : 'default'}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton size="small"><Settings fontSize="small" /></IconButton>
                    <IconButton size="small"><Delete fontSize="small" /></IconButton>
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
