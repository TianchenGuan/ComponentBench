'use client';

/**
 * combobox_editable_single-mui-T08: Set Assignee in a table row (Bug #1842 → Alex Kim)
 *
 * A small issues table is shown (table_cell layout).
 * Each row has an editable "Assignee" cell implemented with MUI Autocomplete.
 * - Scene: table_cell layout, center placement, light theme, COMPACT spacing, SMALL scale.
 * - Instances: 3 Autocomplete instances (one per row's Assignee cell):
 *   - Bug #1839 → Assignee
 *   - Bug #1842 → Assignee (target row)
 *   - Bug #1847 → Assignee
 * - Options: Alex Kim, Alexa King, Alice Johnson, Ben Wong, Carlos Diaz, Dana Patel, Emma Stone, George Kim, Hannah Lee, Priya Singh.
 * - Initial state: all three Assignee cells show "Unassigned".
 * - Distractors: other columns (Status, Priority), toolbar with filters.
 *
 * Success: In the issues table, the Assignee combobox in row "Bug #1842" equals "Alex Kim".
 */

import React, { useState } from 'react';
import { Autocomplete, TextField, Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Box, Button } from '@mui/material';
import type { TaskComponentProps } from '../types';

const assignees = [
  'Alex Kim', 'Alexa King', 'Alice Johnson', 'Ben Wong', 'Carlos Diaz',
  'Dana Patel', 'Emma Stone', 'George Kim', 'Hannah Lee', 'Priya Singh',
];

interface Issue {
  id: string;
  status: string;
  priority: string;
  assignee: string | null;
}

export default function T08({ onSuccess }: TaskComponentProps) {
  const [issues, setIssues] = useState<Issue[]>([
    { id: 'Bug #1839', status: 'Open', priority: 'Medium', assignee: null },
    { id: 'Bug #1842', status: 'In Progress', priority: 'High', assignee: null },
    { id: 'Bug #1847', status: 'Open', priority: 'Low', assignee: null },
  ]);

  const handleAssigneeChange = (issueId: string, newValue: string | null) => {
    setIssues(prev => prev.map(issue => 
      issue.id === issueId ? { ...issue, assignee: newValue } : issue
    ));
    
    if (issueId === 'Bug #1842' && newValue === 'Alex Kim') {
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 650 }}>
      <CardContent sx={{ p: 1.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
          <Typography variant="subtitle1">Issues</Typography>
          <Box>
            <Button size="small" variant="outlined" sx={{ mr: 1 }}>Filter</Button>
            <Button size="small" variant="outlined">Sort</Button>
          </Box>
        </Box>
        
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontSize: 12 }}>Issue</TableCell>
                <TableCell sx={{ fontSize: 12 }}>Status</TableCell>
                <TableCell sx={{ fontSize: 12 }}>Priority</TableCell>
                <TableCell sx={{ fontSize: 12, minWidth: 180 }}>Assignee</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {issues.map((issue) => (
                <TableRow key={issue.id} data-rowid={issue.id.replace('Bug #', '')}>
                  <TableCell sx={{ fontSize: 12 }}>{issue.id}</TableCell>
                  <TableCell>
                    <Chip label={issue.status} size="small" sx={{ fontSize: 10 }} />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={issue.priority} 
                      size="small" 
                      sx={{ fontSize: 10 }}
                      color={issue.priority === 'High' ? 'error' : issue.priority === 'Medium' ? 'warning' : 'default'}
                    />
                  </TableCell>
                  <TableCell data-col="assignee">
                    <Autocomplete
                      data-testid={`assignee-${issue.id.replace('Bug #', '')}`}
                      freeSolo
                      size="small"
                      options={assignees}
                      value={issue.assignee}
                      onChange={(_event, newValue) => handleAssigneeChange(issue.id, newValue as string | null)}
                      renderInput={(params) => (
                        <TextField 
                          {...params} 
                          placeholder="Unassigned" 
                          sx={{ '& .MuiInputBase-input': { fontSize: 12 } }}
                        />
                      )}
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
