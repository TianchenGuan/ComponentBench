'use client';

/**
 * autocomplete_restricted-mui-v2-T04
 *
 * Dashboard table with Node 1 (read-only), Node 2, Node 3 editable Availability zone cells.
 * Each editable row has a restricted MUI Autocomplete and a row-local Save button.
 * Success: Node 3 AZ = us-east-1c, Node 2 unchanged (us-east-1b), Node 3 Save clicked.
 */

import React, { useEffect, useRef, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import type { TaskComponentProps } from '../../types';

const azOptions = ['us-east-1a', 'us-east-1b', 'us-east-1c', 'us-east-1d'];

export default function T04({ onSuccess }: TaskComponentProps) {
  const [node2Az, setNode2Az] = useState<string | null>('us-east-1b');
  const [node3Az, setNode3Az] = useState<string | null>('us-east-1a');
  const [node3Saved, setNode3Saved] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (node3Saved && node3Az === 'us-east-1c' && node2Az === 'us-east-1b') {
      successFired.current = true;
      onSuccess();
    }
  }, [node3Saved, node3Az, node2Az, onSuccess]);

  const rows = [
    { name: 'Node 1', health: 'healthy', az: 'us-east-1a', editable: false },
    { name: 'Node 2', health: 'healthy', az: node2Az, editable: true },
    { name: 'Node 3', health: 'warning', az: node3Az, editable: true },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 2, mb: 2, background: '#f5f5f5' }}>
        <Typography variant="subtitle2">Node health dashboard</Typography>
        <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
          <Chip label="CPU: 42%" size="small" color="success" />
          <Chip label="Memory: 68%" size="small" color="warning" />
          <Chip label="Requests: 1.2k/s" size="small" />
        </Box>
      </Paper>

      <TableContainer component={Paper} sx={{ maxWidth: 650 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Node</TableCell>
              <TableCell>Health</TableCell>
              <TableCell>Availability zone</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.name}>
                <TableCell><Typography variant="body2" fontWeight={600}>{row.name}</Typography></TableCell>
                <TableCell>
                  <Chip
                    label={row.health}
                    size="small"
                    color={row.health === 'healthy' ? 'success' : 'warning'}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  {row.editable ? (
                    <Autocomplete
                      size="small"
                      options={azOptions}
                      value={row.az ?? undefined}
                      onChange={(_, v) => {
                        if (row.name === 'Node 2') { setNode2Az(v); }
                        if (row.name === 'Node 3') { setNode3Az(v); setNode3Saved(false); }
                      }}
                      freeSolo={false}
                      disableClearable
                      renderInput={(params) => <TextField {...params} size="small" />}
                      sx={{ width: 170 }}
                    />
                  ) : (
                    <Typography variant="body2">{row.az}</Typography>
                  )}
                </TableCell>
                <TableCell>
                  {row.editable ? (
                    <Button
                      size="small"
                      variant="contained"
                      data-testid={`save-${row.name.toLowerCase().replace(' ', '-')}`}
                      onClick={() => {
                        if (row.name === 'Node 3') setNode3Saved(true);
                      }}
                    >
                      Save
                    </Button>
                  ) : null}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
