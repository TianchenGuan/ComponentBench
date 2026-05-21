'use client';

/**
 * meter-mui-T09: Drag to set Server B Load meter in table (MUI)
 *
 * Setup Description:
 * A dense table lists three servers with a "Load" column containing meters.
 * - Layout: table_cell; placement center.
 * - Spacing: compact (tight rows).
 * - Clutter: high (sortable headers, filter chips above, and row action icon buttons).
 * - Component: MUI LinearProgress used as a meter approximation inside each row.
 * - Instances: 3 meters, one per row (Server A, Server B, Server C). All look identical.
 * - Interaction: meters support click-and-drag on the bar to set value continuously. 
 *   Releasing mouse commits the value.
 * - Observability: a small numeric percent is shown in the same cell (e.g., "15%").
 * - Initial state: Server B is 15%.
 * - Feedback: value highlights briefly after commit; no Apply/Save.
 *
 * Success: Server B Load meter value is 42% (±1 percentage point).
 */

import React, { useState, useEffect, useRef } from 'react';
import { Box, Paper, Typography, LinearProgress, TextField, Chip, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import DeleteIcon from '@mui/icons-material/Delete';
import type { TaskComponentProps } from '../types';

interface ServerData {
  id: string;
  name: string;
  load: number;
  isInteractive: boolean;
}

export default function T09({ onSuccess }: TaskComponentProps) {
  const [serverB, setServerB] = useState(15);
  const [serverC, setServerC] = useState(60);
  const [isDragging, setIsDragging] = useState(false);
  const [dragTarget, setDragTarget] = useState<string | null>(null);
  const successFiredRef = useRef(false);

  useEffect(() => {
    if (Math.abs(serverB - 42) <= 1 && !successFiredRef.current) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [serverB, onSuccess]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>, serverId: string) => {
    if (serverId === 'A') return;
    setIsDragging(true);
    setDragTarget(serverId);
    updateValue(e, serverId);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !dragTarget) return;
    updateValue(e, dragTarget);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragTarget(null);
  };

  const updateValue = (e: React.MouseEvent<HTMLDivElement>, serverId: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.round((x / rect.width) * 100);
    const clampedPercent = Math.max(0, Math.min(100, percent));
    
    if (serverId === 'B') {
      setServerB(clampedPercent);
    } else if (serverId === 'C') {
      setServerC(clampedPercent);
    }
  };

  const servers: ServerData[] = [
    { id: 'A', name: 'Server A', load: 45, isInteractive: false },
    { id: 'B', name: 'Server B', load: serverB, isInteractive: true },
    { id: 'C', name: 'Server C', load: serverC, isInteractive: true },
  ];

  return (
    <Paper elevation={2} sx={{ p: 2, width: 600 }}>
      <Typography variant="h6" gutterBottom>
        Servers
      </Typography>
      
      {/* Filter chips */}
      <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
        <TextField placeholder="Search..." size="small" sx={{ width: 200 }} />
        <Chip label="Active" color="primary" size="small" />
        <Chip label="All" variant="outlined" size="small" />
      </Box>

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel>Server</TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel>Load</TableSortLabel>
              </TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {servers.map((server) => (
              <TableRow key={server.id}>
                <TableCell>{server.name}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      onMouseDown={(e) => handleMouseDown(e, server.id)}
                      onMouseMove={handleMouseMove}
                      onMouseUp={handleMouseUp}
                      onMouseLeave={handleMouseUp}
                      sx={{ 
                        flex: 1, 
                        cursor: server.isInteractive ? 'pointer' : 'default',
                        userSelect: 'none'
                      }}
                      data-testid={`meter-load-server-${server.id.toLowerCase()}`}
                      data-meter-value={server.load}
                      role="meter"
                      aria-valuenow={server.load}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${server.name} Load`}
                    >
                      <LinearProgress 
                        variant="determinate" 
                        value={server.load}
                        sx={{ height: 8 }}
                      />
                    </Box>
                    <Typography variant="caption" sx={{ minWidth: 35 }}>
                      {server.load}%
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small">
                    <SettingsIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" color="error">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
