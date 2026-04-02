'use client';

/**
 * switch-mui-T08: Table row toggle: Activate Project Beacon
 *
 * Layout: table_cell centered on the page with heading "Projects".
 * A MUI Table is displayed with columns: Project, Owner, and "Active" (Switch controls in the last column).
 * Three rows are visible: "Project Atlas", "Project Beacon" (target), and "Project Cascade".
 * Each row has an identical MUI Switch in the "Active" column aligned to the right edge of the cell.
 * Initial state: "Project Beacon" has Active OFF; the other rows have mixed states.
 * Clutter: high — column headers are clickable (sort affordances) and there is a search field above the table, but success depends only on the target switch state.
 * Feedback: toggling a row's switch updates immediately with no confirmation dialog.
 */

import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Switch,
  Paper
} from '@mui/material';
import type { TaskComponentProps } from '../types';

interface Project {
  id: string;
  name: string;
  owner: string;
  active: boolean;
}

export default function T08({ onSuccess }: TaskComponentProps) {
  const [data, setData] = useState<Project[]>([
    { id: 'project-atlas', name: 'Project Atlas', owner: 'Alex Johnson', active: true },
    { id: 'project-beacon', name: 'Project Beacon', owner: 'Morgan Chen', active: false },
    { id: 'project-cascade', name: 'Project Cascade', owner: 'Jordan Lee', active: false },
  ]);

  const handleSwitchChange = (id: string, checked: boolean) => {
    setData(prev => prev.map(row => 
      row.id === id ? { ...row, active: checked } : row
    ));
    if (id === 'project-beacon' && checked) {
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 600 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Projects
        </Typography>
        <TextField
          placeholder="Search projects..."
          size="small"
          fullWidth
          sx={{ mb: 2 }}
        />
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel>Project</TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel>Owner</TableSortLabel>
                </TableCell>
                <TableCell align="right">Active</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.id} data-rowkey={row.id}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.owner}</TableCell>
                  <TableCell align="right">
                    <Switch
                      checked={row.active}
                      onChange={(e) => handleSwitchChange(row.id, e.target.checked)}
                      data-testid={`active-${row.id}`}
                      inputProps={{ 'aria-checked': row.active }}
                    />
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
