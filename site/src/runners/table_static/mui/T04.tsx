'use client';

/**
 * table_static-mui-T04: Scroll within a compact audit table
 *
 * A centered isolated card contains a read-only Audit Events table built with Material UI Table components.
 * Spacing is set to compact, reducing padding between rows and making the table denser. The table body is inside an internal
 * scroll container with a fixed height; ~120 rows exist and only ~12 are visible at once. Columns: Time, Event, Actor. Rows
 * are single-select (row highlight + aria-selected). EV-203 is not visible initially and requires scrolling inside the table
 * body.
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
} from '@mui/material';
import type { TaskComponentProps } from '../types';

interface AuditEventData {
  key: string;
  time: string;
  event: string;
  actor: string;
}

// Generate 120 rows of audit event data
const generateAuditEventData = (): AuditEventData[] => {
  const actors = ['admin@corp.com', 'user1@corp.com', 'system', 'api-bot', 'scheduler'];
  const events = ['Login', 'Logout', 'File upload', 'Config change', 'API request', 'Permission grant', 'Data export'];
  
  return Array.from({ length: 120 }, (_, i) => ({
    key: `EV-${i + 101}`,
    time: `12/${String(20 - Math.floor(i / 20)).padStart(2, '0')} ${String(8 + (i % 12)).padStart(2, '0')}:${String((i * 5) % 60).padStart(2, '0')}`,
    event: `EV-${i + 101}`,
    actor: actors[i % actors.length],
  }));
};

const auditEventData = generateAuditEventData();

export default function T04({ onSuccess }: TaskComponentProps) {
  const [selectedRowKey, setSelectedRowKey] = useState<string | null>(null);

  const handleRowClick = (record: AuditEventData) => {
    setSelectedRowKey(record.key);
    if (record.key === 'EV-203') {
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 550 }}>
      <CardContent>
        <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 2 }}>
          Audit Events
        </Typography>
        <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 350 }}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Time</TableCell>
                <TableCell>Event</TableCell>
                <TableCell>Actor</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {auditEventData.map((row) => (
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
                  <TableCell>{row.time}</TableCell>
                  <TableCell>{row.event}</TableCell>
                  <TableCell>{row.actor}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}
