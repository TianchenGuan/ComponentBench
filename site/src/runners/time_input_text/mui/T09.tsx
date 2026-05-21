'use client';

/**
 * time_input_text-mui-T09: Edit a small TimeField inside a dense table
 * 
 * Layout: table_cell with the table anchored near the top-left. Light theme with compact spacing.
 * A dense table titled "Backup schedule" is shown with three rows: Server 1, Server 2, Server 3.
 * Each row has a "Backup time" cell containing a MUI X TimeField rendered at size='small'.
 * - Configuration: format='HH:mm', clearable=false.
 * - Initial values: Server 1 = 01:00, Server 2 = 01:30, Server 3 = 02:00.
 * - Target: the TimeField in row "Server 3".
 * Clutter=high: additional columns include "Status" (chips) and an "Actions" menu button per row.
 * Only the Server 3 Backup time value determines success.
 * 
 * Success: In the "Backup schedule" table, the TimeField in row "Server 3" under "Backup time" equals 02:10.
 */

import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, Typography, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Chip, IconButton, Paper 
} from '@mui/material';
import { TimeField } from '@mui/x-date-pickers/TimeField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

interface ServerRow {
  id: string;
  name: string;
  backupTime: Dayjs | null;
  status: string;
}

export default function T09({ onSuccess }: TaskComponentProps) {
  const [servers, setServers] = useState<ServerRow[]>([
    { id: 'server-1', name: 'Server 1', backupTime: dayjs('01:00', 'HH:mm'), status: 'Healthy' },
    { id: 'server-2', name: 'Server 2', backupTime: dayjs('01:30', 'HH:mm'), status: 'Healthy' },
    { id: 'server-3', name: 'Server 3', backupTime: dayjs('02:00', 'HH:mm'), status: 'Warning' },
  ]);

  useEffect(() => {
    const server3 = servers.find(s => s.id === 'server-3');
    if (server3 && server3.backupTime && server3.backupTime.isValid() && server3.backupTime.format('HH:mm') === '02:10') {
      onSuccess();
    }
  }, [servers, onSuccess]);

  const handleTimeChange = (id: string, newTime: Dayjs | null) => {
    setServers(prev => prev.map(server => 
      server.id === id ? { ...server, backupTime: newTime } : server
    ));
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card sx={{ width: 550 }}>
        <CardContent sx={{ p: 1.5 }}>
          <Typography variant="h6" gutterBottom sx={{ mb: 1 }}>Backup schedule</Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ py: 1 }}>Server</TableCell>
                  <TableCell sx={{ py: 1 }}>Backup time</TableCell>
                  <TableCell sx={{ py: 1 }}>Status</TableCell>
                  <TableCell sx={{ py: 1 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {servers.map((server) => (
                  <TableRow key={server.id} data-row-id={server.id}>
                    <TableCell sx={{ py: 0.5 }}>{server.name}</TableCell>
                    <TableCell sx={{ py: 0.5, width: 150 }} data-col-id="backup-time">
                      <TimeField
                        value={server.backupTime}
                        onChange={(newTime) => handleTimeChange(server.id, newTime)}
                        format="HH:mm"
                        slotProps={{
                          textField: {
                            size: 'small',
                            sx: { width: 120 },
                            inputProps: {
                              'data-testid': `backup-time-${server.id}`,
                            },
                          },
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ py: 0.5 }}>
                      <Chip 
                        label={server.status} 
                        size="small"
                        color={server.status === 'Healthy' ? 'success' : 'warning'}
                      />
                    </TableCell>
                    <TableCell sx={{ py: 0.5 }}>
                      <IconButton size="small">
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
}
