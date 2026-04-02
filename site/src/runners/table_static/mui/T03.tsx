'use client';

/**
 * table_static-mui-T03: Select row matching a visual status chip
 *
 * A centered isolated card shows a read-only Tasks table using Material UI Table components. Columns:
 * Task, Owner, Due, Status. The Status column renders colored MUI Chip components (e.g., "On track" green, "At risk" amber,
 * "Overdue" red). Above the table, a 'Reference' chip is displayed (visual cue only; no text instruction beyond "Match
 * this status"). Multiple rows exist with different chips; only one row has the same status chip as the reference. Clicking
 * a row selects/highlights it (single-select).
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
  Chip,
  Box,
} from '@mui/material';
import type { TaskComponentProps } from '../types';

interface TaskData {
  key: string;
  task: string;
  owner: string;
  due: string;
  status: 'On track' | 'At risk' | 'Overdue';
}

const tasksData: TaskData[] = [
  { key: 'TSK-10', task: 'Update documentation', owner: 'Alice', due: 'Dec 20', status: 'On track' },
  { key: 'TSK-11', task: 'Review pull requests', owner: 'Bob', due: 'Dec 18', status: 'Overdue' },
  { key: 'TSK-12', task: 'Deploy to staging', owner: 'Carol', due: 'Dec 22', status: 'On track' },
  { key: 'TSK-13', task: 'Fix login bug', owner: 'David', due: 'Dec 15', status: 'Overdue' },
  { key: 'TSK-14', task: 'Write unit tests', owner: 'Eva', due: 'Dec 19', status: 'At risk' },
  { key: 'TSK-15', task: 'Optimize queries', owner: 'Frank', due: 'Dec 25', status: 'On track' },
];

const getChipColor = (status: string): 'success' | 'warning' | 'error' => {
  switch (status) {
    case 'On track': return 'success';
    case 'At risk': return 'warning';
    case 'Overdue': return 'error';
    default: return 'success';
  }
};

// Reference status is "At risk" - matches TSK-14
const referenceStatus = 'At risk';

export default function T03({ onSuccess }: TaskComponentProps) {
  const [selectedRowKey, setSelectedRowKey] = useState<string | null>(null);

  const handleRowClick = (record: TaskData) => {
    setSelectedRowKey(record.key);
    if (record.key === 'TSK-14') {
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 650 }}>
      <CardContent>
        {/* Reference chip */}
        <Box
          sx={{
            mb: 2,
            p: 1.5,
            backgroundColor: 'grey.100',
            borderRadius: 1,
            border: '1px dashed',
            borderColor: 'grey.400',
          }}
          data-reference-id="ref-status-chip"
        >
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
            Reference: Match this status
          </Typography>
          <Chip label={referenceStatus} color={getChipColor(referenceStatus)} size="small" />
        </Box>

        <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 2 }}>
          Tasks
        </Typography>
        <TableContainer component={Paper} variant="outlined">
          <Table size="medium">
            <TableHead>
              <TableRow>
                <TableCell>Task</TableCell>
                <TableCell>Owner</TableCell>
                <TableCell>Due</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasksData.map((row) => (
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
                  <TableCell>{row.task}</TableCell>
                  <TableCell>{row.owner}</TableCell>
                  <TableCell>{row.due}</TableCell>
                  <TableCell>
                    <Chip label={row.status} color={getChipColor(row.status)} size="small" />
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
