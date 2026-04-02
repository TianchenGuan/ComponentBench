'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Link, Snackbar, Alert, Box, Select, MenuItem, FormControl, InputLabel, Button, Toolbar } from '@mui/material';
import { Refresh } from '@mui/icons-material';
import type { TaskComponentProps } from '../types';
import { createMockBlobUrl } from '../types';

export default function T07({ task, onSuccess }: TaskComponentProps) {
  const [completed, setCompleted] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const blobUrlRef = useRef<Record<string, string>>({});

  const rows = [
    { id: 'dec2025', month: 'December 2025', total: '$12,500', status: 'Paid' },
    { id: 'jan2026', month: 'January 2026', total: '$15,800', status: 'Pending' },
  ];

  useEffect(() => {
    rows.forEach(row => {
      blobUrlRef.current[row.id] = createMockBlobUrl(`invoice-${row.id}.csv`, 'Invoice data');
    });
    return () => { Object.values(blobUrlRef.current).forEach(url => URL.revokeObjectURL(url)); };
  }, []);

  const handleDownload = (id: string) => {
    if (id === 'jan2026' && !completed) {
      setSnackbarOpen(true);
      setCompleted(true);
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 600 }}>
      <CardHeader title="Invoices" />
      <CardContent>
        <Toolbar disableGutters sx={{ gap: 2, mb: 2 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}><InputLabel>Filter</InputLabel><Select label="Filter" defaultValue="all"><MenuItem value="all">All</MenuItem></Select></FormControl>
          <Button variant="outlined" size="small">New invoice</Button>
        </Toolbar>
        <TableContainer>
          <Table size="small">
            <TableHead><TableRow><TableCell>Month</TableCell><TableCell>Total</TableCell><TableCell>Status</TableCell><TableCell>Export</TableCell></TableRow></TableHead>
            <TableBody>
              {rows.map(row => (
                <TableRow key={row.id}>
                  <TableCell>{row.month}</TableCell>
                  <TableCell>{row.total}</TableCell>
                  <TableCell>{row.status}</TableCell>
                  <TableCell>
                    <Link href="#" onClick={(e: React.MouseEvent) => { e.preventDefault(); handleDownload(row.id); }} data-testid={`download-${row.id}`} style={{ cursor: 'pointer' }}>
                      Download CSV
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)}>
        <Alert severity="success">Download started: invoice-jan-2026.csv</Alert>
      </Snackbar>
    </Card>
  );
}
